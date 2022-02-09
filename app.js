const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const db = require('./db')

const path = require('path')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')


app.get('/', db.getHome )
app.get('/createUser', db.getCreateUser)
app.post('/createUser', db.postCreateUser)
app.get('/userListing', db.getUsers)
app.get('/userListing/firstName/:order', db.getUsersByFirst)
app.get('/userListing/lastName/:order', db.getUsersByLast)
app.get('/userListing/age/:order', db.getUsersByAge)
app.get('/editUser/:id', db.getUserEdit)
app.post('/editUser/:id', db.postUserEdit)
app.post('/deleteUser/:id', db.deleteUser)
app.get('/search', db.getSearch)
app.post('/userSearch', db.getUserSearch)
app.get('/userSearch/:query', db.getUserSearchQuery)

app.get('/dbTest', db.dbTest)

app.listen(port, ()=>{
    console.log(`server is up on port ${port}`);
})