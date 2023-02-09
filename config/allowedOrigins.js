const allowedOrigins = [
  process.env.FRONTENDURL,
  process.env.BACKENDURL,
  "http://127.0.0.1:5500",
  "http://localhost:4000",
];

module.exports = allowedOrigins;
