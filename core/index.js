const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const http = require('http');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const debug = require('debug')('backend:server');

const index = require('./src/routers/index');
const portUtils = require('./src/config/port');
const connectDB = require('./src/config/db.mongo');
var sleep = require('system-sleep');

const kafkaAdminConnect = require('./src/kafka/kafkaAdmin');

// Connect mongoDB database
connectDB();
sleep(5*1000); // sleep for 5 seconds

// Create express app
const app = express();


kafkaAdminConnect()

// compressing api response
app.use(compression());
// 10 mb body limit
app.use(express.json({ limit: '10mb' }));

// logger
app.use(morgan('dev'));

// Get port from environment and store in Express.
const PORT = portUtils.normalizePort(process.env.PORT || '5000');
app.set('port', PORT);

// cors enable
app.use(cors());

// data sanitization against xss
app.use(xss());

// security config
app.use(helmet());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: connection with client setup
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
//
//   app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

// all the api routers
app.use('/api', index);

// index setup
const server = http.createServer(app);

// Event listener for HTTP server 'listening' event.
const onListening = () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
  debug(`Server running on ${bind}, http://localhost:${address.port}`);
  console.log(`Server running on ${bind}, http://localhost:${address.port}`);
};

// Listen on provided port, on all network interfaces.
server.listen(PORT);
server.on('error', portUtils.onError);
server.on('listening', onListening);


// ------------------------------ Socker IO ------------------------ //
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    // TODO: make thid origin dockerized
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.mongoId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData.mongoId);
  });
});
