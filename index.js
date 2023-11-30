const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://127.0.0.1:27017/IT-A')            //IT-A is a database name
    .then(() => {
        console.log('Connected to IT-A database');
    })
    .catch((err) => {
        console.error(err);
    });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now }
});


const User = mongoose.model('his', UserSchema);

app.use(express.json());
app.use(cors());

app.get('/', async (req, resp) => {
    try {
        const users = await User.find({}, 'name email date');
        resp.json(users);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to retrieve user data');
    }
});


app.post('/register', async (req, resp) => {
    try {
        const user = new User(req.body);
        const result = await user.save();
        const userWithoutPassword = result.toObject();
        
        resp.send(userWithoutPassword);
       
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});