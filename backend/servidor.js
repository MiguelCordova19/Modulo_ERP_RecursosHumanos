const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {probarConexion} = require('./configuration/baseDatos');
const {obtenerListaTrabajadores} = require('./controllers/trabajadorescontroller');

const app = express();
const puerto = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
});

app.get('/api/trabajadores', obtenerListaTrabajadores);

const iniciarServidor = async ()=> {
    try {
        await probarConexion();

        app.listen(puerto, ()=>{
            console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
        });
    } catch (error) {
        console.error('Error al iniciar')
    }
};

iniciarServidor();