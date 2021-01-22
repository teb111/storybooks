const mongoose = require('mongoose');

//NOTE: When working with mongoose connect it retuns back a promise that is why we are using async and await below

const connectDB = async () => {
    try {
        //setting the options to stop some warning in the console
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        if(err){
          console.log(err);
          // Then stop the entire process then pass in 1 to return a failure
          process.exit(1);
        }
    }
}

module.exports = connectDB;