const express = require('express');
const mysql = require('mysql')

const app = express();

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        :  null,
    database        : 'duombaze'
})

function getSQLParameters(iranga) {
    var columns = "";
    var table = "";
    switch (iranga){
        case "Motinine plokste":
            columns = "(`CPU_lizdo_standartas`, `CPU_lizdu_kiekis`, `M2_kiekis`, `SATA_kiekis`, `PCIe_lizdu_kiekis`, `RAM_karta`, `PCIe_standartas`, `id_MotPlokste`)"
            table = "motinine_plokste"
            break
        case "Vaizdo plokste":
            columns = "(`VRAM_kiekis`, `VRAM_daznis`, `PCIe_standartas`, `jungtis`, `id_Plokste`)"
            table = "vaizdo_plokste"
            break
        case "Procesorius":
            columns = "(`CPU_lizdo_standartas`, `daznis`, `branduoliu_kiekis`, `id_Procesorius`)"
            table = "procesorius"
            break
        case "Monitorius":
            columns = "(`atkurimo_daznis`, `dydis`, `panele`, `id_Monitorius`)"
            table = "monitorius"
            break
        case "Maitinimo blokas":
            columns = "(`galia`, `laidu_kontrole`, `sertifikatas`, `id_Blokas`)"
            table = "maitinimo_blokas"
            break
        case "Klaviatura":
            columns = "(`tipas`, `id_Klaviatura`)"
            table = "klaviatura"
            break
        case "Ausintuvas":
            columns = "(`aukstis`, `ausinimo_vamzdziu_kiekis`, `id_Ausintuvas`)"
            table = "ausintuvas"
            break
        case "Atmintis":
            columns = "(`talpa`, `daznis`, `RAM_karta`, `id_Atmintis`)"
            table = "atmintis"
            break
        case "Kompiuterio pele":
            columns = "(`laidine`, `id_Pele`)"
            table = "kompiuterio_pele"
            break
        case "Kabelis":
            columns = "(`ilgis`, `tipas`, `id_Kabelis`)"
            table = "kabelis"
            break
    }
    return [columns, table];
}

function getSQLPartsType(type) {
    let value = "";
    switch (type){
        case "motinine_plokste":
            value = "Motinine plokste"
            break
        case "vaizdo_plokste":
            value = "Vaizdo plokste"
            break
        case "procesorius":
            value = "procesorius"
            break
        case "monitorius":
            value = "Monitorius"
            break
        case "maitinimo_blokas":
            value = "Maitinimo blokas"
            break
        case "klaviatura":
            value = "Klaviatura"
            break
        case "ausintuvas":
            value = "Ausintuvas"
            break
        case "atmintis":
            value = "Atmintis"
            break
        case "isorine_atmintis":
            value = "Isorine atmintis"
            break
        case "kompiuterio_pele":
            value = "Kompiuterio pele"
            break
        case "kabelis":
            value = "Kabelis"
            break
    }
    return value;
}

    const getAllParts = (req, res) => {
      pool.getConnection((err, connection) => {
        if (err) throw err;
        let sqlQuery = '';
        let tipas = getSQLPartsType(req.query.tipas);
        if (tipas !== ""){
            sqlQuery = 'SELECT * from detale WHERE tipas = "' + tipas + '"';
        } else{
            sqlQuery = 'SELECT * from detale';
        }

        connection.query(sqlQuery, (err, rows) => {
          connection.release(); // return the connection to pool
          if (!err) {
            res.send(rows);
          } else {
            console.log(err);
          }
          //console.log('The data from beer table are: \n', rows);
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

    // check if part infomation duplicates
    const duplicationCheck = (req, res) => {
        pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        const gamintojas = req.query.gamintojas;
        const pavadinimas = req.query.pavadinimas;
        const kaina = req.query.kaina;
        const aprasymas = req.query.aprasymas;
        const isleidimo_data = req.query.isleidimo_data;
        // i won't check for amount since it's a bit pointless
        const spalva = req.query.spalva;
        const tipas = req.query.tipas;


        connection.query(
            'SELECT detale.id_Detale FROM detale WHERE gamintojas = ? AND pavadinimas = ? AND tipas = ?',
                [gamintojas, pavadinimas, tipas],(error, rows) => {
                connection.release();
                if (error) {
                    return res.status(500).send('Internal Server Error');
                }
                if (Object.keys(rows).length === 0) {
                    return res.status(404).send('NotFound');
                }
                var i = 0;
                for(a in rows){
                    i = i + 1
                }
                // function only works if I return it this way
                res.status(200).json({
                    status: 'success',
                    ans: i>1,
                    });
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
                    return res.status(404).json({ error: 'NotFound' });
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
        const sqlCheck = 'SELECT FROM preke WHERE fk_Detaleid_Detale = ' + req.params.id;
        //connection.query(sqlCheck, (err, rows) => {
               //if (!err) {} else {}
        //});

        const sqlRemoveFromAllBuilds = 'DELETE FROM kompiuterio_rinkinys WHERE fk_Prekeid_Preke = ' + req.params.id;
        //connection.query(sqlRemoveFromAllBuilds, (err, rows) => {
            //if (!err) {} else {}
        //});

        const sql = 'DELETE FROM detale WHERE id_Detale = ' + req.params.id;
        connection.query(sql, (err, rows) => {
            connection.release(); // return the connection to pool
            if (!err) {
                res.setHeader('Set-Cookie', 'partMessage=success; Max-Age=3');
                res.send(
                `success.`
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

            connection.query(sql, (err, result) => {
            connection.release() // return the connection to pool
            if (!err) {
                const id = result.insertId;
                res.setHeader('Set-Cookie', 'partMessage=successADD; Max-Age=3');
                res.json({ id });
            }
            else if (err.errno === 1062) {
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
            const id = params["id"]
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
                    var entry = params[keys[a]]
                    if (entry.match(/^\d+$/)){ // regex check if text can be a proper number
                        line2 +=  entry + ","
                    }
                    else{
                        line2 +=  '\''+ entry + "\',"
                    }
                }
            }

            const [columns, table] = getSQLParameters(iranga)

            const sql = 'INSERT INTO ' + table + ' ' + columns + ' VALUES (' + line2.substring(0, line2.length - 1) + ');'

            connection.query(sql, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`detale has been added.`)
            }
            else if (err.errno == 1062) {
                res.send('duplicate entry, try to think of new id')
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
            if (err) throw err;

            const params = req.query; // get all params
            const keys = Object.keys(params); // get param names
            let line1 = "";
            let name = "";
            let id = -1;
            for (a in keys) {
                // merge data into a single string, but still has an extra comma at the end
                if (!keys[a].startsWith("id")) {
                    var entry = params[keys[a]];
                    if (entry.match(/^\d+$/)) {
                        // regex check if text can be a proper number
                        line1 += keys[a] + " = " + entry + ", ";
                    } else {
                        line1 += keys[a] + " = " + "'" + entry + "', ";
                    }
                } else {
                    name = keys[a];
                    id = params[keys[a]];
                }
            }
            // check if the part is assigned to the 'preke' table
            const isCurrentPartBeingBought = `SELECT COUNT(*) as count FROM detale
                                  INNER JOIN rinkinio_detale ON detale.fk_Rinkinio_detaleid_Rinkinio_detale = rinkinio_detale.id_Rinkinio_detale
                                  INNER JOIN kompiuterio_rinkinys ON rinkinio_detale.fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys = kompiuterio_rinkinys.id_Kompiuterio_rinkinys
                                  INNER JOIN preke ON preke.id_Preke = kompiuterio_rinkinys.fk_Prekeid_Preke
                                  WHERE detale.${name} = ${id};`;

            connection.query(isCurrentPartBeingBought, (checkErr, checkResult) => {
                if (checkErr) {
                    console.log(checkErr);
                    res.send(checkErr);
                } else {
                    const count = checkResult[0].count;
                    var foreignID = -1;
                    if (count === 0) {
                        // if the part is not assigned to the 'preke' table, delete it from the 'kompiuterio rinkinys' and 'rinkinio_detale' table if it exists
                        const deleteFromBuilds = `SELECT detale.fk_Rinkinio_detaleid_Rinkinio_detale
                                               FROM detale
                                               WHERE id_Detale = ${id};`
                        connection.query(deleteFromBuilds, (selErr, selResult) => {
                            if (!selErr) {
                                foreignID = selResult[0].fk_Rinkinio_detaleid_Rinkinio_detale;

                                const updateSql = `UPDATE detale
                                        SET fk_Rinkinio_detaleid_Rinkinio_detale = NULL
                                        WHERE id_Detale = ${id};`

                                connection.query(updateSql, (updateErr, updateResult) => {
                                    if (!updateErr) {
                                        console.log(`Detale has been updated to be NULL`);
                                    } else {
                                        console.log(updateErr);
                                    }
                                });

                                const deleteSql = `DELETE
                                                   FROM rinkinio_detale 
                                                   WHERE id_Rinkinio_detale = ${foreignID};`
                                connection.query(deleteSql, (deleteErr, deleteResult) => {
                                    if (!deleteErr) {
                                        console.log(`Part has been deleted`);
                                    } else {
                                        console.log(deleteErr);
                                    }
                                });

                                const sql = 'UPDATE detale SET ' + line1.substring(0, line1.length - 2) + ' WHERE ' + name + " = " + id + ';'
                                connection.query(sql , (err, rows) => {
                                    connection.release() // return the connection to pool

                                    if(!err) {
                                        res.setHeader('Set-Cookie', 'partMessage=successEDIT; Max-Age=3');
                                        res.send(`Part has been updated`)
                                        console.log(`Part has been updated`)
                                    } else {
                                        console.log(err)
                                        res.send(err)
                                    }
                                })


                            } else {
                                console.log(selErr);
                            }
                        });
                    } else {
                        // if the part is assigned to the 'preke' table, do not update and send an error message
                        res.send(
                            `Part cannot be updated. It is being bought.`
                        );
                    }
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

    const applyRecommendationLevel = (req, res) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            const currentTime = new Date().toLocaleTimeString();
            const priority = req.query.priority;
            const partID = req.query.id_Detale;

            const checkRecommendationQuery = `SELECT COUNT(*) AS count FROM rekomendacija WHERE fk_Detaleid_Detale = '${partID}';`;

            connection.query(checkRecommendationQuery, (checkErr, checkResult) => {
                if (checkErr) {
                    console.log(checkErr);
                    res.send(checkErr);
                } else {
                    const recommendationExists = checkResult[0].count > 0;

                    let updateRecommendation;
                    if (recommendationExists) {
                        updateRecommendation = `UPDATE rekomendacija SET data = '${currentTime}', prioritetas = '${priority}' WHERE fk_Detaleid_Detale = '${partID}';`;
                    } else {
                        updateRecommendation = `INSERT INTO rekomendacija(data, prioritetas, fk_Detaleid_Detale, fk_Administratoriusid_Naudotojas) 
                                       VALUES ('${currentTime}', '${priority}', '${partID}', '1');`;
                    }

                    connection.query(updateRecommendation, (updateErr, updateResult) => {
                        if (updateErr) {
                            console.log(updateErr);
                            res.send(updateErr);
                        } else {
                            res.setHeader('Set-Cookie', 'partMessage=successRECOMMENDATION; Max-Age=3');
                            console.log("Recommendation created or updated");
                            res.send(`success`);
                        }
                    });
                }
            });
        });
    };

    const getRecommendations = (req, res) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            const getAll = `SELECT * FROM rekomendacija;`;

            connection.query(getAll, (err, rows) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.send(rows);
                }
            });
        });
    };

const getReviews = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        const ID = req.params.id;

        const sql = `SELECT * FROM atsiliepimas
                     INNER JOIN preke ON atsiliepimas.fk_Prekeid_Preke = preke.id_Preke
                     INNER JOIN detale on preke.fk_Detaleid_Detale = detale.id_Detale
                     WHERE detale.id_Detale = ${ID}; `;

        connection.query(sql,(error, rows) => {
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
    duplicationCheck,
    applyRecommendationLevel,
    getRecommendations,
    getReviews
}
