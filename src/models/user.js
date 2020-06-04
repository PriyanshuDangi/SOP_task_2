const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: [true, "name must be unique"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        unique: [true, "email must be unique"]
    },
    password: {
        type: String,
        required: true,
        min: 7
    },
    age: {
        type: Number,
        required: true,
        min: [13, 'age must be above 13']
    },
    totalArticle: {
        type: Number,
        default: 0
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followers: [{
        type: String
    }],
    unseenFollowers:{
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    following: [{
        type: String
    }]
}, {
    timestamps: true
})

userSchema.virtual('article', {
    ref: 'article',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.articleCount = async function(count){
    try{
        const user = this
        user.totalArticle += count
        await user.save()
    }catch(err){
        // throw new Error('unable to change totalCount')
    }
}

userSchema.methods.followersChange = async function(count, username){
    try{
        const user = this
        user.followersCount += count
        if(count == 1){
            user.followers = user.followers.concat(username)
            user.unseenFollowers += 1
        }else{
            let index = user.followers.indexOf(username)
            user.followers.splice(index, 1)
        }
        await user.save()
    }catch(err){
        // throw new Error('unable to follow')
    }
}

userSchema.methods.followingChange = async function(count, username){
    try{
        const user = this
        user.followingCount += count
        if(count == 1){
            user.following = user.following.concat(username)
        }else{
            let index = user.followers.indexOf(username)
            user.following.splice(index, 1)
        }
        await user.save()
    }catch(err){
        // throw new Error('unable to follow')
    }
}

userSchema.pre('save', async function(next){
        const user = this
        if(user.isModified('password')){
            user.password = await bcrypt.hash(user.password, 8)
        }
        next()
})

const User = mongoose.model('user', userSchema)

module.exports = User;