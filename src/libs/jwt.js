const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config");

/**
 * Crea un token JWT con duración de 1 día
 * @param {Object} payload - Información del usuario a incluir en el token
 */

function crearTokenAcceso(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

module.exports = { crearTokenAcceso };
