const mongoose = require('mongoose');

module.exports = async () => {
    await mongoose.connect(process.env.DATABASE_URI)
        .then(() => console.log('Database connected')
    );
}
