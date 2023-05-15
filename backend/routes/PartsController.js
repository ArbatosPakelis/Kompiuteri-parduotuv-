const express = require('express');
const mysql = require('mysql')

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
            columns = "(`laidine`, `id_Kompiuterio_pele`)"
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
        default:
            value = "All"
            break
    }
    return value;
}

function getTypesForRecommendation(type){
    let value = [];
    switch (type){
        case "motinine_plokste":
            value = ['Atmintis', 'Procesorius', 'Vaizdo plokste']
            break
        case "vaizdo_plokste":
            value = ['Motinine plokste', 'Monitorius', 'Maitinimo blokas']
            break
        case "procesorius":
            value = ['Atmintis', 'Motinine plokste', 'Isorine atmintis']
            break
        case "monitorius":
            value = ['Vaizdo plokste', 'Kompiuterio pele', 'Klaviatura']
            break
        case "maitinimo_blokas":
            value = ['Kabelis', 'Ausintuvas', 'Motinine plokste']
            break
        case "klaviatura":
            value = ['Kabelis', 'Kompiuterio pele', 'Monitorius']
            break
        case "ausintuvas":
            value = ['Motinine plokste', 'Atmintis', 'Maitinimo blokas']
            break
        case "atmintis":
            value = ['Isorine atmintis', 'Motinine plokste', 'Procesorius']
            break
        case "kompiuterio_pele":
            value = ['Klaviatura', 'Kabelis', 'Monitorius']
            break
        case "kabelis":
            value = ['Isorine atmintis', 'Maitinimo blokas', 'Monitorius']
            break
    }
    return value;
}

const getAllParts = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            if (connection) connection.release();
            res.status(500).send('Internal Server Error');
            return;
        }

        let sqlQuery = '';
        const tipas = getSQLPartsType(req.query.tipas);

        if (tipas === 'All') {
            sqlQuery = 'SELECT * FROM detale';
        } else {
            sqlQuery = 'SELECT * FROM detale WHERE tipas = ?';
        }

        connection.query(sqlQuery, [tipas], (err, rows) => {
            connection.release();
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send(rows);
        });
    });
}


// get specific part general info
const getPart = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM detale WHERE id_Detale = ?', [req.params.id], (error, rows) => {
                connection.release();
                if (error) {
                    return res.status(500).send('Internal Server Error');
                }
                if (rows.length === 0) {
                    return res.status(404).send('NotFound');
                }
                const type = getSQLParameters(rows[0].tipas)
                const tipas = [type[1]]
                const array = [...rows, ...tipas]

                res.send(array);
            }
        );
    });
};

// check if part infomation duplicates
const duplicationCheck = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        const gamintojas = req.query.gamintojas;
        const pavadinimas = req.query.pavadinimas;
        const tipas = req.query.tipas;

        connection.query(
            'SELECT id_Detale FROM detale WHERE gamintojas = ? AND pavadinimas = ? AND tipas = ?',
            [gamintojas, pavadinimas, tipas],
            (error, rows) => {
                connection.release();
                if (error) {
                    return res.status(500).send('Internal Server Error');
                }
                const ans = rows.length > 0;
                res.status(200).json({
                    status: 'success',
                    ans: ans,
                });
            }
        );
    });
};

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
// pavyzdys: addPart?gamintojas=kazka&pavadinimas=kazka&kaina=100&aprasymas=kazka&isleidimo_data=2023-04-02&kiekis=2&spalva=juoda&tipas=Procesorius&id_Detale=3
const addPart = (req, res) => {
    const params = req.query; // get all params
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const keys = Object.keys(params); // get param names
        let line1 = "";
        for (const key of keys) {
            // merge params names into a single string, but still has an extra comma at the end
            line1 += key + ",";
        }
        let line2 = "";
        for (const key of keys) {
            // merge data into a single string, but still has an extra comma at the end
            let entry = params[key];
            if (entry.match(/^\d+$/)) {
                // regex check if text can be a proper number
                line2 += entry + ",";
            } else {
                line2 += "'" + entry + "',";
            }
        }
        const sql =
            "INSERT INTO detale(" +
            line1.substring(0, line1.length - 1) +
            ") VALUES (" +
            line2.substring(0, line2.length - 1) +
            ");";

        connection.query(sql, (err, result) => {
            connection.release(); // return the connection to pool
            if (!err) {
                const id = result.insertId;
                res.setHeader("Set-Cookie", "partMessage=successADD; Max-Age=3");
                res.json({ id });
            } else if (err.errno === 1062) {
                console.log(err);
                res.send("duplicate entry, try to think of a new id");
            } else {
                console.log(err);
                res.send(err);
            }
        });
    });
};

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
        // check if the detale is assigned to 'kompiuterio rinkinys' and 'preke' table
        const isCurrentPartsSetBeingBought = `SELECT COUNT(*) as count FROM detale
                              INNER JOIN rinkinio_detale ON detale.id_Detale = rinkinio_detale.fk_Detaleid_Detale
                              INNER JOIN kompiuterio_rinkinys ON rinkinio_detale.fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys = kompiuterio_rinkinys.id_Kompiuterio_rinkinys
                              INNER JOIN preke ON preke.id_Preke = kompiuterio_rinkinys.fk_Prekeid_Preke
                              WHERE detale.${name} = ${id};`;

        connection.query(isCurrentPartsSetBeingBought, (checkErr, checkResult) => {
            if (checkErr) {
                console.log(checkErr);
                res.send(checkErr);
            } else {
                const count = checkResult[0].count;
                if (count === 0) {
                    // check if the detale is assigned to 'preke' table
                    const isCurrentPartBeingBought = `SELECT COUNT(*) as count FROM detale
                                  INNER JOIN preke ON detale.id_Detale = preke.fk_Detaleid_Detale
                                  WHERE detale.${name} = ${id};`;
                    connection.query(isCurrentPartBeingBought, (checkErr, checkResult) => {
                        const count = checkResult[0].count;
                        if(count === 0){
                            // if the part is not assigned to the 'preke' table, delete it from 'rinkinio_detale' table if it exists
                            const deleteFromBuilds = `DELETE FROM rinkinio_detale WHERE fk_Detaleid_Detale = ${id};`
                            connection.query(deleteFromBuilds, (selErr, selResult) => {
                                if (!selErr) {
                                    const sql = 'UPDATE detale SET ' + line1.substring(0, line1.length - 2) + ' WHERE ' + name + " = " + id + ';'
                                    connection.query(sql , (err, rows) => {
                                        connection.release()
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
                            res.setHeader('Set-Cookie', 'partMessage=partBeingBought; Max-Age=3');
                            res.send(
                                `Part cannot be updated. It is being bought.`
                            );
                        }
                    });
                } else {
                    res.setHeader('Set-Cookie', 'partMessage=partSetBeingBought; Max-Age=3');
                    res.send(
                        `Part cannot be updated. It is assigned to computer set which is being bought.`
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
        if (err) {
            console.log(err);
            if (connection) connection.release();
            res.status(500).send('Internal Server Error');
            return;
        }

        const getAll = 'SELECT * FROM rekomendacija;';

        connection.query(getAll, (err, rows) => {
            connection.release();
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send(rows);
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

const recommendParts = (req, res) => {
    pool.getConnection((err, connection) => {
        const tipas = req.query.type;
        const id = parseInt(req.query.id);

        connection.query('SELECT * from detale', (err, selectedParts) => {
            const initialParts = selectedParts;
            if (!err) {
                // filter parts
                const types = getTypesForRecommendation(tipas)
                const filterParts = selectedParts.filter(part => types.includes(part.tipas));
                const parts = filterParts.sort(() => Math.random() - 0.5);

                connection.query('SELECT * FROM rekomendacija;', (err, recommendations) => {
                    if (!err) {
                        // filter recommendations by selected parts and then sort it by priority
                        const filterSortRecommendations = recommendations.filter(recommendation =>
                            parts.some(part => part.id_Detale === recommendation.fk_Detaleid_Detale))
                            .sort((a, b) => a.prioritetas - b.prioritetas);

                        // selectFiveParts
                        const selectedParts = filterSortRecommendations.slice(0, 5).map(recommendation =>
                            parts.find(part => part.id_Detale === recommendation.fk_Detaleid_Detale)
                        );

                        let updatedParts = selectedParts;

                        if (selectedParts.length < 5) {
                            // addMoreParts()
                            const additionalPartsCount = 5 - selectedParts.length;
                            // Create a Set to store unique parts based on id_Detale
                            const uniquePartsSet = new Set(selectedParts.map(part => part.id_Detale));
                            // Filter out the duplicate parts from additionalParts
                            const additionalParts = initialParts.filter(part => !uniquePartsSet.has(part.id_Detale) && part.id_Detale !== id).slice(0, additionalPartsCount);
                            updatedParts = [...selectedParts, ...additionalParts];
                        }

                        const getReviewScore = `SELECT detale.id_Detale, COUNT(atsiliepimas.id_Atsiliepimas) AS count FROM detale
                                             LEFT JOIN preke ON preke.fk_Detaleid_Detale = detale.id_Detale
                                             LEFT JOIN atsiliepimas ON atsiliepimas.fk_Prekeid_Preke = preke.id_Preke
                                             GROUP BY detale.id_Detale;`;

                        connection.query(getReviewScore, (checkErr, checkResults) => {
                            connection.release();
                            if (!checkErr) {
                                // Create a map to store the counts for each part
                                const partCountsMap = new Map();
                                checkResults.forEach(result => {
                                    const partId = result.id_Detale;
                                    const count = result.count;
                                    partCountsMap.set(partId, count);
                                });

                                // Sort the updatedParts array based on the counts in descending order
                                updatedParts.sort((a, b) => partCountsMap.get(b.id_Detale) - partCountsMap.get(a.id_Detale));
                                res.send(updatedParts)
                            } else {
                                console.log(checkErr);
                            }
                        });
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
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
    duplicationCheck,
    applyRecommendationLevel,
    getRecommendations,
    getReviews,
    recommendParts
}
