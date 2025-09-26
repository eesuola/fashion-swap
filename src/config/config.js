module.exports = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    logLevel: process.env.LOG_LEVEL || "info",
    debug: process.env.DEBUG === "true",
    logMetadata: process.env.LOG_METADATA === "true",
    db: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USERNAME || "user",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "database"
    }
};
