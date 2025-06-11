const app = require("./app");
const { PORT } = require("./config");

async function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
}

main();
