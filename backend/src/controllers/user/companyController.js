import { query } from '../../utils/db.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

// GET /api/companies?page=1&limit=6&sort=alpha&search=tcs
export const getAllCompanies = catchAsync(async (req, res, next) => {
  const page   = Math.max(1, parseInt(req.query.page) || 1);
  const limit  = 6;
  const offset = (page - 1) * limit;
  const sort   = req.query.sort || 'alpha';
  const search = req.query.search?.trim() || '';

  const allowedSorts = ['alpha', 'most_recruitments', 'last_visited'];
  if (!allowedSorts.includes(sort))
    return next(new AppError('Invalid sort option.', 400));

  const orderMap = {
    alpha:             'c.company_name ASC',
    most_recruitments: 'total_drives DESC, c.company_name ASC',
    last_visited:      'last_visited_year DESC, c.company_name ASC',
  };

  const searchCondition = search ? `AND c.company_name LIKE ?` : '';
  const searchParam     = search ? [`%${search}%`] : [];

  // Use plain query (not prepared statement) so ORDER BY + LIMIT interpolation works
  const dataSQL = `
    SELECT
      c.company_id,
      c.company_name,
      c.location,
      c.logo_url,
      c.is_active,
      COUNT(rd.drive_id)  AS total_drives,
      MAX(rd.batch_year)  AS last_visited_year
    FROM companies c
    LEFT JOIN recruitment_drives rd ON rd.company_id = c.company_id
    WHERE 1=1 ${searchCondition}
    GROUP BY c.company_id, c.company_name, c.location, c.logo_url, c.is_active
    ORDER BY ${orderMap[sort]}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countSQL = `
    SELECT COUNT(DISTINCT c.company_id) AS total
    FROM companies c
    WHERE 1=1 ${searchCondition}
  `;

  const [companies, countRows] = await Promise.all([
    query(dataSQL, [...searchParam]),
    query(countSQL, [...searchParam]),
  ]);

  const total      = countRows[0].total;
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: 'success',
    data: {
      companies,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  });
});
// GET /api/companies/:id
export const getCompany = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const companies = await query(
    `SELECT
       c.company_id,
       c.company_name,
       c.location,
       c.logo_url,
       c.is_active,
       COUNT(rd.drive_id)   AS total_drives,
       MAX(rd.batch_year)   AS last_visited_year,
       MIN(rd.batch_year)   AS first_visited_year
     FROM companies c
     LEFT JOIN recruitment_drives rd ON rd.company_id = c.company_id
     WHERE c.company_id = ?
     GROUP BY c.company_id, c.company_name, c.location, c.logo_url, c.is_active`,
    [id]
  );

  if (!companies.length) return next(new AppError('Company not found.', 404));

  // All recruitment years for this company (for year selector dropdown)
  const years = await query(
    `SELECT drive_id, batch_year, ctc_package, description
     FROM recruitment_drives
     WHERE company_id = ?
     ORDER BY batch_year DESC`,
    [id]
  );

  res.status(200).json({
    status: 'success',
    data: {
      company: companies[0],
      recruitment_years: years,
    },
  });
});

// GET /api/companies/:id/drives/:driveId/feedbacks?page=1&search=
export const getDriveFeedbacks = catchAsync(async (req, res, next) => {
  const { id, driveId } = req.params;
  const page   = Math.max(1, parseInt(req.query.page) || 1);
  const limit  = 10;
  const offset = (page - 1) * limit;
  const search = req.query.search?.trim() || '';

  const drives = await query(
    `SELECT drive_id FROM recruitment_drives WHERE drive_id = ? AND company_id = ?`,
    [driveId, id]
  );
  if (!drives.length) return next(new AppError('Drive not found for this company.', 404));

  const searchCondition = search
    ? `AND (u.full_name LIKE ? OR sp.reg_no LIKE ? OR u.email LIKE ?)`
    : '';
  const searchParam = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];

  const dataSQL = `
    SELECT
      pf.feedback_id,
      pf.is_selected,
      pf.feedback_pdf_url,
      pf.submitted_at,
      u.full_name,
      u.email,
      sp.reg_no
    FROM placement_feedbacks pf
    JOIN student_profiles sp ON pf.student_user_id = sp.user_id
    JOIN users u ON sp.user_id = u.user_id
    WHERE pf.drive_id = ? ${searchCondition}
    ORDER BY pf.is_selected DESC, u.full_name ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countSQL = `
    SELECT COUNT(*) AS total
    FROM placement_feedbacks pf
    JOIN student_profiles sp ON pf.student_user_id = sp.user_id
    JOIN users u ON sp.user_id = u.user_id
    WHERE pf.drive_id = ? ${searchCondition}
  `;

  const [feedbacks, countRows] = await Promise.all([
    query(dataSQL, [driveId, ...searchParam]),
    query(countSQL, [driveId, ...searchParam]),
  ]);

  const total = countRows[0].total;

  res.status(200).json({
    status: 'success',
    data: {
      feedbacks,
      pagination: {
        total, page, limit,
        totalPages:  Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    },
  });
});

// GET /api/companies/:id/drives/:driveId/programs?page=1&search=
export const getDrivePrograms = catchAsync(async (req, res, next) => {
  const { id, driveId } = req.params;
  const page   = Math.max(1, parseInt(req.query.page) || 1);
  const limit  = 10;
  const offset = (page - 1) * limit;
  const search = req.query.search?.trim() || '';

  const drives = await query(
    `SELECT drive_id FROM recruitment_drives WHERE drive_id = ? AND company_id = ?`,
    [driveId, id]
  );
  if (!drives.length) return next(new AppError('Drive not found for this company.', 404));

  const searchCondition = search ? `AND p.title LIKE ?` : '';
  const searchParam     = search ? [`%${search}%`] : [];

  const studentId   = req.user?.role === 'student' ? parseInt(req.user.user_id) : null;
  const solvedJoin   = studentId
    ? `LEFT JOIN solved_programs spv ON spv.prog_id = p.prog_id AND spv.student_user_id = ${studentId}`
    : '';
  const solvedSelect = studentId
    ? `, IF(spv.prog_id IS NOT NULL, 1, 0) AS is_solved`
    : `, 0 AS is_solved`;

  const dataSQL = `
    SELECT
      p.prog_id,
      p.title,
      p.difficulty,
      p.supported_languages,
      rp.assigned_at
      ${solvedSelect}
    FROM recruitment_programs rp
    JOIN programs p ON rp.prog_id = p.prog_id
    ${solvedJoin}
    WHERE rp.drive_id = ? ${searchCondition}
    ORDER BY FIELD(p.difficulty, 'easy', 'medium', 'hard'), p.prog_id ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countSQL = `
    SELECT COUNT(*) AS total
    FROM recruitment_programs rp
    JOIN programs p ON rp.prog_id = p.prog_id
    WHERE rp.drive_id = ? ${searchCondition}
  `;

  const [programs, countRows] = await Promise.all([
    query(dataSQL, [driveId, ...searchParam]),
    query(countSQL, [driveId, ...searchParam]),
  ]);

  const total = countRows[0].total;

  res.status(200).json({
    status: 'success',
    data: {
      programs,
      pagination: {
        total, page, limit,
        totalPages:  Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    },
  });
});