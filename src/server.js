const express = require('express');
const { setup } =  require('radiks-server');
const path = require('path');
const app = express();

setup().then(RadiksController => {
    app.use('/radiks', RadiksController);
})

// app.get('*', (req, res) => {
//     res.send("Hi, I am a Server for Anonym");
// });

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Radiks Server listening on ${port}`);

const secondPort = process.env.REACT_APP_PORT || 5000;
console.log(`We also have ${secondPort}`);

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'))
});