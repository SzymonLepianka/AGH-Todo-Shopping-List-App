const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send('invalid credentials');
    } else {
        const token = authHeader.split(' ')[1];


        // var base64Url = token.split('.')[1];
        // var decodedValue = JSON.parse(window.atob(base64Url));
        // console.log(decodedValue)
        // var x = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        // console.log(x)



        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.status(403).send('invalid credentials');
            } else {
                next();
            }
        })
    }
}

module.exports = { isLoggedIn }