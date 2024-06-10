const mongoose=require('mongoose')
const mentorSchema = new mongoose.Schema({
    name:String,
    email:String
})

module.exports = mongoose.model('Mentor', mentorSchema);