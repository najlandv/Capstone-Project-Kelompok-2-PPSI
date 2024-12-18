const createError = require('http-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const GuestRouter = require('./routes/GuestRouter');
const AuthRouter = require('./routes/AuthRouter');
const AdminRouter = require('./routes/AdminRouter');
const UserRouter = require('./routes/UserRouter');
const dotenv = require('dotenv');
const cookieParse = require('cookie-parser');
const path = require('path');
const methodOverride = require('method-override');
dotenv.config();


app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "/node_modules/preline/dist")));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "src")))

app.use(methodOverride('_method'));



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParse())
app.use(morgan("dev"))
app.use(cors())


app.use('/', GuestRouter)
app.use('/admin', AdminRouter)
app.use('/user', UserRouter)
app.use('/auth', AuthRouter)



const port = process.env.PORT || 3004;

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});


app.use(function (req, res, next) {
    next(createError(404));
});



module.exports = app;