const express = require('express')// importing the express module
const app = express() // makes it so we can use app instead of typing out express
const MongoClient = require('mongodb').MongoClient // allows us to connect to MongoDB to access database
const PORT = 2121 // open a port
require('dotenv').config() // allows us to see inside of .env file


let db, // this is the database variable
    dbConnectionStr = process.env.DB_STRING,  // this is the database connection string
    dbName = 'todo' // this is the database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // connects to the database
    .then(client => { // connects the promise
        console.log(`Connected to ${dbName} Database`) // logs that we connected to the database
        db = client.db(dbName) // sets the database to the database we connected to
    })
    
app.set('view engine', 'ejs')  // sets the view engine to ejs
app.use(express.static('public')) // sets the public folder to used
app.use(express.urlencoded({ extended: true })) // sets the body parser to be used
app.use(express.json()) // sets the body parser to be used, this is for the json data


app.get('/',async (request, response)=>{ // 
    const todoItems = await db.collection('todos').find().toArray() // gets al lthe todo items from the database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Returns the count of documents that match the query for a collection or view.
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) // renders the index.ejs file with the todo items and the number of items left
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) // going into the database and inserting a new item, hardcoding the completed property to false
    .then(result => {
        console.log('Todo Added') // console logs what item we added
        response.redirect('/') // refreshes the homepage
    })
    .catch(error => console.error(error)) // catches any errors that may occur
})

app.put('/markComplete', (request, response) => { 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true // going into the database and inserting a new item, hardcoding the completed property to true
          }
    },{
        sort: {_id: -1}, // ascending order
        upsert: false // trying to match the items from the database
    })
    .then(result => {
        console.log('Marked Complete') // console logs what item we marked complete
        response.json('Marked Complete') // sends a json response
    })
    .catch(error => console.error(error)) // catches any errors that may occur

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1}, // ascending order
        upsert: false  // trying to match the items from the database, if it doesn't match it will insert a new document, basically a post request // not updating
    })
    .then(result => {
        console.log('Marked Complete') // console logs what item we marked complete
        response.json('Marked Complete') // sends a json response
    })
    .catch(error => console.error(error)) // catches any errors that may occur

})

app.delete('/deleteItem', (request, response) => {  // this is the delte request for the delte button
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted') // console logs what item we deleted
        response.json('Todo Deleted') // sends a json response
    })
    .catch(error => console.error(error)) // catches any errors that may occur

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`) // console logs what port it is running on
})