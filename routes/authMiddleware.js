
module.exports.isAuth = (req, res, next) =>{
    if (req.isAuthenticated()){
        next()
    }else{
        res.status('401').json({msg:'You are not logged in'})
    }
}

module.exports.isAdmin = (req, res, next) =>{
    if (req.isAuthenticated() && req.user[0].admin){
        next()
    }else{
        res.status('401').json({msg:'You are not an admin'})
    }
}