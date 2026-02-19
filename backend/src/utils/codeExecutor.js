const JDOODLE_URL = process.env.JDOODLE_API_URL;

// JDoodle language + version index map
const LANG_MAP = {
  c:      { language: 'c',       versionIndex: '5' },
  cpp:    { language: 'cpp17',   versionIndex: '1' },
  java:   { language: 'java',    versionIndex: '4' },
  python: { language: 'python3', versionIndex: '4' },
};

export const executeCode = async ({ code, lang, input, timeLimit, memoryLimit }) => {
  const langConfig = LANG_MAP[lang];

  if (!langConfig) {
    return {
      error_type:    'UNSUPPORTED_LANGUAGE',
      error_message: `Language "${lang}" is not supported.`,
      time_taken_ms: 0,
    };
  }

  const start = Date.now();

  try {
    const res = await fetch(JDOODLE_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId:     process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script:       code,
        stdin:        input ?? '',
        language:     langConfig.language,
        versionIndex: langConfig.versionIndex,
      }),
    });

    const time_taken_ms = Date.now() - start;

    if (!res.ok) {
      const errText = await res.text();
      return {
        error_type:    'EXECUTOR_ERROR',
        error_message: `JDoodle API error: ${errText}`,
        time_taken_ms,
      };
    }

    const data = await res.json();

    // JDoodle response shape:
    // { output, statusCode, memory, cpuTime, isExecutionSuccess }

    // API-level error (wrong credentials etc)
    if (data.error) {
      return {
        error_type:    'EXECUTOR_ERROR',
        error_message: data.error,
        time_taken_ms,
      };
    }

    const output   = data.output || '';
    const cpuTime  = parseFloat(data.cpuTime || '0') * 1000; // convert to ms

    // TLE check — JDoodle has 15s hard limit but we check against our limit
    if (cpuTime >= timeLimit) {
      return {
        error_type:    'TIME_LIMIT_EXCEEDED',
        error_message: `Execution exceeded the time limit of ${timeLimit}ms. (took ${cpuTime}ms)`,
        time_taken_ms: cpuTime,
      };
    }

    // Compilation / runtime error detection
    // JDoodle puts error text in output with statusCode != 200
    if (data.statusCode !== 200) {
      // Detect compilation error keywords
      const isCompileError =
        output.includes('error:') ||
        output.includes('cannot find symbol') ||
        output.includes('SyntaxError') ||
        output.includes('IndentationError') ||
        output.includes('NameError') ||
        output.includes('undefined reference');

      return {
        error_type:    isCompileError ? 'COMPILATION_ERROR' : 'RUNTIME_ERROR',
        error_message: output.trim(),
        time_taken_ms: cpuTime || time_taken_ms,
      };
    }

    // Memory limit — JDoodle returns memory in KB
    const memoryUsedKB = parseInt(data.memory || '0');
    if (memoryUsedKB > memoryLimit * 1024) {
      return {
        error_type:    'MEMORY_LIMIT_EXCEEDED',
        error_message: `Memory limit of ${memoryLimit}MB exceeded. Used: ${Math.round(memoryUsedKB / 1024)}MB`,
        time_taken_ms: cpuTime || time_taken_ms,
      };
    }

    return {
      stdout:       output,
      time_taken_ms: cpuTime || time_taken_ms,
    };

  } catch (err) {
    return {
      error_type:    'NETWORK_ERROR',
      error_message: `Failed to reach code executor: ${err.message}`,
      time_taken_ms: Date.now() - start,
    };
  }
};