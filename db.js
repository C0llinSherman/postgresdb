

const Pool = require('pg').Pool;
const { v4: uuidv4 } = require('uuid');
const herokudb = process.env.HEROKU_DB || false;

let dbURL = {
    connectionString: process.env.DATABASE_URL
}

if (herokudb) {
    dbURL.ssl = {
        sslmode: 'require',
        rejectUnauthorized: false
    };
}

const pool = new Pool(dbURL);

pool.connect();

const getHome = (req, res) => {
    console.log(uuidv4()); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

    res.render("index")
}
const getCreateUser = (req, res) => {
    res.render("create")
}
const postCreateUser = (req, res) => {
    let id = uuidv4();
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let age = req.body.age
    let email = req.body.email
    let created = new Date()
    pool.query('insert into users (id, first_name, last_name, age, email, created) values ($1, $2, $3, $4, $5, $6)', [id, first_name, last_name, age, email, created], (err, results) => {
        if (err) throw err;
        res.redirect('/userListing');
    })
}
const getUsers = (req, res) => {
    pool.query('select * from users', (err, results) => {
        if (err) throw err;
        res.render('listings', { userArray: results.rows })
    })
}
const getUsersByFirst = (req, res) => {
    let order = req.params.order
    pool.query(`select * from users order by first_name ${order}`, (err, results) => {
        if (err) throw err;
        res.render('listings', { userArray: results.rows })
    })
}
const getUsersByLast = (req, res) => {
    let order = req.params.order
    pool.query(`select * from users order by last_name ${order}`, (err, results) => {
        if (err) throw err;
        res.render('listings', { userArray: results.rows })
    })
}
const getUsersByAge = (req, res) => {
    let order = req.params.order
    pool.query(`select * from users order by age ${order}`, (err, results) => {
        if (err) throw err;
        res.render('listings', { userArray: results.rows })
    })
}
const getUserEdit = (req, res) => {
    let id = req.params.id
    pool.query(`select * from users where id = '${id}'`, (err, results) => {
        console.log(results.rows)
        if (err) throw err;
        res.render('edit', { currentUser: results.rows })
    })
}
const postUserEdit = (req, res) => {
    const id = req.params.id
    const updatedUser = req.body
    pool.query(`UPDATE users SET first_name = '${updatedUser.first_name}', last_name = '${updatedUser.last_name}', email = '${updatedUser.email}', age = '${updatedUser.age}' WHERE id = '${id}'`, (err, results) => {
        if (err) throw err;
        // res.render('listings', { userArray: results.rows })
    })
    res.redirect('/userListing')
}
const deleteUser = (req, res) => {
    let id = req.params.id
    pool.query(`DELETE FROM users WHERE id = '${id}';`, (err, results) => {
        if (err) throw err;
    })
    res.redirect('/userListing')

}
const getSearch = (req, res) => {
    res.render('search')
}
const getUserSearch = (req, res) => {
    let searchQuery = req.body.search
    res.redirect(`/userSearch/${searchQuery}`)
}
const getUserSearchQuery = (req, res) => {
    let query = req.params.query
    pool.query(`select * from users where first_name = '${query}' or last_name = '${query}'`, (err, results) => {
        if (err) throw err;
        res.render('listings', { userArray: results.rows })
    })
}

const dbTest = (req, res) => {
    pool.query('SELECT * from users', (err, results) => {
        if (err) throw err;
        for (let row of results.rows) {
            console.log(JSON.stringify(row));
        }
        res.status(200).json(results.rows);
    })
}
module.exports = { getHome, getCreateUser, postCreateUser, dbTest, getUsers, getUsersByAge, getUsersByFirst, getUsersByLast, getUserEdit, postUserEdit, deleteUser, getSearch, getUserSearch, getUserSearchQuery };