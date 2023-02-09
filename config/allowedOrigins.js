const allowedOrigins = [
  process.env.FRONTENDURL,
  "http://127.0.0.1:5500",
  process.env.BACKENDURL,
  "http://localhost:3000",
];

module.exports = allowedOrigins;
