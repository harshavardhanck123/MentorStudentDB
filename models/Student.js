const mongoose=require('mongoose')
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
    },
    mentorHistory: [{
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mentor'
        },
        assignedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Student', studentSchema);
