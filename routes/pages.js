// const express =  require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("welcome to logist"); //index res.render
});

router.get('/register', (req, res) => {
    res.send("Register Page later..");
});

module.exports = router;