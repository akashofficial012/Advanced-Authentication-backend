const model = require('../models');
const { generateUUID } = require('../utils/genarateUUID');
const bcrypt = require('bcrypt');
const responde = require('../utils/responseHandler');

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


module.exports = {signup};