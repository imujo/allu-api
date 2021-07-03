const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const knex = require('knex')
const { text } = require('express')

require('dotenv').config()

const db = knex({
    client: 'pg',
    connection: {
      host : process.env.DATABASE_HOST,
      user : process.env.DATABASE_USERNAME,
      password : process.env.DATABASE_PASSWORD,
      database : process.env.DATABASE_NAME
    }
  });


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


/**

 *--------------------- GET ROUTES ---------------------*

 **/

// Get Languages
app.get('/api/languages',(req, res)=>{
    let languagesList = []
    db.select('*').from('languages')
        .then(languages => languages.map((language, i)=>{
            languagesList.push(language['language'])
        }))
        .then(data => res.json(languagesList))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Categories
app.get('/api/categories',(req, res)=>{
    let categoriesList = []
    db.select('*').from('categories')
        .then(categories => categories.map((category, i)=>{
            categoriesList.push(category['category'])
        }))
        .then(data => res.json(categoriesList))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Read Articles
app.get('/api/readArticles',(req, res)=>{
    let articleList = []
    db.select('*').from('readarticles')
        .then(articles => articles.map((article, i)=>{
            articleList.push(article)
        }))
        .then(data => res.json(articleList))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Listen Articles
app.get('/api/listenArticles',(req, res)=>{
    let articleList = []
    db.select('*').from('listenarticles')
        .then(articles => articles.map((article, i)=>{
            articleList.push(article)
        }))
        .then(data => res.json(articleList))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Article (id & type)
app.get('/api/article/:articleType/:id',(req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from(`${articleType}articles`).where({id: id})
        .then(data => {
            data.length !== 0 ? res.json(data) : res.status('404').send('No such article')
        })
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Clicks
app.get('/api/clicks/:articleType/:id',(req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from(`${articleType}articles`).where({id: id})
        .then(data => res.json(data[0]['clicks']))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Likes
app.get('/api/likes/:articleType/:id',(req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from('likes').where({
        articletype: articleType,
        articleid: id
    })
        .then(likes => res.json(likes.length))
        .catch(e => res.status('400').send('There has been an error'))
})

// Get Comments
app.get('/api/comments/:articleType/:id',(req, res)=>{
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
app.post('/api/addClick/:articleType/:id',(req, res)=>{
    const {id, articleType} = req.params

    db.select('*').from(`${articleType}articles`).where({id: id}).increment('clicks', 1)
        .then(data => res.send())
        .catch(e => res.status('400').send('There has been an error'))
})

// Add Like
app.post('/api/addLike/:articleType/:id',(req, res)=>{
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
app.post('/api/addComment/:articleType/:id/:text',(req, res)=>{
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







app.listen(5000, ()=>{
    console.log('App running on port 5000')
})