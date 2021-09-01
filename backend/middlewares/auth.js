const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'secret' } = process.env;
const AuthorizationErr = require('../errors/authorization-err');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthorizationErr('Неверный email или пароль');
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthorizationErr('Неверный email или пароль'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
