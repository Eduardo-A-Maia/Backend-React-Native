const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const pg = require('pg');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || config.get('server.port');
const JWT_SECRET = process.env.JWT_SECRET || config.get('jwt.secret');

const pool = new pg.Pool(
    {
        connectionString: "postgres://wtjytyqdzkcbjh:e81438320f66397cb0815499c4004959418fe49000615fae620c4374ff0ef45a@ec2-54-166-167-192.compute-1.amazonaws.com:5432/deviio1j57knoj",
        ssl: { 
            rejectUnauthorized: false
        }
    }
);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', port);

app.route('/reset').get( (req, res) => { 
    let query = "DROP TABLE IF EXISTS jogos; ";
    query += "CREATE TABLE jogos (";
    query += " nomejogo varchar(100), ";
    query += " datalancamento varchar(50), ";
    query += " quantidade int, ";
    query += " genero varchar(25) ";
    query += "); ";
    query = "DROP TABLE IF EXISTS usuarios; ";
    query += "CREATE TABLE usuarios (";
    query += " usuario varchar(50), ";
    query += " senha varchar(255), ";
    query += " perfil varchar(25), ";
    query += " nome varchar(100) ";
    query += "); ";
    query += "INSERT INTO usuarios (usuario, senha, perfil, nome) ";
    query += "VALUES ('pio', '123', 'ADMIN', 'Eduardo');";

    pool.query(query, (err, dbres) => { 
        console.log("Executando reset de banco de dados");
        if (err) { 
            res.status(500).send(err);
        } else { 
            res.status(200).send("Banco de dados resetado");
        }
    })
});


app.route('/jogos').get( (req, res)=>{
    let qry = "SELECT * from jogos;";
    pool.query(qry, (err, dbres) => { 
        if (err) { 
            res.status(500).send(err);
        } else { 
            res.status(200).json(dbres.rows);
        }
    });
});

app.route('/jogo/adicionar').post( (req, res)=> { 
    let qry = "INSERT INTO jogos ";
    qry += "(nomejogo, datalancamento, quantidade, genero) "
    qry += ` VALUES ('${req.body.nomejogo}', '${req.body.datalancamento}',`;
    qry += ` ${req.body.quantidade}, '${req.body.genero}');`;
    pool.query(qry, (err, dbres) => { 
        if (err) { 
            res.status(500).send(err);
        } else { 
            res.status(200).send("Ok");
        }
    });
})

app.route('/login').post((req, res) => { 
    const user = req.body.usuario;
    const pass = req.body.senha;
    console.log("Testando usuario e senha");
    if (user === undefined || pass === undefined) { 
        return res.status(400).send("Usuário e senha são necessários")
    } else { 
        console.log("Usuario e senhas recebidos");
        console.log("Usuario=>", user, "   Senha=>", pass);

        let qry = `SELECT * FROM usuarios WHERE usuario = '${user}' AND senha = '${pass}';`;
        pool.query(qry, (err, dbres) => { 
            if (err) { 
                res.status(500).send(err);
            } else { 
                if (dbres.rows.length > 0) { 
                    const dbusuario = dbres.rows[0];
                    const payload = {   "usuario": dbusuario.usuario, 
                                        "perfil": dbusuario.perfil,
                                        "nome": dbusuario.nome
                                    }
                    console.log("SECRET==>", JWT_SECRET);
                    const token = jwt.sign(payload, JWT_SECRET);
                    console.log("TOKEN=>", token);
                    const resposta = {
                        "token": token
                    }
                    res.status(200).json(resposta);
                } else {
                    res.status(401).send("Usuario ou senha inválidos");
                }
            }
        });
    }
});

app.listen(port, () => { 
    console.log("Servidor está iniciado na porta ", port);
})
