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
app.get('/getAllParts', (req, res) => {
    // data from database
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from detale', (err, rows) => {
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


// get specific part general info
app.get('/getPart/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        var temporary
        connection.query('SELECT * FROM detale WHERE id_Detale = ?', [req.params.id], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (Object.keys(rows).length === 0){
                return res.status(404).send('NotFound')
            }
            temporary = rows;
            res.send(rows);
        });
    })
});

// get specific part specialized info
// pavyzdys kaip kviesti:      /getPartSpec?tipas=Procesorius&id=3
app.get('/getPartSpec', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        let tipas = req.query.tipas;
        let id = req.query.id;

        const sql = 'SELECT * FROM ' + tipas.toLowerCase() + ' WHERE id_' + tipas + ' = ' + id;
        connection.query(sql, (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (Object.keys(rows).length === 0){
                return res.status(404).send('NotFound')
            }
            temporary = rows;
            res.send(rows);
        });
    })
});

// Delete a part
app.delete('/removePart/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        const sql = 'DELETE FROM detale WHERE id_Detale = ' + req.params.id;
        connection.query(sql, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`part info with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from detale table is: \n', rows)
            res.send(err)
        })
    })
});


// Delete a part specialized info
app.delete('/removeSpecPart', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        let tipas = req.query.tipas;
        let id = req.query.id;
        const sql = 'DELETE FROM ' + tipas.toLowerCase() +' WHERE id_' + tipas + ' = ' + id;
        connection.query(sql, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`part specialized info with the record ID ${[id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from detale table is: \n', rows)
            res.send(err)
        })
    })
});

app.listen(5000, () => {console.log("Server started on port 5000")})