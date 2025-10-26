    //the address of this server connected to the network is: 
    // URL -> http://localhost:5000
    //IP -> 127.0.0.1:5000
    
    const express = require('express');//import express
    const app = express();// create our backend application for us
    const PORT = 5000;
    

   // Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);});
//hardware running software that is connected to the internet that listens to incoming requests to its ip address


