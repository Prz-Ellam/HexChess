const mongoose = require('mongoose');

module.exports = async () => {
    await mongoose.connect(process.env.DATABASE_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
        .then(db => console.log('Database connected')
        .catch(err => console.error(err))
    );
}
