const { BAD_REQUEST_ERROR } = require('../../errors/appErrors');

module.exports = (req, res, next) => {
  try {
    req.body.avatar = req.file.path.replace('\\', '/');
    return next();
  } catch (error) {
    throw new BAD_REQUEST_ERROR('Wrong filetype');
  }
};
