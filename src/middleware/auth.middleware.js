const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config");

/**
 * Middleware que protege rutas mediante validación del token JWT
 */
function auth(req, res, next) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Token inválido" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { auth };
