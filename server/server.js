require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User=require('./class-models/User');
const Service=require('./class-models/Service');
const Announcement=require('./class-models/Announcement');
const Appointment=require('./class-models/Appointment');
const Event=require('./class-models/Event');
const NewsLetter=require('./class-models/NewsLetter');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const session = require('express-session');
const multer = require('multer');


const app = express();
const PORT = process.env.PORT || 3001;
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI);

app.use(bodyParser.json());

const upload = multer({
  storage: multer.memoryStorage()
});

app.use(session({
  secret: 'Team2',           
  resave: false,             
  saveUninitialized: true,   
  cookie: { secure: false } 
}));


//Enable Cors
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,              
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

//------------------------------------------------------------------------------------ 
//API Endpoint to receive OTP
//OTP sender config

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/generate-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const otpExpiry = Date.now() + 15 * 60 * 1000;

    const newUser = new User({
      email,
      otp,
      otpExpiry
    });
    await newUser.save();

    transporter.sendMail({
      to: email,
      subject: "Verify your Email - OTP for Signup",
      text: `Your OTP for email verification is ${otp}. It is valid for 15 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp, firstName, lastName, phone, password, role } = req.body;

  try {    
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.password = hashedPassword;
    user.role = role;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

//------------------------------------------------------------------------------------


//API Endpoints for Login and Signup functionality
app.post('/sign-up', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
    const empId = Math.floor(10000 + Math.random() * 90000).toString();
  
    try {      
      const hashedPassword = await bcrypt.hash(password, 10);
        
      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role : 'Devotee',
        empId
      });
        
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
        console.error('Error adding user:', err);
        if (err.code === 11000) {
          const duplicateField = Object.keys(err.keyValue)[0];
          return res
            .status(400)
            .json({ message: `Email  '${err.keyValue[duplicateField]}' already exists` });
        }
      
        res.status(500).send('Server Error');
      }      
  });

app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email, role });

  if (!user) {
      return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
  }
  req.session.user = { id: user.empId, role: user.role };
  const secret = 'Team2';
  const token = jwt.sign({ id: user.empId, role: user.role }, secret, { expiresIn: '1h' });

  return res.status(200).json({ message: 'Logged successfully', user: user, token: token });
});

/*
app.patch('/reset-password', async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({ email: email, otp: otp });
    if (user) {
      user.password = password;
      user.otp = '';
      await user.save();
      res.send('Password reset successful');
    } else {
      res.status(400).send('Invalid OTP or email');
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('Server error');
  }
});
*/

app.patch('/reset-password', async (req, res) => {
    const { email, password, password1 } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
        const updated = await User.findByIdAndUpdate(email, { password: hashedPassword }, { new: true });
        if (!updated) {
            return res.status(404).send('User not found');
        }
        res.json(updated);
    } catch (error) {
        res.status(500).send('Server error');
    }
  });


//------------------------------------------------------------------------------------ 
//API Endpoints related to Priest
app.post('/create-priest', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  const empId = Math.floor(10000 + Math.random() * 90000).toString();

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role : 'Priest',
      empId
    });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/get-priests', async (req, res) => {
    const role  = 'priest';
    try {
      const users = await User.find({ role: role });
      res.json(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).send('Server error');
    }
  });

//------------------------------------------------------------------------------------
//API Endpoints related to Appointments
app.post('/book-appointment', async (req, res) => {
  try {
    const { priestId, priest, date, time, information, userName, email } = req.body;
    const newAppointment = new Appointment({
      priestId,
      priest,
      date,
      time,
      information,
      userName,
      email,
    });
    await newAppointment.save();

    const mailOptions = {      
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Appointment Confirmation",
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Your appointment has been successfully booked with <b>${newAppointment.priest}</b>.</p>
        <p> Verify the following information.</p>
        <p><b>Date: </b> ${new Date(date).toLocaleDateString()}</p>
        <p><b>Time: </b> ${newAppointment.time}</p>
        <p><b>Information to Priest: </b> ${newAppointment.information}</p>
        <p>Thank you for choosing our services.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).send('Error inserting appointment: ' + error.message);
  }
});

app.get('/get-appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).send('Error fetching appointments: ' + error.message);
  }
});

app.delete('/delete-appointment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).send("Appointment not found.");
    }

    const { priest, date, time, information, userName, email } = appointment;
    await Appointment.findByIdAndDelete(id);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Appointment Cancellation",
      html: `
        <h2>Appointment Cancelled</h2>
        <p>Dear ${userName},</p>
        <p>Your appointment has been <b>cancelled</b> with <b>${priest}</b>.</p>
        <p><b>Date:</b> ${new Date(date).toLocaleDateString()}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>Information to Priest:</b> ${information}</p>
        <p>We are sorry for any inconvenience caused. Thank you for choosing our services.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send(`Appointment with id ${id} deleted successfully and confirmation email sent.`);
  } catch (error) {
    console.error("Failed to delete the Appointment:", error);
    res.status(500).send("Error deleting appointment from the database");
  }
});


app.patch('/update-appointment/:id', async (req, res) => {
  const { status } = req.body;
  try {
      const updated = await Appointment.findByIdAndUpdate(req.params.id, { status: status }, { new: true });
      if (!updated) {
          return res.status(404).send('Appointment not found');
      }
      res.json(updated);
  } catch (error) {
      res.status(500).send('Server error');
  }
});


//------------------------------------------------------------------------------------
// API endpoints related to announcements
app.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (error) {
    res.status(500).send('Error fetching announcements: ' + error.message);
  }
});

app.post('/add-announcement', async (req, res) => {
  try {

    const newAnnouncement = new Announcement(req.body);
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error adding announcement: ' + error.message);
  }
});

app.put('/announcements/:id', async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).send('Error updating announcement: ' + error.message);
  }
});

app.delete('/announcements/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).send("Announcement not found.");
    }
    res.status(200).send(`Announcement with id ${id} deleted successfully.`);
  } catch (error) {
    console.error('Failed to delete the announcement:', error);
    res.status(500).send('Error deleting announcement from the database');
  }
});


//------------------------------------------------------------------------------------
//API endpoints related to Services
app.use(express.urlencoded({ extended: true }));

app.post('/add-service', async (req, res) => {
  const { title, description, category } = req.body;

  try {
      const newService = new Service({
          title,                  
          description,
          category
      });
      await newService.save();
      res.status(201).send('Service added successfully');
  } catch (error) {
      console.error('Failed to add the service:', error);
      res.status(500).send('Error adding service to the database');
  }
});

app.put('/services/:id', async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, {
      title: title,          
      description: description,
    }, { new: true });
    res.json(updatedService);
  } catch (error) {
    res.status(500).send('Error updating announcement: ' + error.message);
  }
});

app.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Failed to retrieve services:', error);
    res.status(500).send('Error retrieving services from the database');
  }
});

app.delete('/services/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).send("Service not found.");
    }
    res.status(200).send(`Service with id ${id} deleted successfully.`);
  } catch (error) {
    console.error('Failed to delete the service:', error);
    res.status(500).send('Error deleting service from the database');
  }
});


//------------------------------------------------------------------------------------
//API Endpoints related to Events
app.post('/events', async (req, res) => {
  try {
    const { title, start, allDay } = req.body;

    // Convert start to ensure UTC midnight for all-day events
    const utcStartDate = allDay
      ? new Date(new Date(start).setUTCHours(0, 0, 0, 0)).toISOString()
      : new Date(start).toISOString();

    const event = new Event({
      title,
      start: utcStartDate,
      allDay: allDay || false,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ message: "Error saving event" });
  }
});


app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(
      events.map((event) => ({
        ...event.toObject(),
        start: new Date(event.start).toISOString(), // Ensure UTC format
      }))
    );
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});


app.delete('/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

//------------------------------------------------------------------------------------
//API Endpoint for Newsletter
app.post('/subscribe-newsletter', async (req, res) => {
  try {
    const { emailId, date } = req.body;

    const existingEmail = await NewsLetter.findOne({ emailId });
    if (existingEmail) {
      return res.status(400).json({ message: "You are already under our subscription" });
    }

    const model = new NewsLetter({ emailId, date });
    await model.save();
    res.status(201).json({ message: "Thank you for subscribing!", model });
  } catch (err) {
    console.error('Error subscribing to newsletter:', err);
    res.status(500).json({ message: 'Error subscribing to the newsletter' });
  }
});


app.get('/newsletter-email-list', async (req, res) => {
  try {
    const events = await NewsLetter.find();
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

//Run the backend app in port mentioned in .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
