const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("inside verify tokenb");
  console.log("req headers", req.headers.authorization);
  let auth = req.headers.authorization;
  if (!auth) {
    res.status(404).json({
      error: "no token provided",
    });
  } else {
    auth = auth.split(" ").pop();
    console.log(auth);
  }
  // console.log("auth is  ", auth);
  const verifyToken = JWT.verify(
    auth,
    process.env.JWT_ACCESS_TOKEN,
    (err, decode) => {
      if (err) {
        console.log("failed invalid token");
        res.status(405).json({
          error: "invalid token",
        });
      } else {
        // console.log(decode);
        req.user = decode;
        // console.log("req.user is ", req.user);
        return next();
      }
    }
  );
};

exports.verifyToken = verifyToken;
