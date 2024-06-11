const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mentor =require('./models/Mentor.js');
const Student =require('./models/Student.js');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB using environment variable

try{
    mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected")
}
catch(e){
    console.log(e)
}
// API endpoints

// Create Mentor
app.post('/mentors', async (req, res) => {
    try {
        const { name, email } = req.body;
        const mentor = new Mentor({ name, email });
        await mentor.save();
        res.status(201).send(mentor);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Create Student
app.post('/students', async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log("Received student name:", name);
        console.log("Received student email:", email);

        // Check if name and email are provided
        if (!name || !email) {
            return res.status(400).send({ error: "Name and email are required." });
        }

        const student = new Student({ name, email });
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(400).send({ error: error.message });
    }
});


// Assign a student to Mentor
app.put('/assign-student/:mentorId/:studentId', async (req, res) => {
    try {
        const { mentorId, studentId } = req.params;
        console.log("Received mentorId:", mentorId);
        console.log("Received studentId:", studentId);

        // Check if mentorId and studentId are valid ObjectId values
        if (!mongoose.Types.ObjectId.isValid(mentorId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).send({ error: "Invalid mentorId or studentId." });
        }

        const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId }, { new: true });
        if (!student) {
            return res.status(404).send({ error: "Student not found." });
        }

        res.send(student);
    } catch (error) {
        console.error("Error assigning student to mentor:", error);
        res.status(400).send({ error: error.message });
    }
});


// Select one mentor and Add multiple Students
app.put('/add-students/:mentorId', async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { students } = req.body; // Assuming students is an array of student ids
        const updatedStudents = await Student.updateMany({ _id: { $in: students } }, { mentor: mentorId });
        res.send(updatedStudents);
    } catch (error) {
        res.status(400).send({error:error.message});
    }
});

// A student who has a mentor should not be shown in List
app.get('/newstudents', async (req, res) => {
    try {
        const students = await Student.find({ mentor: { $exists: false } });
        res.send(students);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Assign or Change Mentor for particular Student
app.put('/change-mentor/:studentId/:newMentorId', async (req, res) => {
    try {
        const { studentId, newMentorId } = req.params;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).send({ error: "Student not found." });
        }

        // Save the current mentor as previous mentor
        const previousMentorId = student.mentor;
        if (previousMentorId) {
            student.mentorHistory.push({ mentor: previousMentorId });
        }

        // Update the student's mentor
        student.mentor = newMentorId;
        await student.save();

        res.send(student);
    } catch (error) {
        console.error("Error changing mentor for student:", error);
        res.status(500).send({ error: "Internal server error." });
    }
});


// Select One Student and Assign one Mentor
app.put('/assign-mentor/:studentId/:mentorId', async (req, res) => {
    try {
        const { studentId, mentorId } = req.params;
        const student = await Student.findByIdAndUpdate(studentId, { mentor: mentorId }, { new: true });
        res.send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Show all students for a particular mentor
app.get('/mentor-students/:mentorId', async (req, res) => {
    try {
        const { mentorId } = req.params;
        console.log("Received mentorId:", mentorId);

        // Check if mentorId is a valid ObjectId value
        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
            return res.status(400).send({ error: "Invalid mentorId." });
        }

        const students = await Student.find({ mentor: mentorId });
        console.log("Retrieved students:", students);

        res.send(students);
    } catch (error) {
        console.error("Error fetching mentor students:", error);
        res.status(500).send({ error: "Internal server error." });
    }
});


// Show the previously assigned mentor for a particular student
app.get('/previous-mentor/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId).populate('mentor');
        res.send(student.mentor);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Start the server using environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    try{
    console.log(`Server is running on port ${PORT}`);
    }
    catch(error){
        console.error("Error starting server:", error);
    }
});