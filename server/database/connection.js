const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        // Connect to MongoDB
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: true,
            // useCreateIndex: true
        })

        console.log(`MongoDB connected: ${connection.connection.host}`)
    }
    catch(err){
        console.log(err);
        // process.exit(1);
    }
}

// DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. 
// Use `mongoose.set('strictQuery', false);` if you want to prepare for this change.
mongoose.set('strictQuery', false);


module.exports = connectDB

// exports.getDB = getDB;

