const passport = require('passport');
const router = require('express').Router();
const genPassword = require('../lib/passwordUtils').genPassword;
const db = require('../config/database')







router.post('/login', passport.authenticate('local'), (req, res)=>{
    if (req.user){
        res.json({status: 200, msg: 'Successfuly logged in!', user: req.user[0], isauth: true})
    }else{
        res.status(400).json({status: 400, msg: 'Invalid password and/or email', user: {}, isauth: false})
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
            .then(data => {
                db.select('*').from('users').where({email: email})
                    .then(data => res.json({status: 200, msg: 'User successfuly registered.', user: data[0], isauth: true }))
            })
            .catch(err => res.status(400).json({status: 400, msg: "Couldn't register user.", user: {}, isauth: false}))
    }

    db.select('*').from('users').where({email: email}).orWhere({username: username})
        .then(users => {
            if (users.length > 0){
                res.status(400).json({status: 400, msg: 'User already exists. Please enter a different email and/or username.', user: {}, isauth: false})
            }else{
                registerUser()
            }
        })

    

});

router.get('/logout', (req, res)=>{
    console.log('logout')

    req.logout();
    req.user = undefined
    res.redirect('/')
    

})

router.get('/user', (req, res)=>{
        
    let isAuth = true
    if (req.user === undefined) {
        req.user = [{}]
        isAuth = false
    }
    const userObject = req.user[0]

    delete userObject.hash
    delete userObject.salt

    res.json({user: userObject, isauth: isAuth})
})


module.exports = router;