const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const UnauthorizedError = require('../errors/unauthorized-error');
const BadRequestError = require('../errors/bad-request');
const ConflictError = require('../errors/conflict');

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          res.status(200).send({
            data: {
              name: user.name, email: user.email,
            },
          });
        })
        .catch((e) => {
          if (e.name === 'ValidationError') {
            throw new BadRequestError('Переданы некорректные данные при создании пользователя');
          }

          throw e;
        })
        .catch((err) => {
          if (err.name === 'MongoServerError') {
            throw new ConflictError('Пользователь с такой почтой уже зарегистрирован');
          }

          throw err;
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports = {
  login, createUser,
};
