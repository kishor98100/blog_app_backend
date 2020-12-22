const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token) {
        token = token.slice(7, token.length);
        jwt.verify(token, process.env.JWT_HASH, (err, decoded) => {
            if (err) {
                return res.status(401).json({ "message": err });
            } else {
                console.log(decoded);
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({ "message": "please send Bearer Token Header" });
    }
}

module.exports = { checkToken };