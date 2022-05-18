const jwt = require("jsonwebtoken");
const secretKey = "secret123";

const authentication = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const customAuth = token.length < 500;
    let decodedToken;
    if (token && customAuth) {
      decodedToken = jwt.verify(token, secretKey);
      req.userId = decodedToken?.id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authentication;
