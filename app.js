const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// load config
dotenv.config({path: './config/config.env'});

// passport config
// we are taking in passport as an argument so we will be able to use it in the passport.js file
require('./config/passport')(passport);

// run database connection
connectDB();

const app = express();

//logging
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

// Handlebars
// we also set the extension name to '.hbs' instead of the dafault
// set the view engine here as well
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Express session
app.use(session({
    secret: 'keyboard cat',
    resave: false, // we dont want to save a session if nothing is modified
    saveUninitialized: false, // do not create a session until sonething is stored
    store: new MongoStore({mongooseConnection: mongoose.connection}) // store the session in the database
  }))

  //passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

// rendering static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
// Basically we are sayying anything thats is just slash will check the index.js in the routes folder
app.use('/', require('./routes/index'))
// Basically we are sayying anything thats is "/auth" will check the auth.js in the routes folder
app.use('/auth', require('./routes/auth'))

// we are taking our port we set in the config if it's not there we are running on port 5000
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`));