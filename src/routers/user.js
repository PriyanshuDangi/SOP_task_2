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
    failureFlash: true
}), (req, res)=>{
    res.redirect(req.session.returnTo || '/dashboard');
    delete req.session.returnTo;
})

router.get('/dashboard', checkAuth, async (req, res)=>{
    try{
        await req.user.populate('article').execPopulate();
        res.render('dashboard', {
            name: req.user.name,
            user: req.user
        })
    }catch(err){
        req.flash('error_msg', 'unable to get dashboard')
        res.redirect('/login')
        console.log(err)
    }
})

//to get feed page
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
        req.flash('error_msg', 'unable to get feed')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//to get notification
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
        req.flash('error_msg', 'unable to get notifications')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//to user update form page
router.get('/user/update', checkAuth, async (req, res)=>{
    try{
        res.render('updateProfile', {
            user: req.user
        })
    }catch(err){
        req.flash('error_msg', 'unable to update')
        res.redirect('/dashboard')
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
            req.flash('error_msg', 'there is no such user')
            res.redirect('/dashboard')
        }else{
            res.redirect('/user/profile/'+ user._id)
        }
    }catch(err){
        req.flash('error_msg', 'unable to get user')
        res.redirect('/dashboard')
        console.log(err)
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
        req.flash('error_msg', 'unable to get profile')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//to get other user profiles
router.get('/user/profile/:uid', checkAuth, async (req, res)=>{
    try{
        const user = await User.findOne({_id: req.params.uid})
        if(!user){
            req.flash('error_msg', 'unable to get requested user')
            res.redirect('/dashboard')
            return ;
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
        req.flash('error_msg', 'unable to get requested user profile')
        res.redirect('/dashboard')
        console.log(err)
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
        req.flash('error_msg', 'unable to follow')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//logout
router.get('/logout', checkAuth, (req, res)=>{
    try{
        delete req.session.returnTo;
        req.logout()
        res.redirect('/login')
    }catch(err){
        req.flash('error_msg', 'unable to logout')
        res.redirect('/dashboard')
        console.log(err)
    }
})

module.exports = router