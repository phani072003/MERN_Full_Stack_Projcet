import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

const hashPasswordIfNeeded = (password) => {
  if (password) {
    return bcryptjs.hashSync(password, 10);
  }
  return password;
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only update your own account!'));
  }

  try {
    req.body.password = hashPasswordIfNeeded(req.body.password);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user && req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only delete your own account!'));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json({ message: 'User has been deleted!' });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user && req.user && req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      console.error(error);
      next(errorHandler(500, 'Internal Server Error'));
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'Internal Server Error'));
  }
};
