require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// Gracefully close connection on app termination signals
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination (SIGINT)');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination (SIGTERM)');
  process.exit(0);
});
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Required for fetch requests
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =======================
// Mongoose Schemas
// =======================

// Contact Form Schema
const contactSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    fname1: String,
    lname1: String,
    email: String,
    phone: String,
    add: String,
    add1: String,
    add2: String,
    city: String,
    state: String,
    code: Number,
    c: String,
    w: Date,
    cat: String,
    guest: Number,
    dest: String,
    text: String
});
const Contact = mongoose.model('Contact', contactSchema);

// Event Schema (Dashboard)
const eventSchema = new mongoose.Schema({
    eventPurpose: String,
    guests: Number,
    date: Date,
    budget: String,
    theme: String,
    venue: String,
    foodBeverage: String,
    entertainment: [String],
    decorations: String
});
const Event = mongoose.model('Event', eventSchema);

// Expense Tracker Schema
const expenseSchema = new mongoose.Schema({
    category: String,
    amount: Number,
    date: Date
});
const Expense = mongoose.model('Expense', expenseSchema);

// =======================
// Routes (GET)
// =======================
app.get('/', (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('About'));
app.get('/portfolio', (req, res) => res.render('portfolio'));
app.get('/celebration', (req, res) => res.render('celebration'));
app.get('/ceremonie', (req, res) => res.render('ceremonie'));
app.get('/reception', (req, res) => res.render('reception'));
app.get('/mitzvhans', (req, res) => res.render('mitzvhans'));
app.get('/corporate1', (req, res) => res.render('corporate1'));
app.get('/services', (req, res) => res.render('services'));
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/expense-tracker', (req, res) => res.render('expense-tracker'));

// =======================
// Validations
// =======================
function validateDashboardFormData(req, res, next) {
    const { eventPurpose, guests, date } = req.body;
    if (!eventPurpose || !guests || !date) {
        return res.status(400).send('Missing required dashboard fields');
    }
    next();
}

function validateContactFormData(req, res, next) {
    const { fname, lname, email, text } = req.body;
    if (!fname || !lname || !email || !text) {
        return res.status(400).send('Missing required contact fields');
    }
    next();
}

function validateExpenseFormData(req, res, next) {
    const { category, amount, date } = req.body;
    if (!category || !amount || !date) {
        return res.status(400).send('Missing required expense fields');
    }
    next();
}

// =======================
// Routes (POST)
// =======================

// Dashboard form (via fetch)
app.post('/dashboard-submit', validateDashboardFormData, async (req, res) => {
    try {
        const formData = {
            ...req.body,
            entertainment: Array.isArray(req.body.entertainment)
                ? req.body.entertainment
                : req.body.entertainment
                    ? [req.body.entertainment]
                    : []
        };

        const entry = new Event(formData);
        await entry.save();
        console.log('Dashboard Entry Saved:', entry);
        res.send('Dashboard Entry Saved to MongoDB Successfully!');
    } catch (err) {
        console.error('Dashboard Save Error:', err);
        res.status(500).send('Server Error');
    }
});

// Contact form
app.post('/contact-submit', validateContactFormData, async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        console.log('Contact Form Saved:', contact);
        res.send('Contact Form Saved to MongoDB Successfully!');
    } catch (err) {
        console.error('Contact Save Error:', err);
        res.status(500).send('Server Error');
    }
});

// Expense form
app.post('/expense-submit', async (req, res) => {
  try {
    const { category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).send("All fields are required.");
    }

    const newExpense = new Expense({ category, amount, date });
    await newExpense.save();

    console.log("Expense Saved:", newExpense);
    res.send("Expense saved to MongoDB successfully!");
  } catch (error) {
    console.error("Expense Save Error:", error);
    res.status(500).send("Error saving expense.");
  }
});


// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
})
module.exports = app;
