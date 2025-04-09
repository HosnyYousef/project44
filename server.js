// SERVER

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'movietracker'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',async (request, response)=>{

    db.collection('movies').find().toArray()
    .then(data => {
        db.collection('movies').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
        })
    })
    .catch(error => console.error(error))
})

app.post('/addfilm', (request, response) => {
    db.collection('movies').insertOne({thing: request.body.filmTitle, progress: request.body.filmProgress, completed: false})
    .then(result => {
        console.log('film Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('movies').updateOne({thing: request.body.itemFromJS, progress: request.body.filmProgress},{
        $set: {
            completed: true
          }

    },{
        sort: {_id: -1},
        upsert: false

    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')

    })
    .catch(error => console.error(error))
})


app.put('/markUnComplete', (request, response) => {
    db.collection('movies').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('movies').deleteOne({thing: request.body.itemFromJS})

    .then(result => {
        console.log('film Deleted')
        response.json('film Deleted')

    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

