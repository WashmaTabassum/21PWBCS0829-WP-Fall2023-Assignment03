// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     firstname: {
//         type: String,
//         required: true,
//     },
//     lastname: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     mobile: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     address: {
//         street: String,
//         city: String,
//         state: String,
//         country: String,
//         postalCode: String
//     },
//     orders: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Order'
//     }]
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    role: {
        type: String,
        default: 'user', // Set the default role to 'user'
    },
});

module.exports = mongoose.model('User', userSchema);

