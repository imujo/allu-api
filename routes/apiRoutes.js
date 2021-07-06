const router = require('express').Router();
const {isAuth, isAdmin} = require('./authMiddleware')
const db = require('../config/database')

/**

 *--------------------- GET ROUTES ---------------------*

 **/

// Get Languages
router.get('/languages', isAuth, (req, res)=>{
    let languagesList = []
    db.select('*').from('languages')
        .then(languages => languages.map((language, i)=>{
            languagesList.push(language['language'])
        }))
        .then(data => res.json(languagesList))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Categories
router.get('/categories', isAdmin, (req, res)=>{
    let categoriesList = []
    db.select('*').from('categories')
        .then(categories => categories.map((category, i)=>{
            categoriesList.push(category['category'])
        }))
        .then(data => res.json(categoriesList))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Read Articles
router.get('/readArticles', (req, res)=>{
    let articleList = []
    db.select('*').from('readarticles')
        .then(articles => articles.map((article, i)=>{
            articleList.push(article)
        }))
        .then(data => res.json(articleList))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Listen Articles
router.get('/listenArticles',(req, res)=>{
    let articleList = []
    db.select('*').from('listenarticles')
        .then(articles => articles.map((article, i)=>{
            articleList.push(article)
        }))
        .then(data => res.json(articleList))
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
router.post('/addLike/:articleType/:id', isAuth, (req, res)=>{
    const {id, articleType} = req.params

    let liked;

    db.select('*').from('likes').where({
        username: 'admin',
        articletype: articleType,
        articleid: parseInt(id)
    })
        .then(data => {
            data.length > 0 ? liked = true : liked = false
        })
        .then(data => {
            liked ? 
                db.select('*').from('likes').where({
                    username: 'admin',
                    articletype: articleType,
                    articleid: parseInt(id)
                })
                    .del()
                    .then(data => res.send('deleted'))
                    .catch(e => res.status('400').send('There has been an error'))
                :
                db('likes').insert({
                    username: 'admin',
                    articletype: articleType,
                    articleid: parseInt(id)
                })
                .then(data => res.send('added'))
                    .catch(e => res.status('400').send('There has been an error'))
        }
            
                
        )
    

    
})

// Add Comment
router.post('/addComment/:articleType/:id/:text', isAuth, (req, res)=>{
    const {id, articleType, text} = req.params

    db('comments').insert({
        text: text,
        username: 'admin',
        articletype: articleType,
        articleid: parseInt(id)
    })
        .then(data => res.send())
        .catch(e => res.status('400').send('There has been an error'))
})

module.exports = router;