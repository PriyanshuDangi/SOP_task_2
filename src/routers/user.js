const express = require('express')
const passport = require('passport')
const User = require('../models/user.js')
const Article = require('../models/article.js')
const {checkAuth, checkNotAuth} = require('../auth/checkauth.js')

const router = new express.Router()

router.get('/', (req, res)=>{
    // res.render('index')
    res.redirect('/login')
})

router.get('/signup', (req, res)=>{
    res.render('signup')
})

router.post('/signup', async (req, res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        req.flash('success_msg', 'you are now registered and can login')
        res.redirect('/login')
    }catch(err){
        console.log(err.keyValue)
        if(err.keyValue.email){
            req.flash('error_msg', 'Email is already in use')
        }else if(err.keyValue.name){
            req.flash('error_msg', 'Name is already in use')
        }else{
            req.flash('error_msg', 'Sorry! Unable to register')
        }
        res.redirect('/signup')
    }
})

router.get('/login', (req, res)=>{
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    successRedirect: '/dashboard'
})
// , (req, res)=>{

// }, (err, req, res, next)=>{
//     // console.log('hey')
//     console.log(err)
//     req.flash('message', 'Invalid Email Or Password');
//     res.redirect('/login')
//     next()
// }
)

router.get('/dashboard', checkAuth, async (req, res)=>{
    await req.user.populate('article').execPopulate();
    // console.log(req.user.article)
    // console.log(req.user.allUsers)
    res.render('dashboard', {
        name: req.user.name,
        user: req.user
    })
})

router.get('/user/feed', checkAuth, async (req, res)=>{
    try{
        const articles = await Article.find()
        for(let i =0; i < articles.length; i++){
            await articles[i].populate('owner').execPopulate()
        }
        res.render('myfeed',{
            articles,
            user: req.user
        })
    }catch(err){
        console.log(err)
    }
})

router.get('/user/notification', checkAuth, async (req, res)=>{
    try{
        const unseenFollowers = req.user.unseenFollowers
        req.user.unseenFollowers = 0
        await req.user.save()
        res.render('notification',{
            user: req.user,
            unseenFollowers
        })
    }catch(err){
        console.log(err)
    }
})

router.get('/user/update', checkAuth, async (req, res)=>{
    try{
        res.render('updateProfile', {
            user: req.user
        })
    }catch(err){
        console.log(err)
    }
})

//change user's name and password
router.post('/user/update', checkAuth, async (req, res)=>{
    try{
        const user = req.user
        user.name = req.body.name
        user.password = req.body.password
        user.age = req.body.age
        await user.save()
        // console.log('updated user')
        res.redirect('/dashboard')
    }catch(err){
        if(err.keyValue.name){
            req.flash('error_msg', 'Name is already in use')
        }else{
            req.flash('error_msg', 'unable to update!')
        }
        res.redirect('/user/update')
    }
})

//to search other users
router.post('/user/search', checkAuth, async (req, res)=>{
    try{
        const user = await User.findOne({name: req.body.name})
        if(!user){
            // return res.send('there is no such user')
            req.flash('error_msg', 'there is no such user')
            res.redirect('/dashboard')
        }else{
            res.redirect('/user/profile/'+ user._id)
        }
    }catch(err){
        res.send(err)
    }
})

//to get user's own profile
router.get('/user/me', checkAuth, async (req, res)=>{
    try{
        await req.user.populate('article').execPopulate()
        res.render('myProfile', {
            user: req.user
        })
    }catch(err){

    }
})

//to get other user profiles
router.get('/user/profile/:uid', checkAuth, async (req, res)=>{
    try{
        const user = await User.findOne({_id: req.params.uid})
        if(!user){
            return res.send('there is no such user!')
        }
        await user.populate('article').execPopulate()
        let follow = "follow"
        if(req.user.following.includes(user.name)){
            follow = "unfollow"
        }
        // console.log(user.article)
        res.render('otherProfile', {
            otherUser: user,
            user: req.user,
            follow
        })
    }catch(err){
        res.send(err)
    }
})

//follow request
router.get('/user/follow/:uid', checkAuth, async (req, res)=>{
    try{
        const otherUser = await User.findOne({_id: req.params.uid})
        if(req.user.following.includes(otherUser.name)){
            await otherUser.followersChange(-1, req.user.name)
            await req.user.followingChange(-1, otherUser.name)
        }else{
            await otherUser.followersChange(1, req.user.name)
            await req.user.followingChange(1, otherUser.name)
        }
        res.redirect('/user/profile/' + req.params.uid)
    }catch(err){

    }
})

//logout
router.get('/logout', checkAuth, (req, res)=>{
    req.logout()
    res.redirect('/login')
})

module.exports = router