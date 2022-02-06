const router = require('express').Router();
const { login, createUser } = require('../controllers/auth');
const auth = require('../middlewares/auth');
const { signupValidation, signinValidation } = require('../utils/validation');
const NotFoundError = require('../errors/not-found-err');

router.post('/api/signup', signupValidation, createUser);
router.post('/api/signin', signinValidation, login);

router.use(auth);

router.use('/api/users', require('./user'));
router.use('/api/movies', require('./movies'));

router.use(() => {
  throw new NotFoundError('Ошибка при запросе');
});

module.exports = router;
