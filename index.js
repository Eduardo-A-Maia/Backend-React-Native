const express = require('express');

const PORT = 80

const app = express();

app.set('port', PORT);

app.route('/extrato').get((req, res)=> {
    res.status(200).send("voce solicitou o extrato")
});


app.route('/lancamento').get((req, res)=> {
    res.status(200).send("voce solicitou o um lancamento")
});

app.listen(PORT, ()=> {
    console.log("Servidor iniciado na porta: ", PORT)
})