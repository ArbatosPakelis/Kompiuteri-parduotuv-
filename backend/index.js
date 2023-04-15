const express = require('express')
const app = express()
const mysql = require('mysql')


const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : null,
    database        : 'duombaze'
})

// Get all userinfo
app.get('/getAll', (req, res) => {
    // data from database
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from userinfo', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from beer table are: \n', rows)
        })
    })
})

// some random "get" http request
app.get("/api", (req, res) => {
    // hardcoded json data
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(5000, () => {console.log("Server started on port 5000")})