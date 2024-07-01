require('dotenv').config();
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const User = require("./models/User");
const Task = require("./models/Task");
const Document = require("./models/documentModel");
const session = require("express-session");
const sgMail = require('@sendgrid/mail')
const path = require('path');
let server;
const mongoURI=process.env.MONGO_DB_URL;

const PORT = process.env.PORT || 3000;
server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down gracefully.");
  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
});

app.use(
  session({
    secret: "optimax",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

mongoose
  .connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB with Mongoose"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const requireAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/homepage", requireAuth, (req, res) => {
  res.json({ success: true, message: "Authorized for homepage." });
});

const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
  return emailPattern.test(email);
};

const validateId = (id) => {
  const IdPattern = /^\d{9}$/;
  return IdPattern.test(id);
};

app.post("/login", async (req, res) => {
  const { email, idNumber } = req.body;
  const SenderEmail='optimax58@gmail.com';
  const lowercaseUsername = email.toLowerCase();
  const user = await User.findOne({ email:lowercaseUsername});
  if(validateEmail(email) && validateId(idNumber)){
    if (user && user.idNumber === idNumber) {
      req.session.isLoggedIn = true;
      req.session.role = user.role;
      req.session.userId = user._id;
      req.session.idNumber = user.idNumber;
      req.session.FirstName = user.FirstName;
      console.log(req.session);
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const verificationCodeTimestamp = new Date();
      await User.updateOne({ _id: user._id }, { $set: { verificationCode, verificationCodeTimestamp } });
      
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email, 
        from: SenderEmail, 
        subject: 'קוד אימות',
        text:`קוד האימות שלך לכניסה למערכת הוא: ${verificationCode}`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })

      res.json({
        success: true,
        message: "Login successful",
        FirstName: user.FirstName,
        role: user.role,
        userId: user._id
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  }});


app.post("/logout", async (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.log('err');
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Could not log out" });
    }
    res.clearCookie("connect.sid", { path: "/" });
    console.log("Logged out successfully");
    res.json({ success: true, message: "Logged out successfully" });
  });
});

app.get("/getusers", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get("/getuserprofile", async (req, res) => {
  try {
    const userId = req.header('UserId');
    const user = await User.findOne({_id:userId});
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

app.put('/updateuserprofile', async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, profileData, { new: true });
    
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.post('/adduser', async (req, res) => {
  const { FirstName, LastName, gender, email, idNumber, role, phoneNumber, dateOfBirth, familyStatus, address } = req.body;

  try {
    const newUser = new User({
      FirstName,
      LastName,
      gender,
      email,
      idNumber, 
      role,
      phoneNumber,
      dateOfBirth,
      familyStatus,
      address
    });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ success: false, message: 'Error adding user', error: error.message });
  }
});


app.delete('/deleteUser/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/verifyCode", async (req, res) => {
  const { code } = req.body;

  const user = await User.findById(req.session.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const isCodeValid = user.verificationCode === code;
  const isCodeExpired = Date.now() - new Date(user.verificationCodeTimestamp).getTime() > 10 * 60 * 1000;

  if (isCodeValid && !isCodeExpired) {

    await User.updateOne({ _id: user._id }, { $unset: { verificationCode: "", verificationCodeTimestamp: "" } });

    res.json({ success: true, message: "Verification successful." });
  } else {
    res.json({ success: false, message: "Invalid or expired verification code." });
  }
});

app.get('/getTasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/newTask', async (req, res) => {
  const { title, description } = req.body;

  try {
    const task = new Task({
      title,
      description
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/editTask/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send(task);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.delete('/deleteTask/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted task' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const multer  = require('multer')
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null,uniqueSuffix + file.originalname);
  }
})

const upload = multer({ storage: storage });
app.use(express.static('public'));
app.use('/files', express.static('files'));


app.post("/upload-files", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const fileName = req.file.filename;
  const optionalFileName = req.body.filename;
  const uploadedBy = req.body.userId;
  const originalfileName=req.file.originalname;

  
  try {
    const user = await User.findById(uploadedBy);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const firstName=user.FirstName;
    const lastName=user.LastName;
    const idNumber=user.idNumber;
  

    const newDocument = new Document({
      fileName,
      originalfileName,
      optionalFileName,
      uploadedBy: {
        userId: uploadedBy,
        firstName,
        lastName,
        idNumber
      },
    });

    await newDocument.save();
    return res.status(201).send({ message: 'PDF has been added to database' });
  } catch (error) {
    console.error('Error saving document:', error); // Log error for debugging
    return res.status(500).json({ message: 'PDF has not been added to database', error });
  }
});

app.get('/getfiles', async (req, res) => {
  try {
    const files = await Document.find();
    res.json(files)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
});

app.delete("/deleteDocument/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDocument = await Document.findByIdAndDelete(id);

    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



