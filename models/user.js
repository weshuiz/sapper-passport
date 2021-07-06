const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 100
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 100
    },
    email: {
        type: String,
        required: true,
        min: 2,
        max: 255  
    },
    password: {
        type: String,
        required: true,
        max: 255
    },
    roles: {// array of role names
        type: [String],
        default: ['basic']
    },
    createdAt: {
        type: Date
        // [YYYY]-[MM]-[DD]T[HH]:[ii]:[ss].[MS]+[TH]:[TM]
    },
    createdBy: {// self created accounts will use the users name (see authRoutes.js)
        type: String,
        max: 255
    },
    updatedAt: {
        type: Date,
        default: null
    },
    updatedBy: {
        type: String,
        default: null
    }
},
{// remove the __v;
    versionKey: false
});

export default mongoose.model('Users', userSchema);