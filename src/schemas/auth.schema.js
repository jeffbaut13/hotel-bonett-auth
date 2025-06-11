const { z } = require("zod");

// Esquema para validación del registro
const registroSchema = z.object({
  username: z.string({
    required_error: "El nombre de usuario es obligatorio",
  }),
  email: z
    .string({
      required_error: "El correo electrónico es obligatorio",
    })
    .email({
      message: "Formato de correo no válido",
    }),
  password: z
    .string({
      required_error: "La contraseña es obligatoria",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
});

// Esquema para validación del login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  registroSchema,
  loginSchema,
};
