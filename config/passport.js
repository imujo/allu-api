const db = require('./database')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {validatePassword} = require('../lib/passwordUtils')




const verifyCallback = (email, password, done) =>{

    db.select('*').from('users').where({email: email})
        .then(user =>{
            if (user.length === 0) {return done(null, false)}

            const isValid = validatePassword(password, user[0].hash, user[0].salt)


            if (isValid){
                return done(null, user);
            }else{
                return done(null, false)
            }
        })
        .catch(err=>{
            done(err , false)
        })

}



const strategy = new LocalStrategy(verifyCallback)


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