const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const flash = require('connect-flash');
const { ensureLoggedIn } = require('connect-ensure-login');
const createHttpError = require('http-errors');
const connectDB = require('./server/database/connection')
const { roles } = require('./server/utils/constants');

// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('./swagger.json');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {cors: {origin: "*"}})

// dotenv.config({path:'config.env'})
dotenv.config({path:'config.env'})

const PORT = process.env.PORT || 8080

//log requests
app.use(morgan('tiny'));

//connect to MongoDB
connectDB();


app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // secure: true,
        httpOnly: true,
      },
      store: connectMongo.create({ mongoUrl: process.env.MONGO_URI }),
    })
  );

//For Passport JS Authentication
app.use(passport.initialize());
app.use(passport.session());
require('./server/utils/passport-local');

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Connect Flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


//Parse requests to body-parser
app.use(bodyparser.urlencoded({extended:true}))

//set view engine
app.set("view engine", "ejs")

// Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

//Load all the assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))



//Load all the routers
app.use('/', require('./server/routes/index'))
app.use('/auth', require('./server/routes/auth'));


app.use(
  '/user',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  require('./server/routes/user')
);
app.use(
  '/admin',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureAdmin,
  require('./server/routes/admin')
);

// 404 Handler
app.use((req, res, next) => {
    next(createHttpError.NotFound());
  });

// Error Handler
app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    res.render('error-40x', { error });
  });
  


if (process.env.NODE_ENV !== 'test') {
  http.listen(PORT, ()=>{console.log(`Server is running on http://localhost:${PORT}`)});
}
module.exports = http;


io.on('connection', (socket) => {
  // console.log('a user connected: ' + socket.id);
  socket.on('message', (data) => {
    // console.log(data);
    // Broadcast the event to all connected clients except the sender
    socket.broadcast.emit('message', data);
  });

  socket.on('order', (data) => {
    // console.log(data);
    // Broadcast the event to all connected clients except the sender
    socket.broadcast.emit('order', data);
  });
});


//Ensure user is Admin
function ensureAdmin(req, res, next) {
    if (req.user.role === roles.admin) {
      next();
    } else {
      req.flash('You are not authorized to see this route!');
      res.redirect('/');
    }
  }
  
  // function ensureManager(req, res, next) {
  //   if (req.user.role === roles.manager) {
  //     next();
  //   } else {
  //     req.flash('warning', 'you are not Authorized to see this route');
  //     res.redirect('/');
  //   }
  // }