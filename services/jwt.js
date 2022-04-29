var jwt = require('jwt-simple');
var moment = require('moment');
var secretPassword = 'clave_super_secreta'; //Clave para decodificar el token.

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secretPassword);
}