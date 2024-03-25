const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const User = require("./models/User");
const session = require("express-session");
require('dotenv').config();
const sgMail = require('@sendgrid/mail')
let server;
const mongoDbUrl =
  "mongodb+srv://eladamir46:Ea86451200@optimax-finalproject.phqfbz4.mongodb.net/OptiMax";

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
      mongoUrl: mongoDbUrl,
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
    "mongodb+srv://eladamir46:Ea86451200@optimax-finalproject.phqfbz4.mongodb.net/OptiMax",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB with Mongoose"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const createUsers = async () => {
  try {
    // Creating a superuser
    const superUser = new User({
      username: "efrat",
      email: "efrat@gmail.com",
      idNumber: "123456789", // Example ID Number
      role: "מנהל", // Updated role based on the new enum values
      phoneNumber: "0501234567", // Example Phone Number
      dateOfBirth: new Date("1990-01-01"), // Example Date of Birth
      familyStatus: "נשוי/ה", // Example Family Status
      address: { // Example Address
        street: "רחוב השלום 15",
        city: "תל אביב",
      }
    });

    await superUser.save();

    // Creating another example user
    const user = new User({
      username: "elad",
      email: "elad@gmail.com",
      password: "1212", // Hash passwords in real applications
      idNumber: "987654321", // Example ID Number
      role: "עובד", // Updated role based on the new enum values
      phoneNumber: "0507654321", // Example Phone Number
      dateOfBirth: new Date("1992-02-02"), // Example Date of Birth
      familyStatus: "רווק/ה", // Example Family Status
      address: { // Example Address
        street: "רחוב גאולה 20",
        city: "ירושלים",
      }
    });

    await user.save();

    console.log("Users created");
  } catch (error) {
    console.error("Error creating users:", error);
  }
};

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

app.post("/login", async (req, res) => {
  const { email, idNumber } = req.body;
  const SenderEmail='optimax58@gmail.com';
  const user = await User.findOne({ email });
  if (user && user.idNumber === idNumber) {
    req.session.isLoggedIn = true;
    req.session.role = user.role;
    req.session.userId = user._id;
    req.session.username = user.username;
    console.log(req.session);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationCodeTimestamp = new Date();
    await User.updateOne({ _id: user._id }, { $set: { verificationCode, verificationCodeTimestamp } });


    
    sgMail.setApiKey('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')
    const msg = {
      to: email, 
      from: SenderEmail, 
      subject: 'קוד אימות',
      text: `קוד האימות שלך לכניסה למערכת הוא: ${verificationCode}`,
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
      username: user.username,
      role: user.role,
    });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

app.post("/logout", async (req, res) => {
  const userId= req.session.userId;
  await User.updateOne({ _id: userId }, { $unset: { verificationCode: "", verificationCodeTimestamp: "" } });

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

app.post('/adduser', async (req, res) => {
  const { username, email, idNumber, role, dateOfBirth, familyStatus, address } = req.body;

  try {
    const newUser = new User({
      username,
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






