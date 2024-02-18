
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const User = require('./models/User');
const session = require('express-session');
let server;
const mongoDbUrl = 'mongodb+srv://eladamir46:Ea86451200@optimax-finalproject.phqfbz4.mongodb.net/OptiMax';

app.use(session({
  secret: 'optimax',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongoDbUrl,
    collectionName: 'sessions'
  }),
  cookie: {    
    httpOnly: true, // Recommended setting for security
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 } 
}));

const requireAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
      next(); // User is authenticated, continue to next middleware
  } else {
      res.redirect('/login'); // User is not authenticated, redirect to login page
  }
}

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/employee',requireAuth, (req, res) => {
  if (req.session.isLoggedIn && req.session.role === "user") {
      res.sendFile(path.join(__dirname, 'public', 'employee.html'));
    } else {
        console.log(res.status(401).send('Please log in as employee to view this page.'));
      }
    });

app.get('/manager',requireAuth, (req, res) => {
    if (req.session.isLoggedIn && req.session.role === "admin") {
        res.sendFile(path.join(__dirname, 'public', 'manager.html'));
      } else {
          console.log(res.status(401).send('Please log in as admin to view this page.'));
        }
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
      app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
      app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
      app.use(bodyParser.json());
      app.use(express.urlencoded({ extended: true }));
      
      

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
      console.log('Logged out successfully');
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



