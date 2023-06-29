const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const HttpError = require('./models/http-error')
const placesRoutes = require("./routes/places-routes")
const userRoutes = require('./routes/user-routes')
const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use('/api/places',placesRoutes);
app.use('/api/users', userRoutes);
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
})
mongoose.
connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(process.env.APP_PORT || 1000, () => console.log(`App is started on ${process.env.APP_PORT} `));
}).catch(err => {
    console.log(err);
});
