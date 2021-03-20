module.exports = (req, res, next) => {
  req.body.avatar = req.file.path.replace('\\', '/');
  next();
};
