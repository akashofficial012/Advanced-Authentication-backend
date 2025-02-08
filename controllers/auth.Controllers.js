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
            


module.exports = {signup, verifyEmail};