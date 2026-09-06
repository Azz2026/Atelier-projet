require("dotenv").config();
const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const methodOverride = require("method-override");
const path = require("path");

const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "data", "uploads")));

app.use(
  session({
    store: new SQLiteStore({ db: "sessions.sqlite", dir: "./data" }),
    secret: process.env.SESSION_SECRET || "change-me-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8h
  })
);

app.use("/admin", adminRoutes);
app.use("/", publicRoutes);

app.use((req, res) => {
  res.status(404).render("404", { settings: {}, page: "" });
});

app.listen(PORT, () => {
  console.log(`Atelier Abdelaziz Nour — serveur lancé sur le port ${PORT}`);
});
