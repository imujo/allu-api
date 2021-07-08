const router = require('express').Router();
const {isAuth, isAdmin} = require('./authMiddleware')
const db = require('../config/database')
const passport = require('passport');
const fs = require('fs')
var fileupload = require("express-fileupload");

router.use(fileupload());

router.use(isAdmin)

/**

 *--------------------- READ ARTICLES ---------------------*

 **/

// getList
router.get('/readArticles', (req, res)=>{
    const {sort, range, filter} = req.query


    let sortQuery = JSON.parse(sort)
    let rangeQuery = JSON.parse(range)
    let filterQuery = JSON.parse(filter)


    db.select('*').from('readarticles')
        .where(filterQuery)
        .orderBy(sortQuery[0], sortQuery[1])
        .then(data => data.slice(rangeQuery[0], rangeQuery[1]))
        .then(data => {
            db.select('*').from('readarticles')
            .where(filterQuery)
            .then(allData => {
                res.set('Content-Range', `posts ${rangeQuery[0]}-${rangeQuery[1]}/${allData.length}`)
                res.json(data)
        })
        })

})

// getOne
router.get('/readArticles/:id', (req, res)=>{
    const id = req.params.id

    db.select('*').from('readarticles')
        .where({id: id})
        .then(data => {
            res.json(data[0])
        })

})

// Create
router.post('/readArticles',  (req, res)=>{
    const { title, oneliner, category, language, created_by, text, dateadded } = req.body

    db('readarticles').insert({
        title: title,
        oneliner: oneliner,
        category: category,
        language: language,
        created_by: created_by,
        text: text,
        dateadded: dateadded
    })
        .then(data => {res.json('Success'); console.log('Article added')})
        .catch(e => {res.status(400).json('Fail'); console.log('Article not added')})
})

// Update
router.put('/readArticles/:id', (req, res)=>{
    const { title, oneliner, category, language, created_by, text, dateadded   } = req.body
    const id = req.params.id

    db('readarticles').where({id: id})
        .update({
            title: title,
            oneliner: oneliner,
            category: category,
            language: language,
            created_by: created_by,
            text: text,
            dateadded: dateadded
        })
        .then(data => {res.json('Success'); console.log('Article edited')})
        .catch(e => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/readArticles/:id', (req, res)=>{
    const id = req.params.id

    db('readarticles').where({id: id})
        .del()
        .then(data => {res.json('Success'); console.log('Article deleted')})
        .catch(e => {res.status(400).json('Fail'); console.log('Article not deleted')})
})







/**

 *--------------------- LISTEN ARTICLES ---------------------*

 **/

// getList
router.get('/listenArticles', (req, res)=>{
    const {sort, range, filter} = req.query


    let sortQuery = JSON.parse(sort)
    let rangeQuery = JSON.parse(range)
    let filterQuery = JSON.parse(filter)


    db.select('*').from('listenarticles')
        .where(filterQuery)
        .orderBy(sortQuery[0], sortQuery[1])
        .then(data => data.slice(rangeQuery[0], rangeQuery[1]))
        .then(data => {
            db.select('*').from('listenarticles')
            .where(filterQuery)
            .then(allData => {
                res.set('Content-Range', `posts ${rangeQuery[0]}-${rangeQuery[1]}/${allData.length}`)
                res.json(data)
        })
        })

})

// getOne
router.get('/listenArticles/:id', (req, res)=>{
    const id = req.params.id

    db.select('*').from('listenarticles')
        .where({id: id})
        .then(data => {
            res.json(data[0])
        })

})

// Create
router.post('/listenArticles', (req, res)=>{
    const { title, oneliner, category, language, created_by, text, dateadded  } = req.body


    

    db('listenarticles').insert({
        title: title,
        oneliner: oneliner,
        category: category,
        language: language,
        created_by: created_by,
        text: text,
        dateadded: dateadded
    })
        .then(d =>res.json('Success'))
        .catch(e => {res.status(400).json('Fail'); console.log('Article not added')})
})


// Update
router.put('/listenArticles/:id', (req, res)=>{
    const { title, oneliner, category, language, created_by, text, dateadded, audiofile  } = req.body
    const id = req.params.id

    db('listenarticles').where({id: id})
        .update({
            title: title,
            oneliner: oneliner,
            category: category,
            language: language,
            created_by: created_by,
            text: text,
            dateadded: dateadded,
            audiofile: audiofile
        })
            .then(data => {res.json('Success'); console.log('Article edited')})
            .catch(e => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/listenArticles/:id', (req, res)=>{
    const id = req.params.id

    db('listenarticles').where({id: id})
        .del()
        .then(data => {res.json('Success'); console.log('Article deleted')})
        .catch(e => {res.status(400).json('Fail'); console.log('Article not deleted')})
})




/**

 *--------------------- CATEGORIES ---------------------*

 **/

// getList
router.get('/categories', (req, res)=>{
    const {sort, range, filter} = req.query


    let sortQuery = JSON.parse(sort)
    let rangeQuery = JSON.parse(range)
    let filterQuery = JSON.parse(filter)


    db.select('*').from('categories')
        .where(filterQuery)
        .orderBy(sortQuery[0], sortQuery[1])
        .then(data => data.slice(rangeQuery[0], rangeQuery[1]))
        .then(data => {
            db.select('*').from('categories')
            .where(filterQuery)
            .then(allData => {
                res.set('Content-Range', `posts ${rangeQuery[0]}-${rangeQuery[1]}/${allData.length}`)
                res.json(data)
        })
        })

})

// getOne
router.get('/categories/:id', (req, res)=>{
    const id = req.params.id

    db.select('*').from('categories')
        .where({id: id})
        .then(data => {
            res.json(data[0])
        })
        .catch(e => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Create
router.post('/categories', (req, res)=>{
    const { category, imagefile, iconfile } = req.body


    

    db('categories').insert({
        category: category,
        imagefile: imagefile,
        iconfile: iconfile
    })
        .then(d =>{console.log('Category added'); res.json('Success')})
        .catch(e => {res.status(400).json('Fail'); console.log('Category not added')})
})

// Update
router.put('/categories/:id', (req, res)=>{
    const { category, imagefile, iconfile  } = req.body
    const id = req.params.id

    db('categories').where({id: id})
        .update({
            category: category,
            imagefile: imagefile,
            iconfile: iconfile
        })
            .then(data => {res.json('Success'); console.log('Article edited')})
            .catch(e => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/categories/:id', (req, res)=>{
    const id = req.params.id

    db('categories').where({id: id})
        .del()
        .then(data => {res.json('Success'); console.log('Article deleted')})
        .catch(e => {res.status(400).json('Fail'); console.log('Article not deleted')})
})






/**

 *--------------------- LANGUAGES ---------------------*

 **/

// getList
router.get('/languages', (req, res)=>{
    const {sort, range, filter} = req.query


    let sortQuery = JSON.parse(sort)
    let rangeQuery = JSON.parse(range)
    let filterQuery = JSON.parse(filter)


    db.select('*').from('languages')
        .where(filterQuery)
        .orderBy(sortQuery[0], sortQuery[1])
        .then(data => data.slice(rangeQuery[0], rangeQuery[1]))
        .then(data => {
            db.select('*').from('languages')
            .where(filterQuery)
            .then(allData => {
                res.set('Content-Range', `posts ${rangeQuery[0]}-${rangeQuery[1]}/${allData.length}`)
                res.json(data)
        })
        })

})

// getOne
router.get('/languages/:id', (req, res)=>{
    const id = req.params.id

    db.select('*').from('languages')
        .where({id: id})
        .then(data => {
            res.json(data[0])
        })
        .catch(e => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Create
router.post('/languages', (req, res)=>{
    const { language, imageurl, flagfile } = req.body


    

    db('languages').insert({
        language: language,
        imageurl: imageurl,
        flagfile: flagfile
    })
        .then(d =>{console.log('Category added'); res.json('Success')})
        .catch(e => {res.status(400).json('Fail'); console.log('Category not added')})
})

// Update
router.put('/languages/:id', (req, res)=>{
    const { language, imageurl, flagfile } = req.body
    const id = req.params.id

    db('languages').where({id: id})
        .update({
            language: language,
            imageurl: imageurl,
            flagfile: flagfile
        })
            .then(data => {res.json('Success'); console.log('Article edited')})
            .catch(e => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/languages/:id', (req, res)=>{
    const id = req.params.id

    db('languages').where({id: id})
        .del()
        .then(data => {res.json('Success'); console.log('Article deleted')})
        .catch(e => {res.status(400).json('Fail'); console.log('Article not deleted')})
})










/**

 *--------------------- COMMENTS ---------------------*

 **/

// getList
router.get('/comments', (req, res)=>{
    const {sort, range, filter} = req.query


    let sortQuery = JSON.parse(sort)
    let rangeQuery = JSON.parse(range)
    let filterQuery = JSON.parse(filter)


    db.select('*').from('comments')
        .where(filterQuery)
        .orderBy(sortQuery[0], sortQuery[1])
        .then(data => data.slice(rangeQuery[0], rangeQuery[1]))
        .then(data => {
            db.select('*').from('comments')
            .where(filterQuery)
            .then(allData => {
                res.set('Content-Range', `posts ${rangeQuery[0]}-${rangeQuery[1]}/${allData.length}`)
                res.json(data)
        })
        })

})

// getOne
router.get('/comments/:id', (req, res)=>{
    const id = req.params.id

    db.select('*').from('comments')
        .where({id: id})
        .then(data => {
            res.json(data[0])
        })
        .catch(e => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Delete
router.delete('/comments/:id', (req, res)=>{
    const id = req.params.id

    db('comments').where({id: id})
        .del()
        .then(data => {res.json('Success'); console.log('Article deleted')})
        .catch(e => {res.status(400).json('Fail'); console.log('Article not deleted')})
})







/**

 *--------------------- USERS ---------------------*

 **/

// getList
router.get('/users', (req, res)=>{
    const {sort, range, filter} = req.query


    let sortQuery = JSON.parse(sort)
    let rangeQuery = JSON.parse(range)
    let filterQuery = JSON.parse(filter)

    console.log(rangeQuery)



    db.select('*').from('users')
        .where(filterQuery)
        .orderBy(sortQuery[0], sortQuery[1])
        .then(data => data.slice(rangeQuery[0], rangeQuery[1]))
        .then(data => {
            db.select('*').from('users')
                .where(filterQuery)
                .then(allData => {
                    res.set('Content-Range', `posts ${rangeQuery[0]}-${rangeQuery[1]}/${allData.length}`)
                    res.json(data)
            })
        })

})

// getOne
router.get('/users/:id', (req, res)=>{
    const id = req.params.id

    db.select('*').from('users')
        .where({id: id})
        .then(data => {
            res.json(data[0])
        })
        .catch(e => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Create
router.post('/users', passport.authenticate('local'), (req, res)=>{
    if (req.user){
        res.json({status: 200, msg: 'Successfuly logged in!', user: req.user[0], isauth: true})
    }else{
        res.status(400).json({status: 400, msg: 'Invalid password and/or email', user: {}, isauth: false})
    }
}
);

// Update
router.put('/users/:id', (req, res)=>{
    const { email, username, admin  } = req.body
    const id = req.params.id

    db('users').where({id: id})
        .update({
            email: email,
            username: username,
            admin: admin
        })
            .then(data => {res.json('Success'); console.log('Article edited')})
            .catch(e => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/users/:id', (req, res)=>{
    const id = req.params.id

    db('users').where({id: id})
        .del()
        .then(data => {res.json('Success'); console.log('Article deleted')})
        .catch(e => {res.status(400).json('Fail'); console.log('Article not deleted')})
})









/**

 *--------------------- UPLOAD ---------------------*

 **/



// Audio File
router.post('/listenArticle/upload', (req, res)=>{
    if (req.files === null){
        console.log('No file uploaded')
        return res.sendStatus(400).json({msg: 'No file uploaded'})
    }
    console.log(req.files)
    const file = req.files.file

    file.mv(`../api/public/audio/${file.name}`, e =>{
        if (e){
            console.log(e)
            return res.status(500).send({msg: "Couldn't move the file"})
        }

        res.json({ fileName: file.name, filePath: `/public/audio/${file.name}`})
    })
})

// Category Icon
router.post('/categories/icons/upload', (req, res)=>{
    if (req.files === null){
        console.log('No file uploaded')
        return res.sendStatus(400).json({msg: 'No file uploaded'})
    }
    console.log(req.files)
    const file = req.files.file

    file.mv(`../api/public/categoryIcons/${file.name}`, e =>{
        if (e){
            console.log(e)
            return res.status(500).send({msg: "Couldn't move the file"})
        }

        res.json({ fileName: file.name, filePath: `/public/audio/${file.name}`})
    })
})

// Category Image
router.post('/categories/images/upload', (req, res)=>{
    if (req.files === null){
        console.log('No file uploaded')
        return res.sendStatus(400).json({msg: 'No file uploaded'})
    }
    console.log(req.files)
    const file = req.files.file

    file.mv(`../api/public/categoryImages/${file.name}`, e =>{
        if (e){
            console.log(e)
            return res.status(500).send({msg: "Couldn't move the file"})
        }

        res.json({ fileName: file.name, filePath: `/public/audio/${file.name}`})
    })
})

// Flag
router.post('/languages/upload', (req, res)=>{
    if (req.files === null){
        console.log('No file uploaded')
        return res.sendStatus(400).json({msg: 'No file uploaded'})
    }
    console.log(req.files)
    const file = req.files.file

    file.mv(`../api/public/flags/${file.name}`, e =>{
        if (e){
            console.log(e)
            return res.status(500).send({msg: "Couldn't move the file"})
        }

        res.json({ fileName: file.name, filePath: `/public/audio/${file.name}`})
    })
})

router.get('/listDir/:folderName', (req, res)=>{
    const folderName = req.params.folderName

    fs.readdir(`${__dirname}/../public/${folderName}`, (err, files) =>{
        if (err){
            console.log(`Couldnt find the directory: ${__dirname}/../public/${folderName}`)
            return res.status(400).json({msg: 'No direcotry found'})
        }

        console.log(files)
        res.json(files)
    })
})


module.exports = router;
