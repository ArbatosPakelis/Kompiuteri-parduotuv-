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

const compatibility = async (req, res) => {
    try {
      const connection = await new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            reject(err);
          } else {
            resolve(connection);
          }
        });
      });
  
      const sql = `SELECT detale.* FROM detale 
          LEFT JOIN rinkinio_detale on detale.id_Detale=rinkinio_detale.fk_Detaleid_Detale 
          LEFT JOIN kompiuterio_rinkinys ON rinkinio_detale.fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=kompiuterio_rinkinys.id_Kompiuterio_rinkinys 
          WHERE kompiuterio_rinkinys.id_Kompiuterio_rinkinys = ?;`;
  
      connection.query(sql, [req.query.id], async (error, rows) => {
        connection.release();
        if (error) {
          return res.status(500).send(error);
        } else {
          let answer = [];
          for (let x in rows) {
            const tipas = rows[x]['tipas'].replace(' ', '_');
            const sql1 =
              `SELECT * FROM ${tipas.toLowerCase()} 
              LEFT JOIN detale ON detale.id_Detale=${tipas.toLowerCase()}.id_${tipas} 
              WHERE detale.id_Detale=?;`;
  
            const rows1 = await new Promise((resolve, reject) => {
              connection.query(sql1, [rows[x]['id_Detale']], (error1, rows1) => {
                if (error1) {
                  reject(error1);
                } else {
                  resolve(rows1);
                }
              });
            });
            answer.push(rows1[0]);
          }

          const motherboard = answer.find(a => a.tipas == 'Motinine plokste');
          const cpu = answer.find(b => b.tipas == 'Procesorius');
          const ram = answer.find(c => c.tipas == 'Atmintis');
          const gpu = answer.find(d => d.tipas =='Vaizdo plokste');
          const dataDisk = answer.find(e => e.tipas == 'Isorine atmintis');
          
          let problems = []
          if(motherboard !== null && cpu !== null && motherboard !== undefined && cpu !== undefined){
            if(cpu.CPU_lizdo_standartas !== motherboard.CPU_lizdo_standartas){
              problems.push("Motininė plokštė ir procesorius nėra suderinami\n")
            }
          }
          if(motherboard !== null && ram !== null && motherboard !== undefined && ram !== undefined){
            if(ram.RAM_karta !== motherboard.RAM_karta){
              problems.push("Motininė plokštė ir atmintis(RAM) nėra suderinami\n")
            }
          }
          if(motherboard !== null && gpu !== null && motherboard !== undefined && gpu !== undefined){
            if(motherboard[gpu.PCIe_standartas] < 2){
              problems.push("Motininė plokštė ir vaizdo plokštė nėra suderinami\n")
            }
          }
          if(motherboard !== null && dataDisk !== null && motherboard !== undefined && dataDisk !== undefined){
            if(motherboard[dataDisk.jungties_tipas] < 1){
              problems.push("Motininė plokštė ir išorinė atmintis nėra suderinami\n")
            }
          }
          res.status(200).json({
            status: problems.length==0,
            ans:problems,
          });
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  };

  // computerSet/addComputerSet?pavadinimas=rinkinys3&fk_Naudotojasid_Naudotojas=1
  const addComputerSet = (req, res) => {
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
        const sql = 'INSERT INTO kompiuterio_rinkinys(' + line1.substring(0, line1.length - 1) + ') VALUES (' + line2.substring(0, line2.length - 1) + ');'

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

// computerSet/updateComputerSet?kiekis=5&id_Rinkinio_detale=92&fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=4&fk_Detaleid_Detale=87
const updateComputerSet = (req, res) => {
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
      const sql = 'INSERT INTO rinkinio_detale(' + line1.substring(0, line1.length - 1) + ') VALUES (' + line2.substring(0, line2.length - 1) + ');'

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

const checkComputerSetDuplication= (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    let sqlQuery = 'SELECT count(pavadinimas) from kompiuterio_rinkinys WHERE kompiuterio_rinkinys.pavadinimas=\'' + req.query.pavadinimas + `\';`;

    connection.query(sqlQuery, (err, rows) => {
      if (err) {
        console.log(err);
        connection.release(); // Release the connection back to the pool in case of an error
        return;
      }

      res.status(200).json({
        ans:rows[0][`count(pavadinimas)`],
      });
      connection.release(); // Release the connection back to the pool after sending the response
    });
  });
}

// get ALLLLLL sets
const getComputerSets= (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    let sqlQuery = '';
    sqlQuery = 'SELECT * from kompiuterio_rinkinys;';

    connection.query(sqlQuery, (err, rows) => {
      if (err) {
        console.log(err);
        connection.release(); // Release the connection back to the pool in case of an error
        return;
      }

      res.send(rows);
      connection.release(); // Release the connection back to the pool after sending the response
    });
  });
}

// get ONE set
const getComputerSet= (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    let sqlQuery = `SELECT detale.* from kompiuterio_rinkinys 
    LEFT JOIN rinkinio_detale on rinkinio_detale.fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=kompiuterio_rinkinys.id_Kompiuterio_rinkinys
    LEFT JOIN detale ON rinkinio_detale.fk_Detaleid_Detale=detale.id_Detale 
    WHERE id_Kompiuterio_rinkinys=`+ req.query.id_Kompiuterio_rinkinys + `;`;

    connection.query(sqlQuery, (err, rows) => {
      if (err) {
        console.log(err);
        connection.release(); // Release the connection back to the pool in case of an error
        return;
      }
        let sqlQuery1 = `SELECT * from kompiuterio_rinkinys WHERE id_Kompiuterio_rinkinys=`+ req.query.id_Kompiuterio_rinkinys + `;`;
        ans = []
        connection.query(sqlQuery1, (err, rows1) => {
        if (err) {
          console.log(err);
          connection.release(); // Release the connection back to the pool in case of an error
          return;
        }
          res.status(200).json({
            ans: rows1,
            rows: rows,
          });
        });
      connection.release(); // Release the connection back to the pool after sending the response
    });
  });
}

const unlinkPartFromBuild= (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    let sqlQuery = '';
    sqlQuery = 'DELETE FROM rinkinio_detale WHERE fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=' + req.query.id;

    connection.query(sqlQuery, (err, rows) => {
      if (err) {
        console.log(err);
        connection.release(); // Release the connection back to the pool in case of an error
        return;
      }

      res.send(rows);
      connection.release(); // Release the connection back to the pool after sending the response
    });
  });
}

// dar reikia padaryti detales ištrinimą iš rinkinio
const deleteComputerSet= (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    let sqlQuery = '';
    sqlQuery = 'DELETE FROM rinkinio_detale WHERE fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys=' + req.query.id;

    connection.query(sqlQuery, (err, rows) => {
      if (err) {
        console.log(err);
        connection.release(); // Release the connection back to the pool in case of an error
        return;
      }
      sqlQuery = 'DELETE FROM kompiuterio_rinkinys WHERE id_Kompiuterio_rinkinys=' + req.query.id;

      connection.query(sqlQuery, (err, rowz) => {
        if (err) {
          console.log(err);
          connection.release(); // Release the connection back to the pool in case of an error
          return;
        }
        res.send(rowz);
      });
      connection.release(); // Release the connection back to the pool after sending the response
    });
  });
}

const removeComputerSetPart= (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    let sqlQuery = '';
    sqlQuery = 'DELETE FROM rinkinio_detale WHERE id_Rinkinio_detale=' + req.query.id;

    connection.query(sqlQuery, (err, rows) => {
      if (err) {
        console.log(err);
        connection.release(); // Release the connection back to the pool in case of an error
        return;
      }

      res.send(rows);
      connection.release(); // Release the connection back to the pool after sending the response
    });
  });
}

module.exports = {
    compatibility,
    addComputerSet,
    getComputerSets,
    unlinkPartFromBuild,
    deleteComputerSet,
    removeComputerSetPart,
    updateComputerSet,
    checkComputerSetDuplication,
    getComputerSet,
}