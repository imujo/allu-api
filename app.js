const express = require('express')
const cors = require('cors')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const db = require('./config/database')
const passport = require('passport');



// IMPORTING ROUTES
const authRoutes = require('./routes/authRoutes')
const apiRoutes = require('./routes/apiRoutes')
const adminRoutes = require('./routes/adminRoutes')




require('dotenv').config()


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(express.static('public'));






// SETTING UP SESSION STORAGE (COOKIES AND AUTH STORAGE)
const store = new KnexSessionStore({
    db,
    tablename: 'sessions', 
  });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
}))






// INITIALIZING PASSPORT

require('./config/passport');
app.use(passport.initialize())
app.use(passport.session())






// USE ROUTES
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)
app.use('/admin', adminRoutes)



app.use(express.static(process.env.PATH_TO_BUILD))

app.get('/*', (req,res)=>{
    res.sendFile(`${process.env.PATH_TO_BUILD}/index.html`)
})







app.listen(5000, ()=>{
    console.log('App running on port 5000')
})
