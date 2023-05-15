const express = require('express');
const mysql = require('mysql')

const app = express();

const pool  = mysql.createPool({
    connectionLimit : 20,
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
            res.send('duplicate entry, try to think of new id')
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
          res.send('duplicate entry, try to think of new id')
      }
      else {
          console.log(err)
          res.send(err)
      }

      });
  });
}
const generateToComputerSetForm = async (req, res) => {
  const { fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys, fk_Detaleid_Detale } = req.query; // Destructure the parameters from the URL query string
  
  try {
    const connection = await getConnectionFromPool(); // Get a database connection from the pool

    const sql = 'INSERT INTO rinkinio_detale (kiekis, fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys, fk_Detaleid_Detale) VALUES (?, ?, ?)';
    const result = await executeQuery(connection, sql, [1, fk_Kompiuterio_rinkinysid_Kompiuterio_rinkinys, fk_Detaleid_Detale]);
    
    connection.release(); // Release the database connection

    res.setHeader('Set-Cookie', 'partMessage=successADD; Max-Age=3');
    res.json({ message: 'Success', result });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getConnectionFromPool = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });
};

const executeQuery = (connection, sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};



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
    sqlQuery = 'DELETE FROM kompiuterio_rinkinys WHERE id_Kompiuterio_rinkinys=' + req.query.id;

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


const generateComputer = async (req, res) => {
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

    const maxPrice = req.query.type === 'browsing' ? 300 : req.query.type === 'studying' ? 600 : req.query.type === 'gaming' ? Number.MAX_SAFE_INTEGER : 0;
    let cpuSocket, ramGen, pcieStand;
    let gamingMinPrice=650;
    let motherboard = [
      {
        type: 'Motinine plokste',
        price: maxPrice * 0.10,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? maxPrice * 0.10 * 0.5 : gamingMinPrice * 0.10,
        sql: `SELECT detale.*, motinine_plokste.*
        FROM detale
        JOIN motinine_plokste ON detale.id_Detale = motinine_plokste.id_Motinine_plokste
        WHERE detale.tipas = 'Motinine plokste'
        AND detale.kaina <= ?
        ORDER BY detale.kaina DESC, motinine_plokste.RAM_karta DESC`
      }
    ];

    const promises2 = motherboard.map(c => new Promise((resolve, reject) => {
      connection.query(c.sql, [c.price], (error, rows) => {
        if (error) {
          reject(error);
        } else {
          const selectedRow = rows[0]; // Choose the desired row based on your criteria
          cpuSocket = selectedRow.CPU_lizdo_standartas;
          ramGen = selectedRow.RAM_karta;
          pcieStand = selectedRow.PCIe_standartas;
          resolve({ type: c.type, details: selectedRow });
        }
      });
    }));
    
    
    const resultsMotherboard = await Promise.all(promises2);

    let components = [
      {
        type: 'Procesorius',
        price: maxPrice * 0.20,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? maxPrice * 0.20 * 0.5 : gamingMinPrice * 0.20,
        parameters: ['price', 'cpuSocket'],
        sql: `SELECT detale.*, procesorius.*
        FROM detale INNER JOIN procesorius ON detale.id_Detale = procesorius.id_Procesorius
        WHERE detale.tipas = 'Procesorius' AND detale.kaina <= ? AND procesorius.CPU_lizdo_standartas = ? ORDER BY detale.kaina DESC,
        procesorius.branduoliu_kiekis DESC,
        procesorius.daznis DESC LIMIT 3`
      },
      {
        type: 'Atmintis',
        price: maxPrice * 0.10,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? 0 : gamingMinPrice * 0.10,
        parameters: ['price', 'ramGen'],
        sql: `SELECT detale.*, atmintis.*
        FROM detale JOIN atmintis ON detale.id_Detale = atmintis.id_Atmintis
        WHERE detale.tipas = 'Atmintis' AND detale.kaina <= ? AND atmintis.RAM_karta = ? ORDER BY detale.kaina DESC,
        atmintis.talpa DESC,
        atmintis.daznis DESC LIMIT 3`
      },
      {
        type: 'Vaizdo plokste',
        price: maxPrice * 0.20,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? maxPrice * 0.20 * 0.5 : gamingMinPrice * 0.20,
        parameters: ['price'],
        sql: `SELECT detale.*, vaizdo_plokste.*
        FROM detale JOIN vaizdo_plokste ON detale.id_Detale = vaizdo_plokste.id_Vaizdo_plokste
        WHERE detale.tipas = 'Vaizdo Plokste' AND detale.kaina <= ? ORDER BY detale.kaina DESC,
        vaizdo_plokste.VRAM_kiekis DESC,
        vaizdo_plokste.VRAM_daznis DESC LIMIT 3`
      },
      {
        type: 'Isorine atmintis',
        price: maxPrice * 0.10,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? maxPrice * 0.10 * 0.5 : gamingMinPrice * 0.10,
        parameters: ['price'],
        sql: `SELECT detale.*, isorine_atmintis.*
        FROM detale JOIN isorine_atmintis ON detale.id_Detale = isorine_atmintis.id_Isorine_atmintis
        WHERE detale.tipas = 'Isorine atmintis' AND detale.kaina <= ? ORDER BY detale.kaina DESC,
        isorine_atmintis.skaitymo_greitis DESC LIMIT 3`
      },
      {
        type: 'Maitinimo blokas',
        price: maxPrice * 0.10,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? maxPrice * 0.10 * 0.5 : gamingMinPrice * 0.10,
        parameters: ['price'],
        sql: `SELECT detale.*, maitinimo_blokas.*
        FROM detale JOIN maitinimo_blokas ON detale.id_Detale = maitinimo_blokas.id_Maitinimo_blokas
        WHERE detale.tipas = 'Maitinimo blokas' AND detale.kaina <= ? ORDER BY detale.kaina DESC,
        maitinimo_blokas.galia DESC LIMIT 3`
      },
      {
        type: 'Monitorius',
        price: maxPrice * 0.10,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? maxPrice * 0.10 * 0.5 : gamingMinPrice * 0.10,
        parameters: ['price'],
        sql: `SELECT detale.*, monitorius.*
        FROM detale JOIN monitorius ON detale.id_Detale = monitorius.id_Monitorius
        WHERE detale.tipas = 'Monitorius' AND detale.kaina <= ? ORDER BY detale.kaina DESC LIMIT 3`
      },
      {
        type: 'Ausintuvas',
        price: maxPrice * 0.05,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? 0 : gamingMinPrice * 0.05,
        parameters: ['price'],
        sql: `SELECT detale.*, ausintuvas.*
        FROM detale JOIN ausintuvas ON detale.id_Detale = ausintuvas.id_Ausintuvas
        WHERE detale.tipas = 'Ausintuvas' AND detale.kaina <= ? ORDER BY detale.kaina DESC LIMIT 3`
      },
      {
        type: 'Pele',
        price: maxPrice * 0.02,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? 0 : gamingMinPrice * 0.02,
        parameters: ['price'],
        sql: `SELECT detale.*, kompiuterio_pele.*
        FROM detale JOIN kompiuterio_pele ON detale.id_Detale = kompiuterio_pele.id_Kompiuterio_pele
        WHERE detale.tipas = 'Kompiuterio pele' AND detale.kaina <= ? ORDER BY detale.kaina DESC LIMIT 1`
      },
      {
        type: 'Klaviatura',
        price: maxPrice * 0.03,
        minPrice: req.query.type === 'browsing' ? 0 : req.query.type === 'studying' ? 0 : gamingMinPrice * 0.03,
        parameters: ['price'],
        sql: `SELECT detale.*, klaviatura.*
        FROM detale JOIN klaviatura ON detale.id_Detale = klaviatura.id_Klaviatura
        WHERE detale.tipas = 'Klaviatura' AND detale.kaina <= ? ORDER BY detale.kaina DESC LIMIT 1`
      }

    ];
    const mboardparameters = {
      cpuSocket, 
      ramGen, 
      pcieStand 
    };
    
    const promises = components.map(c => new Promise((resolve, reject) => {
      const queryParams = c.parameters.map(p => p === 'price' ? c.price : mboardparameters[p]);
    
      console.log('Executing query for:', c.type);
      console.log('Parameters:', queryParams);
      console.log(c.minPrice);
    
      connection.query(c.sql, queryParams, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          const filteredRows = rows.filter(row => row.kaina >= c.minPrice);
          const randomIndex = Math.floor(Math.random() * filteredRows.length);
          const randomElement = filteredRows[randomIndex];
    
          resolve({ type: c.type, details: randomElement });
        }
      });
    }));

    const resultsWithoutMotherboard = await Promise.all(promises);

    const results = [...resultsMotherboard, ...resultsWithoutMotherboard];
    console.log(results);

    res.status(200).json(results);

    connection.release();
  } catch (err) {
    res.status(500).send(err);
  }
};


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
    generateComputer,
    generateToComputerSetForm,
}