const mongoose = require('mongoose')

const arrticleSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Heading'
    },
    content: {
        type: String,
        default: 'your text here...'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},{
    timestamps: true
})

const Article = mongoose.model('article', arrticleSchema)

module.exports = Article