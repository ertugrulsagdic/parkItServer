module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Ertugrul.135",
    DB: "parkIt",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
};