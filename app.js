const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const roomRouter = require('./routes/room');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
  debug:true
});
const {v4: uuidV4} = require('uuid');
//Peer server setup
app.use('/peerjs',peerServer);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/:room', roomRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection',socket => {
  socket.on('join-meeting',(meetingId,userId)=>{
    socket.join(meetingId)
    socket.to(meetingId).broadcast.emit('user-connected',userId);
    //messages
    socket.on('message', (message) => {
      //send message to same room
      io.to(meetingId).emit('createMessage',message)
    });
    socket.on('disconnect',() => {
      socket.to(meetingId).broadcast.emit('user-disconnected',userId)
    })
  })
})

app.listen(3000);
module.exports = app;
