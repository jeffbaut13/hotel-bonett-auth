const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config");
const { pool } = require("../db");
const { crearTokenAcceso } = require("../libs/jwt");

/* ------------------------------------------
   Registrar nuevo usuario
------------------------------------------ */
async function registro(req, res) {
  const { username, email, password } = req.body;
  try {
    // Verificar si el correo ya existe
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar nuevo usuario
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    // Crear token
    const token = await crearTokenAcceso({ id: result.insertId });

    // Configuración de la cookie (según entorno)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ id: result.insertId, username, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro" });
  }
}

/* ------------------------------------------
   Login de usuario
------------------------------------------ */
async function login(req, res) {
  const { email, password } = req.body;
  try {
    // Buscar usuario por email
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(400).json({ message: "El correo no existe" });
    }

    const user = users[0];

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Crear token
    const token = await crearTokenAcceso({ id: user.id });

    // Configuración de la cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
}

/* ------------------------------------------
   Verificar token y obtener usuario
------------------------------------------ */
async function verificarTokenUsuario(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({
      loggedIn: false,
      message: "Debes iniciar sesión o registrarte para continuar.",
    });
  }

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) {
      return res.status(200).json({
        loggedIn: false,
        message: "Token inválido o expirado. Por favor, inicia sesión.",
      });
    }

    try {
      const [users] = await pool.query(
        "SELECT id, username, email FROM users WHERE id = ?",
        [user.id]
      );
      if (users.length === 0) {
        return res.status(200).json({
          loggedIn: false,
          message: "Usuario no encontrado. Por favor, inicia sesión.",
        });
      }

      res.json({
        loggedIn: true,
        ...users[0],
      });
    } catch (dbError) {
      console.error(dbError);
      res.status(500).json({ message: "Error interno al verificar usuario." });
    }
  });
}

/* ------------------------------------------
   Logout (cerrar sesión)
------------------------------------------ */
async function logout(req, res) {
  // Elimina la cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0), // Expira inmediatamente
  });
  res.sendStatus(200);
}

module.exports = { registro, login, verificarTokenUsuario, logout };
