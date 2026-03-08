/**
 * Global error handler — never leaks stack traces in production
 */
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[ERROR] ${req.method} ${req.path} → ${status}: ${err.message}`);

  res.status(status).json({
    error: isProd && status === 500 ? 'Internal Server Error' : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}

module.exports = errorHandler;
