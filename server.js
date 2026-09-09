const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve Static Frontend Files (HTML, CSS)
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Atlas Connected Successfully!'))
.catch(err => console.error('Database connection error:', err));

// Define Enquiry Schema & Model
const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    projectType: { type: String, required: true },
    message: { type: String },
    date: { type: Date, default: Date.now }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

// Handle Form Submission Route (Saving to MongoDB Atlas)
app.post('/submit-enquiry', async (req, res) => {
    try {
        const { name, phone, projectType, message } = req.body;
        
        const newEnquiry = new Enquiry({
            name,
            phone,
            projectType,
            message
        });

        await newEnquiry.save();
        console.log('Enquiry saved to Database:', newEnquiry);
        
        res.send(`
            <script>
                alert('Enquiry submitted & saved to database successfully!');
                window.location.href = '/contact.html';
            </script>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error: Unable to save enquiry.');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});