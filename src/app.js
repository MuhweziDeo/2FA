const express = require('express');
const expressip = require('express-ip');
const AUthy = require('authy-client').Client;
const network = require('network');

const {User, Device} = require("./models");
const {API_KEY} = require("./config");

const app = express();
const AuthyClient = new AUthy({key: API_KEY});
// console.log(Client);
app.use(express.json());
app.set('trust proxy', true);
app.use(expressip().getIpInfoMiddleware);

app.get("/", (req, res) => {
res.send({
    message: "2 Factor authentication using AUthy"
});
});
 
const ipAdress = () => {
    return new Promise((resolve, reject) => {
        return network.get_public_ip((err, ip) => {
            if(err) {
                reject(err);
            }
            resolve(ip);
        })     
     });
}  

app.post('/login', async(req, res) => {
    const user = await User.find().sort({created_at: -1}).exec();
    // authenticate user and send sms
    return AuthyClient.requestSms({authyId: '223413830'}, {force: true},  (err, smsResponse) => {
        if (err) {
            console.error('ERROR requestcall', err);
            res.status(500).json(err);
            return;
        }
        console.log("requestCall response: ", smsResponse);
        res.status(200).json({smsResponse});
    });
})
app.post('/register', async(req, res) => {
    // req body must contain country code, phone_number, email, username, password
    const {body: {email, phoneNumber, username, password, code}} = req;
    // const ip = await ipAdress();
    const newUser = new User({email, phoneNumber, username, password, code, authyId: null, ipAddresses: [1]});
    console.log(req.headers['x-forwarded-for']);
    try {
        const saved = await newUser.save();
        return AuthyClient.registerUser({
            countryCode: code,
            email,
            phone: phoneNumber
        }, async(err, registrationResponse) => {
            if(err) {
                return res.send({err})
            }
            console.log({err});
            console.log({registrationResponse});
            saved.set('authyId', registrationResponse.user.id);
            await saved.save();
            return res.send({saved});
        });
    } catch (error) {
        return res.send({error})
    }
    
});
module.exports = {app}