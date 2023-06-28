const express = require('express')
const bodyParser = require('body-parser')
const HttpError = require('./models/http-error')
const placesRoutes = require("./routes/places-routes")
const userRoutes = require('./routes/user-routes')
const app = express();
app.use(bodyParser.json());

app.use('/api/places',placesRoutes);
app.use('/api/users', userRoutes);
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})

app.listen(5000);