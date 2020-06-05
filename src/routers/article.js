const express = require('express')
const User = require('../models/user.js')
const Article = require('../models/article.js')
const {checkAuth} = require('../auth/checkauth.js')

const router = new express.Router()

//to create a new article
router.get('/article/create', checkAuth, async(req, res)=>{
    try{
        const article = new Article({
            owner: req.user._id
        })
        await article.save()
        await req.user.articleCount(1)
        res.redirect('/article/edit/' + article._id)
    }catch(err){
        req.flash('error_msg', 'unable to create a new article')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//to show the editor page to edit
router.get('/article/edit/:aid', checkAuth, async(req, res)=>{
    const article = await Article.findOne({_id: req.params.aid, owner: req.user._id})
    try{
        if(!article){
            return res.send('u can not edit this form')
        }
        res.render('editArticle', {
            article,
            user: req.user
        })
    }catch(err){
        req.flash('error_msg', 'unable to get article')
        res.redirect('/dashboard')
        console.log(err)
    }
})

// to save the article edited
router.post('/article/edit/:aid', checkAuth, async(req, res)=>{
    try{
        const article = await Article.findOneAndUpdate({_id: req.params.aid, owner: req.user._id}, {...req.body}, {new: true, runValidators: true})
        if(!article){
            return res.send('sorry we cant edit this article')
        }
        res.status(200).send()
    }catch(err){
        res.status(400).send()
        console.error(err)
        return new Error(err)
    }
})

// to view articles
router.get('/article/view/:aid', checkAuth, async(req, res)=>{
    try{
        const article = await Article.findOne({_id: req.params.aid})
        await article.populate('owner').execPopulate()
        res.render('viewArticle', {
            article,
            owner: article.owner,
            updatedAt: convert(article.updatedAt),
            user: req.user
        })
    } catch(err){
        req.flash('error_msg', 'unable to view articles')
        res.redirect('/dashboard')
        console.log(err)
    }
})

//to delete article
router.get('/article/delete/:_id', checkAuth, async (req, res)=>{
    try{
        const article = await Article.findOne({_id: req.params._id, owner: req.user._id})
        if(!article){
            return res.send('no such form exist')
        }
        await article.remove()
        await req.user.articleCount(-1)
        res.redirect('/dashboard')
    }catch(err){
        req.flash('error_msg', 'unable to delete article')
        res.redirect('/dashboard')
        console.log(err)
    }
})
module.exports = router

//to canvert the date form
function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }