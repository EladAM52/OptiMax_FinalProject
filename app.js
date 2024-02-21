
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const User = require('./models/User');
const session = require('express-session');
const cors = require('cors');
let server;
const mongoDbUrl = 'mongodb+srv://eladamir46:Ea86451200@optimax-finalproject.phqfbz4.mongodb.net/OptiMax';

app.use(session({
  secret: 'optimax',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoDbUrl,
    collectionName: 'sessions'
  }),
  cookie: {    
    httpOnly: true, 
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 } 
}));

const PORT = process.env.PORT || 5000;
server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully.');
  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000); 
});

mongoose.connect('mongodb+srv://eladamir46:Ea86451200@optimax-finalproject.phqfbz4.mongodb.net/OptiMax', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB with Mongoose'))
.catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public/client/build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/employee',(req, res) => {
  if (req.session.isLoggedIn && req.session.role === "user") {
      res.sendFile(path.join(__dirname, 'public', 'employee.html'));
    } else {
        console.log(res.status(401).send('Please log in as employee to view this page.'));
      }
    });

// app.get('/manager',(req, res) => {
//     if (req.session.isLoggedIn && req.session.role === "admin") {
//         res.sendFile(path.join(__dirname, 'public', 'manager.html'));
//       } else {
//           console.log(res.status(401).send('Please log in as admin to view this page.'));
//         }
//       });
      

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      req.session.isLoggedIn = true;
      req.session.role = user.role;
      req.session.userId =user._id;
      req.session.username=user.username;
        res.json({success: true, message: 'Login successful', username:user.username , role:user.role });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
        console.log(err);
          return res.status(500).json({ success: false, message: 'Could not log out' });
      }
      res.clearCookie('connect.sid', { path: '/' });
      res.json({ success: true, message: 'Logged out successfully' });
  });
});

app.get('/get-username', (req, res) => {
  if (req.session.isLoggedIn) {
      res.json({ username: req.session.username });
  } else {
      res.status(401).json({ message: 'Not logged in' });
  }
});



