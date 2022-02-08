const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(() => {
      next(new Error('Произошла ошибка при получении фильмов'));
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для создания фильма'));
      } else {
        next(e);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }

      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав для удалния фильма');
      }

      Movie.findByIdAndRemove({ _id: req.params.id })
        .then((result) => {
          if (!result) {
            throw new NotFoundError('Фильм с указанным _id не найден');
          } else {
            res.status(200).send(movie);
          }
        })
        .catch((err) => next(err));
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Невалидный id '));
      } else {
        next(e);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
