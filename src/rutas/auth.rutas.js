const express = require("express");
const router = express.Router();

const {
  login,
  registro,
  verificarTokenUsuario,
  logout,
} = require("../controladores/controladores");

const { validateSchema } = require("../middleware/validador.middleware");
const { loginSchema, registroSchema } = require("../schemas/auth.schema");

// Ruta para registrar un usuario
router.post("/registro", validateSchema(registroSchema), registro);

// Ruta para iniciar sesión
router.post("/login", validateSchema(loginSchema), login);
// Ruta para iniciar sesión
router.post("/logout", logout);

// Ruta para verificar token del usuario
router.get("/verificar-usuario", verificarTokenUsuario);

module.exports = router;
