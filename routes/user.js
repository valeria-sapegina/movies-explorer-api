const router = require('express').Router();
const { updateUserValidation } = require('../utils/validation');
const {
  getUser, updateUser,
} = require('../controllers/user');

router.get('/me', getUser);
router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
