import { query, getConnection } from '../utils/db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { executeCode } from '../utils/codeExecutor.js';
import { recalculateGlobalRanks } from '../services/rankingService.js';
import { calculateScore } from '../utils/scoreCalculator.js';



const parseLangs = (val) => {
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(val)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
};

/* =====================================================
   GET /api/programs/:progId
===================================================== */
export const getProgram = catchAsync(async (req, res, next) => {
  const { progId } = req.params;

  const programs = await query(
    `SELECT
       prog_id, title, description, difficulty,
       constraints_text, time_limit_ms, memory_limit_mb,
       supported_languages, public_testcase_count, private_testcase_count
     FROM programs
     WHERE prog_id = ?`,
    [progId]
  );

  if (!programs.length) return next(new AppError('Program not found.', 404));

  const program = programs[0];
  program.supported_languages = parseLangs(program.supported_languages);

  const publicTestCases = await query(
    `SELECT test_case_id, input_data, expected_output, display_order
     FROM public_test_cases
     WHERE prog_id = ?
     ORDER BY display_order ASC`,
    [progId]
  );

  const placeholders = program.supported_languages.map(() => '?').join(',');
  const langTemplates = program.supported_languages.length
    ? await query(
        `SELECT lang_slug, lang_name, version_label, template
         FROM programming_languages
         WHERE lang_slug IN (${placeholders}) AND is_active = 1`,
        program.supported_languages
      )
    : [];

  let is_solved = false;
  if (req.user?.role === 'student') {
    const solved = await query(
      `SELECT 1 FROM solved_programs WHERE student_user_id = ? AND prog_id = ?`,
      [req.user.user_id, progId]
    );
    is_solved = solved.length > 0;
  }

  res.status(200).json({
    status: 'success',
    data: {
      program,
      public_test_cases: publicTestCases,
      lang_templates: langTemplates,
      is_solved,
    },
  });
});

/* =====================================================
   GET /api/programs/:progId/template?lang=python
===================================================== */
export const getLangTemplate = catchAsync(async (req, res, next) => {
  const { progId } = req.params;
  const { lang } = req.query;

  if (!lang) return next(new AppError('Please provide lang query param.', 400));

  const programs = await query(
    `SELECT supported_languages FROM programs WHERE prog_id = ?`,
    [progId]
  );

  if (!programs.length) return next(new AppError('Program not found.', 404));

  const supported = parseLangs(programs[0].supported_languages);

  if (!supported.includes(lang))
    return next(
      new AppError(`Language "${lang}" is not supported for this program.`, 400)
    );

  const langs = await query(
    `SELECT lang_slug, lang_name, version_label, template
     FROM programming_languages
     WHERE lang_slug = ? AND is_active = 1`,
    [lang]
  );

  if (!langs.length) return next(new AppError('Language not found.', 404));

  res.status(200).json({
    status: 'success',
    data: { lang_template: langs[0] },
  });
});

/* =====================================================
   POST /api/programs/:progId/run
===================================================== */
export const runProgram = catchAsync(async (req, res, next) => {
  const { progId } = req.params;
  const { lang, code } = req.body;

  if (!lang || !code)
    return next(new AppError('Please provide lang and code.', 400));

  const programs = await query(
    `SELECT prog_id, difficulty, supported_languages,
            time_limit_ms, memory_limit_mb
     FROM programs WHERE prog_id = ?`,
    [progId]
  );

  if (!programs.length) return next(new AppError('Program not found.', 404));

  const program = programs[0];
  const supported = parseLangs(program.supported_languages);

  if (!supported.includes(lang))
    return next(
      new AppError(`Language "${lang}" is not supported for this program.`, 400)
    );

  const publicTestCases = await query(
    `SELECT test_case_id, input_data, expected_output
     FROM public_test_cases
     WHERE prog_id = ?
     ORDER BY display_order ASC`,
    [progId]
  );

  const results = await runAgainstTestCases({
    code,
    lang,
    testCases: publicTestCases,
    timeLimit: program.time_limit_ms,
    memoryLimit: program.memory_limit_mb,
  });

  const passed = results.filter((r) => r.status === 'passed').length;

  res.status(200).json({
    status: 'success',
    data: {
      verdict: passed === results.length ? 'ALL_PASSED' : 'PARTIAL',
      passed,
      total: results.length,
      results,
    },
  });
});

/* =====================================================
   POST /api/programs/:progId/submit
===================================================== */
export const submitProgram = catchAsync(async (req, res, next) => {
  const { progId } = req.params;
  const { lang, code } = req.body;

  if (!lang || !code)
    return next(new AppError('Please provide lang and code.', 400));

  if (req.user.role !== 'student')
    return next(new AppError('Only students can submit programs.', 403));

  const programs = await query(
    `SELECT prog_id, difficulty, supported_languages,
            time_limit_ms, memory_limit_mb
     FROM programs WHERE prog_id = ?`,
    [progId]
  );

  if (!programs.length) return next(new AppError('Program not found.', 404));

  const program = programs[0];
  const supported = parseLangs(program.supported_languages);

  if (!supported.includes(lang))
    return next(
      new AppError(`Language "${lang}" is not supported for this program.`, 400)
    );

  const alreadySolved = await query(
    `SELECT 1 FROM solved_programs WHERE student_user_id = ? AND prog_id = ?`,
    [req.user.user_id, progId]
  );

  const privateTestCases = await query(
    `SELECT test_case_id, input_data, expected_output
     FROM private_test_cases
     WHERE prog_id = ?
     ORDER BY display_order ASC`,
    [progId]
  );

  const results = await runAgainstTestCases({
    code,
    lang,
    testCases: privateTestCases,
    timeLimit: program.time_limit_ms,
    memoryLimit: program.memory_limit_mb,
  });

  const passed = results.filter((r) => r.status === 'passed').length;
  const allPassed = passed === results.length;

  let scoreAwarded = 0;
  let updatedProfile = null;

  if (allPassed && !alreadySolved.length) {
   scoreAwarded = calculateScore(program.difficulty);

    const conn = await getConnection();

    try {
      await conn.beginTransaction();

      await conn.execute(
        `INSERT INTO solved_programs (student_user_id, prog_id)
         VALUES (?, ?)`,
        [req.user.user_id, progId]
      );

      await conn.execute(
        `UPDATE student_profiles
         SET total_score = total_score + ?,
             programs_solved = programs_solved + 1
         WHERE user_id = ?`,
        [scoreAwarded, req.user.user_id]
      );

      await conn.commit();

      // 🔥 Recalculate ranks AFTER successful transaction
      await recalculateGlobalRanks();

      const updated = await query(
        `SELECT total_score, programs_solved, global_rank
         FROM student_profiles WHERE user_id = ?`,
        [req.user.user_id]
      );

      updatedProfile = updated[0];
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      verdict: allPassed ? 'ACCEPTED' : 'WRONG_ANSWER',
      passed,
      total: results.length,
      already_solved: alreadySolved.length > 0,
      score_awarded: scoreAwarded,
      updated_profile: updatedProfile,
      results: results.map((r) => ({
        test_case_id: r.test_case_id,
        status: r.status,
        error_type: r.error_type || null,
        error_message: r.error_message || null,
        time_taken_ms: r.time_taken_ms,
      })),
    },
  });
});

/* =====================================================
   INTERNAL HELPER
===================================================== */
const runAgainstTestCases = async ({
  code,
  lang,
  testCases,
  timeLimit,
  memoryLimit,
}) => {
  const results = [];

  for (const tc of testCases) {
    const result = await executeCode({
      code,
      lang,
      input: tc.input_data,
      timeLimit,
      memoryLimit,
    });

    if (result.error_type) {
      results.push({
        test_case_id: tc.test_case_id,
        status: 'failed',
        error_type: result.error_type,
        error_message: result.error_message,
        time_taken_ms: result.time_taken_ms || 0,
      });
      continue;
    }

    const actual = result.stdout?.trim() ?? '';
    const expected = tc.expected_output?.trim() ?? '';

    const passed = actual === expected;

    results.push({
      test_case_id: tc.test_case_id,
      status: passed ? 'passed' : 'failed',
      error_type: passed ? null : 'WRONG_ANSWER',
      error_message: passed
        ? null
        : `Expected:\n${expected}\n\nGot:\n${actual}`,
      time_taken_ms: result.time_taken_ms,
    });
  }

  return results;
};