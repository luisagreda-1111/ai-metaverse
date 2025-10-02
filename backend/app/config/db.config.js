module.exports = {
  HOST: "localhost",
  PORT: "3306",
  USER: "root",
  PASSWORD: "",
  DB: "metaverse",
  // Allow switching database engine via env. Default to MySQL; use SQLite for easy local deploy
  dialect: process.env.DB_DIALECT || "mysql",
  // Used only when dialect === 'sqlite'
  storage: process.env.DB_STORAGE || "metaverse.sqlite",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
