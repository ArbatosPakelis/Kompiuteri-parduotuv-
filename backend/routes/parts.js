const mysql = require('mysql')

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        :  null,
    database        : 'duombaze'
})

// Get all userinfo
    const getAllParts = (req, res) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * from detale', (err, rows) => {
          connection.release(); // return the connection to pool
  
          if (!err) {
            res.send(rows);
          } else {
            console.log(err);
          }
  
          console.log('The data from beer table are: \n', rows);
        });
      });
    }


    // get specific part general info
    const getPart = (req, res) => {
        pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        connection.query(
            'SELECT * FROM detale WHERE id_Detale = ?', [req.params.id],(error, rows) => {
                connection.release();
                if (error) {
                    return res.status(500).send('Internal Server Error');
                }
                if (Object.keys(rows).length === 0) {
                    return res.status(404).send('NotFound');
                }
                res.send(rows)
            }
        );
        });
    }

    // get specific part specialized info
    // pavyzdys kaip kviesti:      /getPartSpec?tipas=Procesorius&id=3
    const getPartSpec = (req, res) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            let tipas = req.params.tipas;
            let id = req.params.id;
            const sql =
                'SELECT * FROM ' +
                tipas.toLowerCase() +
                ' WHERE id_' +
                tipas +
                ' = ' +
                id;
            connection.query(sql, (error, rows) => {
                connection.release();
                if (error) {
                    return res.status(500).send(error);
                }
                if (Object.keys(rows).length === 0) {
                    return res.status(404).send('NotFound');
                }
                res.send(rows)
            });
        });
    }

    // Delete a part
    const removePart = (req, res) => {
        pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        const sql = 'DELETE FROM detale WHERE id_Detale = ' + req.params.id;
        console.log(sql);
        connection.query(sql, (err, rows) => {
            connection.release(); // return the connection to pool
            if (!err) {
            res.send(
                `part info with the record ID ${[req.params.id]} has been removed.`
            );
            } else if (err.errno == 1451) {
            res.send(
                'part is being used as a foreign key in other tables, delete those entries first'
            );
            } else {
            console.log(err);
            res.send('error');
            }
        });
        });
    }


    // Delete a part specialized info
    const removeSpecPart = (req, res) => {
        pool.getConnection((err, connection) => {
            // if(err) throw err
            let tipas = req.params.tipas;
            let id = req.params.id;
            const sql = 'DELETE FROM ' + tipas.toLowerCase() +' WHERE id_' + tipas + ' = ' + id;
            connection.query(sql, (err, rows) => {
                connection.release() // return the connection to pool
                if (!err) {
                    res.send(`part specialized info with the record ID ${[id]} has been removed.`)
                }
                else if (err.errno == 1451) {
                    res.send('part is being used as a foreign key in other tables, delete those entries first')
                }
                else {
                    console.log(err)
                }
                
                console.log(err)
                res.send("error")
            });
        });
    }

    // insert general part info
    // pavyzdys url
    // addPart?gamintojas=kazka&pavadinimas=kazka&kaina=100&aprasymas=kazka&isleidimo_data=2023-04-02&kiekis=2&spalva=juoda&tipas=Procesorius&id_Detale=3
    const addPart = (req, res) => {
        const params = req.query // get all params
        pool.getConnection((err, connection) => {
            if(err) throw err
            
            const keys = Object.keys(params) // get param names
            let line1 = ""
            for (a in keys){ // merge params names into a single string, but still has a extra comma at the end
                line1 += keys[a] + ","
            }
            let line2 = ""
            for (a in keys){ // merge data into a single string, but still has a extra comma at the end
                var entry = params[keys[a]]
                if (entry.match(/^\d+$/)){ // regex check if text can be a proper number
                    line2 +=  entry + ","
                }
                else{
                    line2 +=  '\''+ entry + "\',"
                }
            }
            const sql = 'INSERT INTO detale(' + line1.substring(0, line1.length - 1) + ') VALUES (' + line2.substring(0, line2.length - 1) + ');'
            console.log(sql)
            connection.query(sql, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`detale has been added.`)
            }
            else if (err.errno == 1062) {
                res.send('douplicate entry, try to think of new id')
            }
            else {
                console.log(err)
                res.send(err)
            }

            });
        });
    }

    // insert general part info
    const addSpecPart = (req, res) => {

        pool.getConnection((err, connection) => {
            if(err) throw err
            
            let params = req.query
            const iranga = params["iranga"] // get the type of part we're making
            let keys = Object.keys(params)
            let line1 = ""
            for (a in keys){ // besides the first value, merge params names into a single string, but still has a extra comma at the end
                if(a != 0){
                    line1 += keys[a] + ","
                }
            }
            let line2 = ""
            for (a in keys){ // besides the first value, merge data into a single string, but still has a extra comma at the end
                if(a != 0){
                    var entry =params[keys[a]]
                    if (entry.match(/^\d+$/)){ // regex check if text can be a proper number
                        line2 +=  entry + ","
                    }
                    else{
                        line2 +=  '\''+ entry + "\',"
                    }
                }
            }
            const sql = 'INSERT INTO ' + iranga +'(' + line1.substring(0, line1.length - 1) + ') VALUES (' + line2.substring(0, line2.length - 1) + ');'
            console.log(sql)
            connection.query(sql, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`detale has been added.`)
            }
            else if (err.errno == 1062) {
                res.send('douplicate entry, try to think of new id')
            }
            else {
                console.log(err)
                res.send(err)
            }

            });
        });
    }

    // Update a general parts info
    const setPart = (req, res) => {

        pool.getConnection((err, connection) => {
            if(err) throw err

            
            const params = req.query // get all params
            const keys = Object.keys(params) // get param names
            let line1 = ""
            let name = ""
            let id = -1
            for (a in keys){ // merge data into a single string, but still has a extra comma at the end
                if(!keys[a].startsWith("id")){
                    var entry = params[keys[a]]
                    if (entry.match(/^\d+$/)){ // regex check if text can be a proper number
                        line1 +=  keys[a] + " = " + entry + ", "
                    }
                    else{
                        line1 +=  keys[a] + " = " + '\''+ entry + "\', "
                    }
                }
                else{
                    name = keys[a]
                    id = params[keys[a]]
                }
            }
            const sql = 'UPDATE detale SET ' + line1.substring(0, line1.length - 2) + ' WHERE ' + name + " = " + id + ';'
            connection.query(sql , (err, rows) => {
                connection.release() // return the connection to pool

                if(!err) {
                    res.send(`Part has been updated`)
                } else {
                    console.log(err)
                    res.send(err)
                }

            });
        });
    }


    // Update a general parts info
    const setSpecPart = (req, res) => {

        pool.getConnection((err, connection) => {
            if(err) throw err

            
            let params = req.query
            const iranga = params["iranga"] // get the type of part we're making
            let keys = Object.keys(params)
            let line1 = ""
            let name = ""
            let id = -1
            for (a in keys){ // merge data into a single string, but still has a extra comma at the end
                if(a != 0){
                    if(!keys[a].startsWith("id")){
                        var entry = params[keys[a]]
                        if (entry.match(/^\d+$/)){ // regex check if text can be a proper number
                            line1 +=  keys[a] + " = " + entry + ", "
                        }
                        else{
                            line1 +=  keys[a] + " = " + '\''+ entry + "\', "
                        }
                    }
                    else{
                        name = keys[a]
                        id = params[keys[a]]
                    }
                }
            }
            const sql = 'UPDATE ' + iranga + ' SET ' + line1.substring(0, line1.length - 2) + ' WHERE ' + name + " = " + id + ';'
            connection.query(sql , (err, rows) => {
                connection.release() // return the connection to pool

                if(!err) {
                    res.send(`Part has been updated`)
                } else {
                    console.log(err)
                    res.send(err)
                }

            });
        });
    }

module.exports = {
    getAllParts,
    getPart,
    getPartSpec,
    removePart,
    removeSpecPart,
    addPart,
    addSpecPart,
    setPart,
    setSpecPart,
}
