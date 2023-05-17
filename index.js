const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Little Joyful Land is under construction')
})
app.listen(port, () => {
    console.log(`Little Joyful Land made in road ${port}`)
})