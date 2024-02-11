
const bootstrap = require('bootstrap');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const User = require('./models/User');
const session = require('express-session');
let server;

app.use(session({
  secret: 'OptiMaxfinalproject', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 3600000 } 
}));


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });

const PORT = process.env.PORT || 3000;
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

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://eladamir46:Ea86451200@optimax-finalproject.phqfbz4.mongodb.net/OptiMax', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB with Mongoose'))
.catch(err => console.error('Could not connect to MongoDB', err));



const createUsers = async () => {
    try {
      // Creating a superuser
      const superUser = new User({
        username: 'efrat',
        email: 'efrat@gmail.com',
        password: '1212', // Consider hashing passwords with bcrypt for security
        role: 'admin',
      });
  
      await superUser.save();
  
      // Creating another example user
      const user = new User({
        username: 'elad',
        email: 'elad@gmail.com',
        password: '1212', // Hash passwords in real applications
        role: 'user',
      });
  
      await user.save();
  
      console.log('Users created');
    } catch (error) {
      console.error('Error creating users:', error);
    }
  };

  // createUsers();

app.use(bodyParser.json());
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.password === password) {
        req.session.userId = user._id;
        req.session.username = user.username; 
        res.json({success: true, message: 'Login successful', username:user.username });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Could not log out' });
      }
      res.clearCookie('connect.sid'); // using express-session, clear the session cookie
      res.json({ success: true, message: 'Logged out successfully' });
  });
});


