const jwt = require('jsonwebtoken');
const createJwtToken = (userId, username) => {
    const token = jwt.sign({ userId: userId, username: username }, process.env.JWT_HASH, {
        expiresIn: "24h",
    });
    const refreshToken = jwt.sign({ userId: userId, username: username }, process.env.JWT_HASH);
    return {
        token: token,
        refreshToken: refreshToken
    }
}

module.exports = createJwtToken;