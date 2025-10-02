const express = require("express");

const cors = require("cors");

const cookieSession = require("cookie-session");


require("dotenv").config();

const app = express();

// Initialize DB early
const db = require("./app/models");
const Role = db.role;

// CORS
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    ],
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
    sameSite: "strict",
  })
);

// database
// const db = require("./app/models");
// const Role = db.role;

db.sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Database synchronized");
    try {
      await initial();
    } catch (e) {
      console.warn("Role seeding skipped:", e?.message || e);
    }
  })
  .catch((err) => {
    console.error("DB sync error:", err.message);
  });
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  const db = require("./app/models");
  const Role = db.role;
  const roles = [
    { id: 1, name: "sales" },
    { id: 2, name: "vp" },
    { id: 3, name: "admin" },
    { id: 4, name: "level" },
  ];
  
  for (const r of roles) {
    try {
      await Role.findOrCreate({ where: { id: r.id }, defaults: r });
    } catch (error) {
      console.warn(`Role ${r.name} seeding skipped:`, error.message);
    }
  }
}
