/* eslint-disable no-sync */
const { OK, NO_CONTENT } = require('http-status-codes');
const router = require('express').Router();
const fs = require('fs');
const stringFyAvatar = require('./stringfyAvatar.middleware');

const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const avatars = 'avatars';

    if (!fs.existsSync(avatars)) {
      fs.mkdirSync(avatars);
    }

    cb(null, './avatars/');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // eslint-disable-next-line callback-return
    cb(null, true);
  } else {
    // eslint-disable-next-line callback-return
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

const userService = require('./user.service');
const { id, user } = require('../../utils/validation/schemas');
const {
  validator,
  userIdValidator
} = require('../../utils/validation/validator');

router.post(
  '/',
  upload.single('avatar'),
  stringFyAvatar,
  validator(user, 'body'),
  async (req, res) => {
    const userEntity = await userService.save(req.body);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.get(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  async (req, res) => {
    const userEntity = await userService.get(req.params.id);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.put(
  '/:id',
  upload.single('avatar'),
  stringFyAvatar,
  userIdValidator,
  validator(id, 'params'),
  validator(user, 'body'),
  async (req, res) => {
    const userEntity = await userService.update(req.userId, req.body);
    res.status(OK).send(userEntity.toResponse());
  }
);

router.delete(
  '/:id',
  userIdValidator,
  validator(id, 'params'),
  async (req, res) => {
    await userService.remove(req.params.id);
    res.sendStatus(NO_CONTENT);
  }
);

module.exports = router;
