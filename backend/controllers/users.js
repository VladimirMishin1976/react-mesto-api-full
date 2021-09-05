require('dotenv').config();

const { JWT_SECRET = 'secret' } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthorizationErr = require('../errors/authorization-err');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const RegistrationError = require('../errors/registration-err');
const ServerError = require('../errors/server-err');

module.exports = {
  login(req, res, next) {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: '7d' },
        );
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 70,
          httpOnly: true,
          sameSite: true,
        }).status(200).send({ user: user.toJSON() });
      })
      .catch((err) => {
        if (err.statusCode === 401) {
          next(new AuthorizationErr('Неправильный Email или пароль'));
        }
        next(new ServerError('На сервере произошла ошибка'));
      });
  },

  getUsers(req, res, next) {
    User.find({})
      .then((users) => res.send({ data: users }))
      .catch(next);
  },

  getCurrentUser(req, res, next) {
    User.findOne({ _id: req.user._id })
      .then((user) => {
        if (!user) {
          throw new NotFoundError(`Пользователь с id=${req.params._id} не найден`);
        }
        console.log(user);
        return res.send(user);
      })
      .catch(next);
  },

  getUserById(req, res, next) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь не найден');
        }
        return res.send(user);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new ValidationError('Переданы некоректные данные'));
        } else {
          next(err);
        }
      });
  },

  createUser(req, res, next) {
    const {
      name, about, avatar, email, password,
    } = req.body;

    if (!email || !password) {
      throw new ValidationError('Email или пароль не могут быть пустыми');
    }

    User.findOne({ email })
      .then((userData) => {
        if (userData) {
          throw new RegistrationError('Пользователь уже существует');
        } else {
          bcrypt.hash(password, 10)
            .then((hash) => User.create({
              name,
              about,
              avatar,
              email,
              password: hash,
            }))
            .then((user) => res.status(201).send({ data: user.toJSON() }))
            .catch((error) => {
              if (error.name === 'ValidationError') {
                throw new ValidationError(error.message);
              }
              if (error.name === 'MongoError' && error.code === 11000) {
                throw new AuthorizationErr(error.message);
              } else {
                throw new ServerError('На сервере произошла ошибка');
              }
            })
            .catch(next);
        }
      }).catch(next);
  },

  updateUser(req, res, next) {
    const { name, about } = req.body;
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      },
    )
      .then((user) => res.send(user))
      .catch((error) => {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
          throw new ValidationError(error.message);
        } else {
          throw new ServerError('На сервере произошла ошибка');
        }
      })
      .catch(next);
  },

  updateAvatarUser(req, res, next) {
    const { avatar } = req.body;
    User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      },
    )
      .then((user) => res.send(user))
      .catch((error) => {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
          throw new ValidationError(error.message);
        } else {
          throw new ServerError('На сервере произошла ошибка');
        }
      })
      .catch(next);
  },
};
