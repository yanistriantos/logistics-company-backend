// URL -> http://localhost:5000
//IP -> 127.0.0.1:5000
    const express = require('express');//import express
    const app = express(); 

    const dotenv = require('dotenv');
    dotenv.config( { path: './.env'} );
    const jwt = require('jsonwebtoken');

    const db = require('./config/db');
    const PORT = 5000;
    app.use(express.json());//middleware to parse json data

//Website endpoints `
app.get('/', (req, res) => {
        console.log('Endpoint hit: GET /', req.method);
        res.sendStatus(201); //304 Not Modified
    });

   // Start the server
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`);});

//API endpoints 

// app.get('/api/data', (req, res) => {
//     conole.log('Done');
//     res.sendStatus(200);

// });

app.use('/', require('./routes/pages') );  //"auth/register" method ="POST"
app.use('/auth', require('./routes/auth') );  


// app.use('/api/offices', require('./routes/offices'));
// app.use('/api/employees', require('./routes/employees'));
// app.use('/api/clients', require('./routes/clients'));
// app.use('/api/packages', require('./routes/packages'));


