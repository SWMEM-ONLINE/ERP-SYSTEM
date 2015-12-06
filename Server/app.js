var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var db_handler = require('./routes/DB_handler');

var apply_newbook = require('./routes/apply_newbook');
var book = require('./routes/book');
var crypto = require('crypto');

var fs = require('fs');
var cookieParser = require('cookie-parser')
var session = require('express-session');

/* @routing pages */
var login = require('./routes/login');
var signup = require('./routes/signup');
var imageload = require('./routes/images');
var index_main = require('./routes/main');
/* routing pages@ */

var util = require('./routes/util');
var app = express();
var multer  = require('multer');
var upload = multer({ dest: './uploads/'});
var done=false;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ dest: './uploads/',
  rename: function (fieldname, filename) {

    var name = filename;
    if(10<name.length){
      name = name.substring(0,9);
    }
    return name+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
    done=true;
  }
}));


passport.use(new LocalStrategy({
      usernameField : 'id',
      passwordField : 'password',
      passReqToCallback : true
    }
    ,function(req,id, password, done) {
      var encPW = crypto.createHash('sha256').update(req.body.password).digest('base64');
      var connection = db_handler.connectDB();
      var query = connection.query('select * from t_user where u_id=?', id, function(err,rows){
        if (err) {
          console.error(err);
          throw err;
        }
        //console.log(rows[0]);
        if(0<rows.length){
          //비번 체크
          console.log('pw check');
          if(encPW == rows[0].u_password){
            //성공
            var user = { 'id':rows[0].u_id,
              'password':rows[0].u_password};

            req.logIn(user, function(err) {
              if (err) { return next(err); }
              db_handler.disconnectDB(connection);
              return done(null,user);
            });

          }else{
            db_handler.disconnectDB(connection);
            return done(null,false);
          }

        }else{
          db_handler.disconnectDB(connection);
          return done(null,false);
        }

      });
    }
));

//serializer와 deseriazlier는 필수로 구현해야 함.

// 인증 후, 사용자 정보를 Session에 저장함
passport.serializeUser(function(user, done) {
  console.log('serialize');
  done(null, user);
});

// 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
passport.deserializeUser(function(user, done) {
  //findById(id, function (err, user) {
  console.log('deserialize');
  console.log(user);
  done(null, user);
  //});
});

app.set('trust proxy', 1);
app.use(session({ secret: 'swmem2016',
  resave: false,
  saveUninitialized: true })); // session secret

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use('/', login);
//app.use('/users', users);
app.use('/signup',signup);
app.use('/image',imageload);
app.use('/main', index_main);
app.use('/apply_newbook', apply_newbook);
app.use('/book', book);

app.get('/',
    function(req, res) {
      if (req.isAuthenticated()) {
        res.redirect('/main');
      }
      res.render('index_login', { title: '로그인' });
    });

app.post('/',
    passport.authenticate('local', { failureRedirect: '/', failureFlash: true  }),
    function(req, res) {
      console.log("login post app.js");

      console.log(req.session);
      //console.log(req.session.passport.user);
      res.redirect('/main');
    });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
