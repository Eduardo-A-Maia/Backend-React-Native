const pg = require('pg');
const express = require('express');
const config = require('config');
const path = require('path');
const bodyParser = require('body-parser');  // middleware
const port = process.env.PORT || config.get('server.port');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', port);

const pool = new pg.Pool({
    //                                usuario                                senha                                                     host                  porta    database
    connectionString: 'postgres://nhvkqrtwcccsfw:67bdff0304f7b9fe0247ce89ac81a61e3ccd9b6e7ed767f0ec5a4c8236b15986@ec2-18-215-111-67.compute-1.amazonaws.com:5432/debpebb38ok1ig',
    ssl: { 
        rejectUnauthorized: false
    }
});


app.route('/reset').get( (req, res) => {
    let dropCreateTable = "";
    dropCreateTable += "DROP TABLE IF EXISTS lancamentos; ";
    dropCreateTable += "CREATE TABLE lancamentos (";
    dropCreateTable += "data char(12), ";
    dropCreateTable += "descricao char(50), ";
    dropCreateTable += "valor decimal(5, 2) ";
    dropCreateTable += ");";

    pool.query(dropCreateTable, (err, dbres) => { 
        console.log("Error: ", err);
        console.log(dbres);
        res.status(200).send("Banco de dados foi resetado")
    });
});

app.route('/extrato').get( (req, res) => {
    let qry = "SELECT * FROM lancamentos;";
    pool.query(qry, (err, dbres) => { 
        console.log("Error: ", err);
        res.status(200).json(dbres.rows);
    });
});

app.route('/lancamento').post( (req, res) => {
    let qry = "INSERT INTO lancamentos (data, descricao, valor) VALUES ";
    qry += `('${req.body.data}', '${req.body.descricao}', ${req.body.valor});`;
    pool.query(qry, (err, dbres) => { 
        res.status(200).send("Ok");
    });
});

app.listen(port, ()=> { 
    console.log("Servidor iniciado na porta: ", port);
})