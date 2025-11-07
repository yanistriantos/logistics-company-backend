    //the address of this server connected to the network is: 
    // URL -> http://localhost:5000
    //IP -> 127.0.0.1:5000
    const dotenv = require('dotenv');
    dotenv.config( { path: './.env'} );
    const jwt = require('jsonwebtoken');

    const express = require('express');//import express
    const app = express(); 

    const db = require('./config/db');
    const PORT = 5000;
    app.use(express.json());//middleware to parse json data

  

    //HTTP VERBS(method) && Routes (or paths) 
//The method inofrms the nature of request andd the route is further subdirectory
//(basically we direct the request to the body of the code to respond appropriately,
// and these locations or routes are called endpoints)

//CRUD - create-post read-get update-put delete-delete
    

//Website endpoints 
app.get('/', (req, res) => {
        console.log('Endpoint hit: GET /', req.method);
        res.sendStatus(201); //304 Not Modified
    });

   // Start the server
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`);});
//hardware running software that is connected to the internet that listens to incoming requests to its ip address



//API endpoints 
app.get('/api/data', (req, res) => {
    conole.log('Done');
    res.sendStatus(200);
});


app.use('/', require('./routes/pages') );  //"auth/register" method ="POST"
app.use('/auth', require('./routes/auth') );  





