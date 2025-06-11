/**
 * Middleware para validar la estructura del cuerpo de la petición
 * utilizando esquemas de Zod
 */
function validateSchema(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        message: error.errors.map((err) => err.message),
      });
    }
  };
}

module.exports = { validateSchema };
