const bcrypt = require('bcrypt');

const hashPwd = (plain, done) => {
    bcrypt.hash(plain, 10, done);
}

const compare = async (plain, hash, done) => {
    await bcrypt.compare(plain, hash, done);
}

module.exports = { hashPwd, compare };