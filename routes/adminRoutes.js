const router = require('express').Router();
const { isAdmin} = require('./authMiddleware')
const db = require('../config/database')
const fs = require('fs')
const genPassword = require('../lib/passwordUtils').genPassword;
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
    console.log(range)


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
        .catch(() => res.status(400).json('There has been an error'))


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
        .then(() => {res.json('Success'); console.log('Article added')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not added')})
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
        .then(() => {res.json('Success'); console.log('Article edited')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/readArticles/:id', (req, res)=>{
    const id = req.params.id

    db('readarticles').where({id: id})
        .del()
        .then(() => {res.json('Success'); console.log('Article deleted')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not deleted')})
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
        .catch(() => res.status(400).json('There has been an error'))

})

// Create
router.post('/listenArticles', (req, res)=>{
    const { title, oneliner, category, language, created_by, text, dateadded, audiofile  } = req.body


    

    db('listenarticles').insert({
        title: title,
        oneliner: oneliner,
        category: category,
        language: language,
        created_by: created_by,
        text: text,
        dateadded: dateadded,
        audiofile: audiofile
    })
        .then(() =>res.json('Success'))
        .catch(() => {res.status(400).json('Fail'); console.log('Article not added')})
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
            .then(() => {res.json('Success'); console.log('Article edited')})
            .catch(() => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/listenArticles/:id', (req, res)=>{
    const id = req.params.id

    db('listenarticles').where({id: id})
        .del()
        .then(() => {res.json('Success'); console.log('Article deleted')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not deleted')})
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
        .catch(() => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Create
router.post('/categories', (req, res)=>{
    const { category, imagefile, iconfile } = req.body


    

    db('categories').insert({
        category: category,
        imagefile: imagefile,
        iconfile: iconfile
    })
        .then(() =>{console.log('Category added'); res.json('Success')})
        .catch(() => {res.status(400).json('Fail'); console.log('Category not added')})
})

// Update
router.put('/categories/:id', (req, res)=>{
    const { category, imagefile, iconfile  } = req.body
    const id = req.params.id

    var cat;


    db('categories').where({id: id}).select('category')
        .then(ret =>{
            cat = ret[0].category
            return db('categories').where({id: id}).update({
                category: category,
                imagefile: imagefile,
                iconfile: iconfile
            })
        })
        .then(() => {
            console.log(cat)
            return db('listenarticles').where({category: cat}).update({category: category})
        })
        .then((d)=>{
            console.log(d)
            return db('readarticles').where({category: cat}).update({category: category})
            
        })
        .then(()=> {res.json('Success'); console.log('Article edited')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/categories/:id', (req, res)=>{
    const id = req.params.id

    db('categories').where({id: id})
        .del()
        .then(() => {res.json('Success'); console.log('Article deleted')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not deleted')})
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
        .catch(() => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Create
router.post('/languages', (req, res)=>{
    const { language, imageurl, flagfile, order_number } = req.body


    

    db('languages').insert({
        language: language,
        imageurl: imageurl,
        flagfile: flagfile,
        order_number: order_number
    })
        .then(() =>{console.log('Category added'); res.json('Success')})
        .catch(() => {res.status(400).json('Fail'); console.log('Category not added')})
})

// Update
router.put('/languages/:id', (req, res)=>{
    const { language, imageurl, flagfile, order_number } = req.body
    const id = req.params.id

    db('languages').where({id: id})
        .update({
            language: language,
            imageurl: imageurl,
            flagfile: flagfile,
            order_number: order_number
        })
            .then(() => {res.json('Success'); console.log('Article edited')})
            .catch(() => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/languages/:id', (req, res)=>{
    const id = req.params.id

    db('languages').where({id: id})
        .del()
        .then(() => {res.json('Success'); console.log('Article deleted')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not deleted')})
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
        .catch(() => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Delete
router.delete('/comments/:id', (req, res)=>{
    const id = req.params.id

    db('comments').where({id: id})
        .del()
        .then(() => {res.json('Success'); console.log('Article deleted')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not deleted')})
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
        .catch(() => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Create
router.post('/users', (req, res) => {
    const {email, username, password, admin} = req.body

    const {salt, hash} = genPassword(password)
    
    

    const registerUser = () => {
        db('users').insert({
            email: email,
            username: username,
            hash: hash,
            salt: salt,
            admin: admin,
            joined: new Date()
        })
            .then(() => {
                db.select('*').from('users').where({email: email})
                    .then(data => res.json({status: 200, msg: 'User successfuly registered.', user: data[0], isauth: true }))
            })
            .catch(() => res.status(400).json({status: 400, msg: "Couldn't register user.", user: {}, isauth: false}))
    }

    db.select('*').from('users').where({email: email}).orWhere({username: username})
        .then(users => {
            if (users.length > 0){
                res.status(400).json({status: 400, msg: 'User already exists. Please enter a different email and/or username.', user: {}, isauth: false})
            }else{
                registerUser()
            }
        })

    

});

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
            .then(() => {res.json('Success'); console.log('Article edited')})
            .catch(() => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/users/:id', (req, res)=>{
    const id = req.params.id

    db('users').where({id: id})
        .del()
        .then(() => {res.json('Success'); console.log('Article deleted')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not deleted')})
})









/**

 *--------------------- UPLOAD ---------------------*

 **/



// Audio File
router.post('/listenArticle/upload', (req, res)=>{
    if (req.files === null){
        console.log('No file uploaded')
        return res.sendStatus(400).json({status: false})
    }
    console.log(req.files)
    const file = req.files.file

    file.mv(`${process.env.PATH_TO_PU}/audio/${file.name}`, e =>{
        if (e){
            console.log(e)
            return res.status(500).send({status: false})
        }

        res.json({ status: true})
    })
})

// Category Icon
router.post('/categories/icons/upload', (req, res)=>{
    if (req.files === null){
        console.log('No file uploaded')
        return res.sendStatus(400).json({status: false})
    }
    console.log(req.files)
    const file = req.files.file

    file.mv(`${process.env.PATH_TO_PU}/categoryIcons/${file.name}`, e =>{
        if (e){
            console.log(e)
            return res.sendStatus(400).json({status: false})
        }

        res.json({ status: true})
    })
})

// Category Image
router.post('/categories/images/upload', (req, res)=>{
    if (req.files === null){
        console.log('No file uploaded')
        return res.sendStatus(400).json({status: false})
    }
    console.log(req.files)
    const file = req.files.file

    file.mv(`${process.env.PATH_TO_PU}/categoryImages/${file.name}`, e =>{
        if (e){
            console.log(e)
            return res.sendStatus(400).json({status: false})
        }

        res.json({ status: true})
    })
})

// Flag
router.post('/languages/upload', (req, res)=>{
    if (req.files === null){
        console.log('No file uploaded')
        return res.sendStatus(400).json({status: false})
    }
    console.log(req.files)
    const file = req.files.file

    file.mv(`${process.env.PATH_TO_PU}/flags/${file.name}`, e =>{
        if (e){
            console.log(e)
            return res.sendStatus(400).json({status: false})
        }

        res.json({ status: true})
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




/**

 *--------------------- MISC ---------------------*

 **/


 // GET MISC ITEMS
router.get('/misc', (req, res)=>{
    const {sort, range, filter} = req.query


    let sortQuery = JSON.parse(sort)
    let rangeQuery = JSON.parse(range)
    let filterQuery = JSON.parse(filter)

    console.log(rangeQuery)



    db.select('*').from('misc')
        .where(filterQuery)
        .orderBy(sortQuery[0], sortQuery[1])
        .then(data => data.slice(rangeQuery[0], rangeQuery[1]))
        .then(data => {
            db.select('*').from('misc')
                .where(filterQuery)
                .then(allData => {
                    res.set('Content-Range', `posts ${rangeQuery[0]}-${rangeQuery[1]}/${allData.length}`)
                    res.json(data)
            })
        })

})

// getOne
router.get('/misc/:id', (req, res)=>{
    const id = req.params.id

    db.select('*').from('misc')
        .where({id: id})
        .then(data => {
            res.json(data[0])
        })
        .catch(() => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// UPDATE
router.put('/misc/:id', (req, res)=>{
    const { value  } = req.body
    const id = req.params.id
    console.log(value)

    db('misc').where({id: id})
        .update({
            value: value,
        })
            .then(() => {res.json('Success'); console.log('About text edited')})
            .catch(() => {res.status(400).json('Fail'); console.log('About text not edited')})
})









/**

 *--------------------- LISTEN ARTICLE FILE ---------------------*

 **/



// getList
router.get('/fileListenArticle', (req, res)=>{
    const {sort, range, filter} = req.query


    let sortQuery = JSON.parse(sort)
    let rangeQuery = JSON.parse(range)
    let filterQuery = JSON.parse(filter)

    

    let files = fs.readdirSync(`${__dirname}/../public/audio`)
    let rangeFiles = files.slice(rangeQuery[0], rangeQuery[1])


    let returnFiles = []

    rangeFiles.forEach(file=>{
        const size = (fs.statSync(`${__dirname}/../public/audio/${file}`).size * 0.000001).toFixed(2)
        console.log(size)
        returnFiles.push({
            name: file,
            size: `${size} MB`
        })
    })
    res.set('Content-Range', `posts ${rangeQuery[0]}-${rangeQuery[1]}/${files.length}`)
    res.json(returnFiles)

})

// getOne
router.get('/users/:id', (req, res)=>{
    const id = req.params.id

    db.select('*').from('users')
        .where({id: id})
        .then(data => {
            res.json(data[0])
        })
        .catch(() => {console.log('Cant get one'); res.status(400).json('Fail')})
})

// Create
router.post('/users', (req, res) => {
    const {email, username, password, admin} = req.body

    const {salt, hash} = genPassword(password)
    
    

    const registerUser = () => {
        db('users').insert({
            email: email,
            username: username,
            hash: hash,
            salt: salt,
            admin: admin,
            joined: new Date()
        })
            .then(() => {
                db.select('*').from('users').where({email: email})
                    .then(data => res.json({status: 200, msg: 'User successfuly registered.', user: data[0], isauth: true }))
            })
            .catch(() => res.status(400).json({status: 400, msg: "Couldn't register user.", user: {}, isauth: false}))
    }

    db.select('*').from('users').where({email: email}).orWhere({username: username})
        .then(users => {
            if (users.length > 0){
                res.status(400).json({status: 400, msg: 'User already exists. Please enter a different email and/or username.', user: {}, isauth: false})
            }else{
                registerUser()
            }
        })

    

});

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
            .then(() => {res.json('Success'); console.log('Article edited')})
            .catch(() => {res.status(400).json('Fail'); console.log('Article not edited')})
})

// Delete
router.delete('/users/:id', (req, res)=>{
    const id = req.params.id

    db('users').where({id: id})
        .del()
        .then(() => {res.json('Success'); console.log('Article deleted')})
        .catch(() => {res.status(400).json('Fail'); console.log('Article not deleted')})
})




module.exports = router;
