const router = require('express').Router();
const {isAuth, isAdmin} = require('./authMiddleware')
const db = require('../config/database')


/**

 *--------------------- GET ROUTES ---------------------*

 **/

// Get Languages
router.get('/languages', (req, res)=>{
    db.select('*').from('languages')
        .then(data => res.json(data))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Categories
router.get('/categories', (req, res)=>{
    db.select('*').from('categories')
        .then(data => res.json(data))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Category
router.get('/category/:category', (req, res)=>{
    const category = req.params.category

    db.select('*').from('categories')
        .where({category: category})
        .then(data => {console.log(data[0]);res.json(data[0])})
        .catch(e => res.status('400').json('There has been an error'))
})

// Get Articles
router.get('/articles/:articleType', (req, res)=>{
    db.select('*').from(`${req.params.articleType}articles`)
        .then(data => res.json(data))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Article (id & type)
router.get('/article/:articleType/:id',(req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from(`${articleType}articles`).where({id: id})
        .then(data => {
            data.length !== 0 ? res.json(data) : res.status('404').send('No such article')
        })
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Clicks
router.get('/clicks/:articleType/:id',(req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from(`${articleType}articles`).where({id: id})
        .then(data => res.json(data[0]['clicks']))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Likes
router.get('/likes/:articleType/:id',(req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from('likes').where({
        articletype: articleType,
        articleid: id
    })
        .then(likes => res.json(likes.length))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get User Article Like
router.get('/like/:articleType/:articleId/:userId',(req, res)=>{
    const {articleType, articleId, userId} = req.params

    db.select('*').from('likes').where({
        articletype: articleType,
        articleid: articleId,
        userid: userId
    })
        .then(like => {
            like.length > 0 ? 
                res.json({liked: true})
            :
                res.json({liked: false})
        })
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Comments
router.get('/comments/:articleType/:id',(req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from('comments').where({
        articletype: articleType,
        articleid: id
    })
        .then(comments => res.json(comments))
        .catch(e => res.status('400').send('There has been an error'))
})






/**

 *--------------------- POST ROUTES ---------------------*

 **/




// Add Click
router.post('/addClick/:articleType/:id', (req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from(`${articleType}articles`).where({id: id}).increment('clicks', 1)
        .then(data => res.send())
        .catch(e => res.status('400').send('There has been an error'))
})

// Add Like
router.post('/addLike/:articleType/:articleId/:userId', isAuth, (req, res)=>{
    const {articleId, articleType, userId} = req.params

    let liked;

    db.select('*').from('likes').where({
        userid: userId,
        articletype: articleType,
        articleid: parseInt(articleId)
    })
        .then(data => {
            data.length > 0 ? liked = true : liked = false
        })
        .then(data => {
            liked ? 
                db.select('*').from('likes').where({
                    userid: userId,
                    articletype: articleType,
                    articleid: parseInt(articleId)
                })
                    .del()
                    .then(data => res.send('deleted'))
                    .catch(e => res.status('400').send('There has been an error'))
                :
                db('likes').insert({
                    userid: userId,
                    articletype: articleType,
                    articleid: parseInt(articleId)
                })
                .then(data => res.send('added'))
                    .catch(e => res.status('400').send('There has been an error'))
        }
            
                
        )
    

    
})

// Add Comment
router.post('/addComment/:articleType/:articleId/:username/:text', isAuth, (req, res)=>{
    const {articleType, articleId, username, text} = req.params

    db('comments').insert({
        text: text,
        username: username,
        articletype: articleType,
        articleid: articleId
    })
        .then(data => {console.log('Comment posted'); res.send()})
        .catch(e => {console.log(e); res.status(400).send('Unable to post the comment')})
})

module.exports = router;