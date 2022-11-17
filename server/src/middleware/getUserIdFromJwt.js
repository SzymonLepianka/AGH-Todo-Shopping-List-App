const jwt = require('jsonwebtoken');

const getUserIdFromJwt = (req) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const userId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).userId;
    return userId;
}

module.exports = { getUserIdFromJwt }