const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { Op } = require('sequelize');
require('dotenv').config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'A user with this email already exists.'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return user data (excluding password) and token
    return res.status(200).json({
      status: true,
      message: 'User registered successfully.',
      data: {
        user:user,
        token
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration.',
      error: error.message
    });
  }
};




exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: 'Email and password are required'
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      status: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};


// exports.protected = (req, res) => {
//   res.json({ message: 'This is a protected route', user: req.user });
// };


exports.profile = async (req, res) => {
  try {
    // Fetch fresh user data from DB (excluding password)
    const userInstance  = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password','googleId','updatedAt'] }
    });
console.log(userInstance);
    if (!userInstance) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    const user = userInstance.get({ plain: true });

    // Rename camelCase back to original DB keys
    user.created_at = user.createdAt;
    user.updated_at = user.updatedAt;

    // Remove camelCase fields
    delete user.createdAt;
    delete user.updatedAt;

    return res.status(200).json({
      status: true,
      message: 'Protected route accessed successfully',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};



// exports.googleLogin = async (req, res) => {
//   const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({
//       status: false,
//       message: 'Google token is required'
//     });
//   }

//   try {
//     // Verify Google ID token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub: googleId } = payload;

//     // Find or create user
//     let user = await User.findOne({ where: { email } });

//     if (!user) {
//       // Create new user if not exists
//       user = await User.create({
//         email,
//         name: name || 'Google User',
//         googleId,
//         password: '' // No password for Google users
//       });
//     } else if (!user.googleId) {
//       // Link Google ID to existing user if not already linked
//       user.googleId = googleId;
//       await user.save();
//     }

//     // Generate JWT token
//     const jwtToken = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     return res.status(200).json({
//       status: true,
//       message: 'Google login successful',
//       data: {
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email
//         },
//         token: jwtToken
//       }
//     });
//   } catch (err) {
//     return res.status(500).json({
//       status: false,
//       message: 'Google login failed',
//       error: err.message
//     });
//   }
// };



exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      status: false,
      message: 'Google token is required'
    });
  }

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
   
    const { email, name, sub: googleId } = payload;
  // return res.status(200).json({
  //     status: true,
  //     message: 'Google login failed',
  //     error: googleId
  //   });
    if (!email || !googleId) {
      return res.status(400).json({
        status: false,
        message: 'Invalid Google token payload'
      });
    }

    // Find or create user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user with Google ID
      user = await User.create({
        email,
        name: name || 'Google User',
        googleId : googleId,
        password: '' // No password for Google users
      });
    } else if (user.googleId !== googleId) {
      // Update Google ID if not set or different
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      status: true,
      message: 'Google login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token: jwtToken
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Google login failed',
      error: err.message
    });
  }
};






exports.updateProfile = async (req, res) => {
  try {
    const { name, email, profile_image } = req.body;
    const userId = req.user.id; // ✅ Comes from JWT middleware

    // 1️⃣ Ensure user exists
    const userInstance = await User.findByPk(userId);
    if (!userInstance) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    // 2️⃣ Check email uniqueness (if updating email)
    if (email && email !== userInstance.email) {
      const emailExists = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: userId }, // Exclude current user
        },
      });

      if (emailExists) {
        return res.status(400).json({
          status: false,
          message: 'Email is already in use by another account',
        });
      }
    }

    // 3️⃣ Update fields
    await userInstance.update({
      name: name ?? userInstance.name,
      email: email ?? userInstance.email,
      profile_image: profile_image ?? userInstance.profile_image,
      updatedAt: new Date(),
    });

    // 4️⃣ Prepare safe response
    const updatedUser = userInstance.get({ plain: true });
    delete updatedUser.password;
     delete updatedUser.googleId;
      delete updatedUser.updatedAt;

    return res.status(200).json({
      status: true,
      message: 'Profile updated successfully',
      data: updatedUser ,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
};
