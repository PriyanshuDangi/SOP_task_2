const passport = require('passport')
const User = require('../models/user.js')

const checkAuth = async (req, res, next)=>{
    if(req.isAuthenticated()){
        const allUsers = await User.find()
        allUsersName = allUsers.map((user)=>{
            return user.name
        })
        const index = allUsersName.indexOf(req.user.name)
        allUsersName.splice(index, 1)
        // console.log(allUsersName)
        req.user.allUsers = allUsersName
        return next()
    }
    // const allUsers = await User.find()
    // console.log(index)
    // allUsers.splice(index, 1)
    // req.allUsers = allUsers
    res.redirect('/login')
}

const checkNotAuth = (req, res, next)=>{
    if(req.isAuthenticated){
        return res.redirect('/')
    }
    return next()
}

module.exports = {
    checkAuth,
    checkNotAuth
}