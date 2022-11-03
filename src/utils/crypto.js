const bcrypt = require('bcrypt');

const hashPwd = (plain, done) => {
    bcrypt.hash(plain, 10, done);
}

const compare = (plain, hash, done) => {
    bcrypt.compare(plain, hash, done);
}

module.exports = { hashPwd, compare };