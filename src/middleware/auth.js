const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");
const Blacklist = require("../models/blacklist");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).json({ error: "No token provided" });
    const parts = authHeader.split(' ');

    if(!parts.lenght === 2)
        return res.status(402).json({ error: "Token error" });

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)) //Rejex test
        return res.status(401).send({ error: "Token malformatted" })

    jwt.verify(token, authConfig.secret, async (e, decoded) => {
        if(e)
            return res.status(401).send({ error: "Invalid token" })

        const blacklist = await Blacklist.findOne({ token: token })
        if(blacklist) return res.status(401).send({ message: "token in blacklist"})
        req.userId = decoded.id;
        return next();
    })
}