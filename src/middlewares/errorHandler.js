/**
 * Centralised error handler – must be registered last in Express pipeline.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.status ?? 500;
    res.status(status).json({
        error: status === 500 ? 'Internal server error' : err.message,
    });
};

module.exports = errorHandler;