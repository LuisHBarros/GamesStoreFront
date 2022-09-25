const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const authConfig = require("../config/auth")
const crypto = require('crypto');
const mailer = require('../modules/mailer')
const Blacklist = require('../models/blacklist')

    function generateToken(params = {}) {
        return jwt.sign(params, authConfig.secret,
            {expiresIn: 86400,})
    }
module.exports = class userController {


    static registerUser = async (req, res) => {
        try {
            let { name, email, password, adm  } = req.body
            if ( await User.findOne({email : req.body.email}))
                return res.status(403).json({ message: "email already registered" })


            const salt = await bcrypt.genSalt(12)
            const hashPassword = await bcrypt.hash(password, salt)
            if(adm === undefined) adm = false
            const user = new User(
                {
                    name, email, password: hashPassword, adm
                }
            );
            user.save()

            return res.status(200).json({ user: user.name, token: generateToken({id: user.id}) })
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }

    }
    static authenticateUser = async (req, res) => {
        const { email, password} = req.body;
        const user = await User.findOne( { email } ).select(`+password`);
        if(!user)
            return res.status(400).json({ error: "User not found" });
        if(!await bcrypt.compare(password, user.password))
            return res.status(400).json({ error: "Invalid password"});


        return res.status(201).json({ user:user.name, token: generateToken({id: user.id}) })
    }

    static forgotPassword = async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email: email });
            if(!user) return res.status(400).json({ error: "Email not found"});

            const token = crypto.randomBytes(3).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 0.5);

            await User.findByIdAndUpdate(user.id,{
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            })
            mailer.sendMail({
                to: email,
                from: 'recovery@CloutheStore.com',
                template: 'forgot_password',
                context: { token: token },

            }, (e) => {
                return res.status(400).json({ error: e.message });
            }
            )
            return res.status(200).json({ message:"Enviado com sucesso!" })

        } catch (e) {
            return res.status(400).json({  error: "Error on forgot password, try again" });
        }
    }

    static recoverPassword = async (req, res) => {
        const { email, PasswordResetToken, password } = req.body;
        try {

            const user = await User.findOne({ email: email })
                .select('+passwordResetToken passwordResetExpires'); 

            if(!user)
                return res.status(404).json({ error: "User not found" });

            if(PasswordResetToken !== user.passwordResetToken)
                return res.status(401).json({ error: "Token invalid" })

            const now = new Date();

            if(user.passwordResetExpires < now)
                return res.status(401).json({ error: "Token expired!"})

            const salt = await bcrypt.genSalt(12)
            const hashPassword = await bcrypt.hash(password, salt)
            user.password = hashPassword;


            user.passwordResetExpires = undefined;
            user.passwordResetToken = undefined;
            user.token = undefined;
            await user.save();

            res.status(200).json({ message: "Password reset successfully"})

            await user.save();

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
    static logoutUser= async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            const parts = authHeader.split(' ');
            const [ scheme, token ] = parts;
            const tokenOnBlacklist = new Blacklist({ token })
            tokenOnBlacklist.save();
            return res.status(201).json({message: "Token removed successfully" })

        } catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }
    static testToken = async (req, res) => {

            User.findById(req.userId , async (err, user) =>{
                if (err) return res.status(404).send({ error: err.message });
            return res.status(200).json({ user: user.name });
            })


    }
}