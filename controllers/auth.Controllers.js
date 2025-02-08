const model = require('../models');
const { generateUUID } = require('../utils/genarateUUID');
const bcrypt = require('bcrypt');
const responde = require('../utils/responseHandler');
const { sendOtpToEmail } = require('../service/emailProvider');
const { generateToken } = require('../utils/genarateToken');


const signup = async (req, res) => {
    try {
        const id = generateUUID();
        const { name, email, password } = req.body;

        const exitUser = await model.User.findOne({ where: { email } });
        if (exitUser) {
            return responde(res, 400, 'User already exists, please login'); 
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = await model.User.create({ 
            id, 
            name,
            email,
            password: hashPassword, 
            verificationOTP,
            otpExpiredAt: Date.now() + 10 * 60 * 1000
        });

        await sendOtpToEmail(email, verificationOTP, name);
        const token = await generateToken(newUser);

        res.cookie('token', token, { maxage: 360000 });

        return responde(res, 200, 'User created successfully', {  
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isVerified: newUser.isVerified,
        });

    } catch (error) {
        return responde(res, 500, 'Something went wrong'); 
    }
};

const verifyEmail = async (req, res) => {
    try {
      const { verificationOTP } = req.body;
  
      const user = await model.User.findOne({ where: { verificationOTP } });
      if (!user) {
        return responde(res, 400, "Invalid OTP");
      }
  
      if (user.otpExpiresAt < Date.now()) {
        return responde(res, 400, "OTP expire");
      }
  
      user.verificationOTP = null;
      user.otpExpiresAt = null;
      user.isVerified = true;
      await user.save();
  
      return responde(res, 200, "Email verified successfully", {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });
    } catch (error) {
      return responde(res, 500, "somethings went wrong");
    }
  };

  const signin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await model.User.findOne({ where: { email } });
  
      if (!user) return responde(res, 404, "User not found");
  
      if (!user.isVerified) return responde(res, 404, "User not verified");
  
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) return responde(res, 400, "password is invalid");
  
      const token = generateToken(user);
      res.cookie("token", token, { maxAge: 3600000 });
  
      return responde(res, 200, "User logged in successfully", {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });
    } catch (error) {
      return responde(res, 500, "something went wrong");
    }
  };
          
  const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await model.User.findOne({ where: { email } });
        if (!user) {
            return responde(res, 400, 'User not found');
        }
        const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationOTP = verificationOTP;
        user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendOtpToEmail(email, verificationOTP, user.name);
        return responde(res, 200, 'OTP sent to your email');

        
    } catch (error) {
        return responde(res, 500, 'somethings went wrong');
        
    }
  }

  const resetPassword = async (req, res) => {
    try {
      const { verificationOTP, newPassword } = req.body;
  
      const user = await model.User.findOne({ where: { verificationOTP } });
      if (!user) {
        return responde(res, 400, "Invalid OTP");
      }
  
      if (user.otpExpiresAt < Date.now()) {
        return responde(res, 400, "OTP expire");
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.verificationOTP = null;
      user.otpExpiresAt = null;
      await user.save();
      return responde(res, 200, "Password reset succesfully");
    } catch (error) {
      console.error(error);
      return responde(res, 500, "something went wrong");
    }
  };

  const logout = async (req, res) => {
    try {
      res.clearCookie('token');
      return responde(res, 200, 'User logged out successfully');
    } catch (error) {
      return responde(res, 500, 'somethings went wrong');
    }
  }

  const getUserProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        return responde(res, 400, 'User id is required');
      }
      const user = await model.User.findOne({ where: { id: userId },
      attributes: ['id', 'name', 'email', 'isVerified']
      });
      if (!user) {
        return responde(res, 400, 'User not found');
      }
      return responde(res, 200, 'User profile fetched successfully', user);
    } catch (error) {
      return responde(res, 500, 'something went wrong');
    }
  }
module.exports = {signup, verifyEmail, signin, forgetPassword, resetPassword , logout, getUserProfile};