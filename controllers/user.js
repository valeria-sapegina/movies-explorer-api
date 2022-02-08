const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict');

const getUser = (req, res, next) => User.findOne({ _id: req.user._id })
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(200).send(user);
    }
  })
  .catch((e) => { next(e); });

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
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else if (e.code === 11000) {
        next(new ConflictError('Указанная почта принадлежит другому пользователю'));
      } else {
        next(e);
      }
    });
};

module.exports = {
  getUser, updateUser,
};
