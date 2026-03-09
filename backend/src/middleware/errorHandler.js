const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Default error
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = {
            message: `Resource not found`,
            statusCode: 404
        };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const fields = Object.keys(err.keyValue);
        error = {
            message: `${fields.join(', ')} already exists`,
            statusCode: 400
        };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        error = {
            message: messages.join(', '),
            statusCode: 400
        };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = { errorHandler, ApiError };
