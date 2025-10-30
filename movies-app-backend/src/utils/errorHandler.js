const errorHandler = (err, req, res, next) => {
    console.error(err);
    console.log(req, res, "error handler");
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
};

module.exports = errorHandler;