const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body; //const name = req.body.name 

    //  Check if email already exists and passwords match
    db.query('SELECT email FROM users WHERE email = ?', [email], async(err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length > 0) {
            return res.status(400).json({ message: 'That email is already registered' });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if(err){
                console.log(err);
            } else {
                return res.status(201).json({message: 'User registered successfully' });
            }
        });
    });
};

exports.login = (req, res) =>  {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];
        const matches = await bcrypt.compare(password, user.password);
        if (!matches) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        else {
            return res.status(200).json({message: 'Login succesful'});
        }
    });
};