// SERVER

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
// this is how we are talking to mongodb
const PORT = 2121
require('dotenv').config()
// we are setting up to use our env files. this enables us to use the env files


let db,
    dbConnectionStr = process.env.DB_STRING,
// the reason to use 'require('dotenv').config()' is so we don't put our connection logins and passwords to mongodb on github, espectially if all ip address are whitelisted, anyone would be able to make changes to the database
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
// don't need to mememorize this ^^
// this variable called 'db' is the actual database we're connected to ('client.db(dbName)')

// two things you need to hide your sensetive files in env file
    // would need to do an npm install
    // and to have an env file to use this
    
app.set('view engine', 'ejs')
// we're using ejs as our templating langauge
app.use(express.static('public'))
// we are using our public folder to hold all of our static files like our CSS and JavaScript files
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// then we have our helps us kind of do what body parser used to do
// 'app.use(express.urlencoded({ extended: true }))' and 'app.use(express.json())' we're able to look at the requests that are coming through and pull the data out of those requests
    // that's how we're able to get the text out of the request so that we can update the database


// we listening for a get request, and here is out route, why is it a forward slash? Telling us the root, the root page (this is the main/home/root page) represented with '/'
app.get('/',async (request, response)=>{
// ===== The faster more effcient way to do it =====

//     const todoItems = await db.collection('todos').find().toArray()
//     const itemsLeft = await db.collection('todos').countDocuments({completed: false})
//     response.render('index.ejs', { items: todoItems, left: itemsLeft })
    db.collection('todos').find().toArray()
    // db: means we are going the database, db is holding that connection to the database
    // .collection('todos'): finds the collection 'todos'
    // What does inside of our collections? inside of our collections are documents
    // .find(): we're going to find all the documents inside our 'todos' collection (in this case, mongoDB)
    // What's something that we can hold all three documents? what are the documents? Objects
    // .toArray(): we're going to put them into something that can hold objects. We're saying go the the database, find the documents (let's say we found three), we can't juggle them, so we put them into an array

//     db.collection('todos').find().toArray(): does this return a promise? Yes because we have the .then chain
// data: Whenever I see data it's the array holding the objects
    .then(data => {
        db.collection('todos').countDocuments({completed: false})
        .then(itemsLeft => {
            response.render('index.ejs', { items: data, left: itemsLeft })
// response.render('index.ejs', { items: data, left: itemsLeft }): I got the database and my objects are sitting in an array, what am I going to do with them? I will pass those objects into my template (my ejs)
    // the line is saying, I am passing data to 'index.ejs'
        // The array of objects I'm passing into my template, I've given them a name, what is that name? 'items'
        // So in my ejs, i'm not going to see the word 'data' anymore, i'm going to see the word 'items' and whenever I see 'items' that's my array of documents
        // we passed the documents inside of our array into our ejs under the name of 'items'
        // helps for readablity, that why we reminaed it
            // so once the EJS runs, in our example/case, it's going to run 3 times (because we have three times)
            // What is being rendered in 'response.render('index.ejs', { items: data, left: itemsLeft })'? an HTML file, so think of it like 'response. HTML FILE'
            // what do you do with the HTML file? you respond
// when the EJS is deleted, it will send back the documents that remain (if one is deleted)
        })
    })
    .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    // '/addTodo', where did that route come from? comes from the action on form that made the post request, in the index.ejs file. 
    // We can have plenty of different forms that could be making requests, and differentiate the different forms based on the different actions that each form had. Then, our api set up to hear a post on a particular form action
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // We added the document to our 'todos' collection
    // '.insertOne' we can put something into the database right away (simple step)
    // '({thing: request.body.todoItem, completed: false})' why does it look like we're inserting an object? because we are. Documents (are in databases) are objects
        // we are inserting that document in the 'todos section'
            // We can tell right off the jump what properties that documents is going to have because we set them up here right now (e.g. every single document that goes into the collection will have a thing property and completed property, but I can name these whatever I want, like ({rainbowUnicornAttack: request.body.todoItem, zab: false})')
            // 'request.body.todoItem' we are grabing the value coming out of the into ('todoItem')
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
        // what's 'response.redirect('/')' doing? responding to the client
        // 'response.redirect('/')' what is my response to the client? to refresh
        // When I refresh, I trigger a what? A get request
    })

    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
// From out main.js, we can see we made a fetch to mark complete
// We can see 'app.put' with a route of '/markComplete'
// when the server (gremlins) hears that put request, it's going to do some stuff (and it looks like going to the database and doing stuff)
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // 'db.collection' we are going to connect to our database
        // '('todos')' we're going to find the to do's colleciton 
        // 'updateOne' we're going to update one thing
        // '{thing: request.body.itemFromJS}' we're going to update the first document that has a thing property of what?
            // 'Get Pizza' 
            // we're going to update a thing property that has 'Get Pizza'
            // 'request.body.itemFromJS' is literally 'Get Pizza'
                // we are looking in the document for 'thing: 'Let Pizza'
        $set: {
            completed: true
          }
// When we find the 'a thing property that has 'Get Pizza', we're going to set the completed property to true
    // it was false but now we found it and set completed to true
    // if we look at our database and refresh, we will see 'Get Pizza' has a completed property of true
    },{
        sort: {_id: -1},
        upsert: false
// what happens when you set 'upsert: false' to true? 
        // if you tried to update if something was not there, it would just create the document for you
            // this can save you a headache, especially if your templating langauge is a little stiff by always requiring something to be there
        //in other words, it would create the document for you that had the 'thing'
        // You don't need to know how to use it for now
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    // The user hasn't seen changes until we respond on our client side
        // we need to respond with some JSON 'response.json('Marked Complete')'
            // this response gets sent back to our client side (our main.js is set up to handle that, so we go to main.js)
    // now that the 'Get Pizza' has a completed property of true, all we do is respond saying what? 
        // 'response.json('Marked Complete')' 
        // Where is this response going to be sent though?
        // It's going to be sent to the client that made the request
        // client-side javascript
        // what does our client-side javascript do?
            // it refreshes the page
        // and when it refreshes the page, it triggers a what?
        // it triggers a get
            // the get goes to the database
        // however this time the 'Get Pizza' document is different so when it does to build the html it now has to have that completed propert which is going to make the 'Get Pizza' look different (crossed out in our case)
    })
    .catch(error => console.error(error))
})

// The client side javascript is hearing the clicks
// then you have to understand that that makes a request to the server
// then you have to understand the server hears that reqquest updates something in the database, then responds back to the client
// at this point nothing for the user until what happens?
    // until it refreshes
        // when it refreshes, the browswer has permission to go back to the server, ask for all the updated documents and now the ducment has changed our EJS and what we show the user can change, and that's when we see the results in the dom


app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
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

// '/deleteItem' is the route that matches the route from our fetch, which is good

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
// 'db.collection('todos')': we're going into our database called 'todos'
// 'deleteOne': we're going to delete one
// '{thing: request.body.itemFromJS}': we're going to delete the thing that has the request body items from js which is in this case 'Get Pizza'
    // we're going to find the thing of 'Get Pizza' from the database
    // and delete it ('deleteOne') when we find it 

    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    // after deleting it, we responded back to our client-side (main.js) that the item was delete (e.g. 'Get Pizza')
    // MAIN.JS:
        // const data = await response.json()
        // console.log(data)
        // location.reload()
            // our code knew what to do, console log what we delete, and we refreshed
                //when we refreshed, we made a get request to the server, our server was set up to hear that get request
                //when it heard that get request, it went into the database to our 'todos' database
                // it found all the documents, but this time there was one less (e.g. there used to be three, now there's two)
                // the array had the two the doucments, and now it's missing the document that as deleted 
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

// this is for if we are using our port or eventually if we put stuff on heroku, you're going to use environment variables