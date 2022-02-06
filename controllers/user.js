const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request');
const UnauthorizedError = require('../errors/unauthorized-error');

const getUser = (req, res, next) => User.findOne({ _id: req.user._id })
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(200).send(user);
    }
  })
  .catch((e) => {
    if (e.name === 'CastError') {
      throw new BadRequestError('Невалидный id');
    }

    throw e;
  })
  .catch((err) => next(err));

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь по указанному _id не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
      }

      throw e;
    })
    .catch(next);
};

module.exports = {
  getUser, updateUser,
};
