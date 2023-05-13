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

module.exports = {
    compatibility
}