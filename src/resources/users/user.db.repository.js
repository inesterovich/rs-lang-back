/* eslint-disable no-sync */
const User = require('./user.model');
const { NOT_FOUND_ERROR, ENTITY_EXISTS } = require('../../errors/appErrors');
const ENTITY_NAME = 'user';
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const fs = require('fs');
const path = require('path');

const getUserByEmail = async email => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { email });
  }

  return user;
};

const get = async id => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }

  return user;
};

const save = async user => {
  try {
    return await User.create(user);
  } catch (err) {
    const deletepath = path.join(__dirname, '../../../', user.avatar);
    fs.unlinkSync(deletepath);
    if (err.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this e-mail exists`);
    } else {
      throw err;
    }
  }
};

const update = async (id, user) => {
  const oldUser = await User.findOne({ _id: id });
  const deletepath = path.join(__dirname, '../../../', oldUser.avatar);
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: user },
    { new: true }
  );
  fs.unlinkSync(deletepath);

  return updatedUser;
};

const remove = async id => {
  const user = await User.findOne({ _id: id });
  const deletepath = path.join(__dirname, '../../../', user.avatar);
  console.log(deletepath);
  await User.deleteOne({ _id: id });
  fs.unlinkSync(deletepath);
};

module.exports = { get, getUserByEmail, save, update, remove };
