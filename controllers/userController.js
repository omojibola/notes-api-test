const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({
      status: 'error',
      message: 'All fields are necessary',
    });
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400).json({
      status: 'error',
      message: 'User already exists',
    });
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully,',
      data: { id: user.id, email: user.email, username: user.username },
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'User data is not valid',
    });
  }
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: 'error',
      message: 'All fields are necessary',
    });
  }
  try {
    const user = await User.findOne({ email });

    //compare password with hashedpassword
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.status(200).json({
        message: 'User logged in successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          accessToken,
        },
      });
    } else {
      res.status(401).json({
        status: 'error',
        message: 'email or password is not valid',
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
