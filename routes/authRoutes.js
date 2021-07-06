const passport = require('passport');
const router = require('express').Router();
const genPassword = require('../lib/passwordUtils').genPassword;
const db = require('../config/database')







router.post('/login', passport.authenticate('local'), (req, res)=>{
    if (req.user){
        res.json({status: 200, msg: 'Successfuly logged in!', user: req.user})
    }else{
        res.status(400).json({status: 400, msg: 'Invalid password and/or email', user: req.user})
    }
}
);



router.post('/register', (req, res) => {
    const {email, username, password} = req.body

    const {salt, hash} = genPassword(password)

    const registerUser = () => {
        db('users').insert({
            email: email,
            username: username,
            hash: hash,
            salt: salt,
            joined: new Date()
        })
            .then(data => res.json({status: 200, msg: 'User successfuly registered.', user: req.user}))
            .catch(err => res.status(400).json({status: 400, msg: "Couldn't register user.", user: req.user}))
    }
    

    db.select('*').from('users').where({email: email}).orWhere({username: username})
        .then(users => {
            console.log(users)
            if (users.length > 0){
                res.status(400).json({status: 400, msg: 'User already exists. Please enter a different email and/or username.', user: req.user})
            }else{
                registerUser()
            }
        })

    

});

router.get('/logout', (req, res)=>{
    req.logout();

    res.send(req.isAuthenticated())
})

router.get('/user', (req, res)=>{
    res.send(req.user)
})


module.exports = router;