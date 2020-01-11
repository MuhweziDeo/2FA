const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    
    authyId: String,
    password: String,
    phoneNumber: String,
    ipAddresses: Array
});

const User = mongoose.model('User', UserSchema);

const DeviceSchema = new Schema({
    deviceIP: String,
    user_id: String
})

const Device = mongoose.model('Device', DeviceSchema);

module.exports = {Device, User};