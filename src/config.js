require("dotenv").config();

const PORT = process.env.PORT || 4000;
const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret";

module.exports = {
  PORT,
  TOKEN_SECRET,
};
