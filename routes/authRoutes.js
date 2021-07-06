const passport = require('passport');
const router = require('express').Router();
const genPassword = require('../lib/passwordUtils').genPassword;
const db = require('../config/database')

router.get('/login', (req, res, next) => {

   
    const form = '<h1>Login Page</h1><form method="POST" action="/auth/login">\
    Enter Email:<br><input type="email" name="email">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});


router.get('/register', (req, res) => {

    const form = '<h1>Register Page</h1><form method="post" action="/auth/register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Email:<br><input type="email" name="email">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});

router.post('/login', passport.authenticate('local', {failureRedirect: 'register', successRedirect: '/api/categories'}));


router.post('/register', (req, res, next) => {
    const {email, username, password} = req.body

    const {salt, hash} = genPassword(password)


    db('users').insert({
        email: email,
        username: username,
        hash: hash,
        salt: salt,
        joined: new Date()
    })
        .then(data => res.json(data))
        .catch(err => res.status('400').send(err))

});

router.get('/logout', (req, res)=>{
    req.logout();

    res.send(req.isAuthenticated())
})

router.get('/authenticated', (req, res)=>{
    res.send(req.isAuthenticated())
})


module.exports = router;