const db = require('./database')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {validatePassword} = require('../lib/passwordUtils')


const parameters ={
    usernameField: 'email',
    passwordField: 'password'
}

const verifyCallback = (email, password, done) =>{

    db.select('*').from('users').where({email: email})
        .then(user =>{
            if (user.length === 0) {return done(null, false, { message: 'A user with that email was not found'})}

            const isValid = validatePassword(password, user[0].hash, user[0].salt)


            if (isValid){
                return done(null, user);
            }else{
                return done(null, false, { message: 'Password is incorrect'})
            }
        })
        .catch(err=>{
            done(err , false)
        })

}



const strategy = new LocalStrategy(parameters, verifyCallback)


passport.use(strategy)


passport.serializeUser((user, done)=>{
    done(null, user[0].id)
})

passport.deserializeUser((userId, done)=>{
    db.select('*').from('users').where({id: userId})
        .then(user=>{
            done(null, user)
        })
        .catch(err => done(err))
})