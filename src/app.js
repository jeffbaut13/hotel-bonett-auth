const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./rutas/auth.rutas");

const app = express();

// Middleware para permitir peticiones del frontend
app.use(
  cors({
    origin: "http://localhost:5173", // URL de tu frontend
    credentials: true,
  })
);


app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);

module.exports = app;
