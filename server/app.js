import express from 'express'
import http from 'http'
import {Server as SocketServer} from 'socket.io'
import cors from 'cors'
import db from '../database/db.js'
import UserRoutes from '../routes/routes.js'
import CardRoutes from '../routes/RoutesCard.js'
import QuestionsRoutes from '../routes/RoutesQuestions.js'
import OptionRoutes from '../routes/RoutesOption.js'
import VotesRoutes from '../routes/RoutesVotes.js'
import dotenv from 'dotenv'; 
import Usermodel from '../models/UsersModel.js'
import VotesModel from '../models/VotosMode.js'
import CardRouterid from '../controllers/VotosbyAsambleas.js'  
import jwt from 'jsonwebtoken';
 

dotenv.config();
console.log('SECRET_KEY:', process.env.SECRET_KEY);
const app  = express()
const server = http.createServer(app)


const io = new SocketServer(server,{
    cors: {
        origin: ["http://localhost:5173","http://localhost:5174"],
    }
})

/* rutas para la base de datos */
app.use(cors())
app.use(express.json())
app.use('/Usuarios',UserRoutes)
app.use('/card',CardRoutes)
app.use('/questions',QuestionsRoutes)
app.use('/options',OptionRoutes)
app.use('/votes', VotesRoutes)
  app.use('/idCard',CardRouterid)  

 
app.post('/login', async (req, res) => {
    const secretKey = process.env.SECRET_KEY;

    try {
        if (!secretKey) {  
            throw new Error('SECRET_KEY is not defined in .env file');
        }
        const { Cedula, Contraseña } = req.body;
        const user = await Usermodel.findOne({ where: { Cedula } });

        if (!user || Contraseña !== user.Contraseña) {
            return res.status(401).json({ message: 'Cedula o Contraseña incorrectos' });
        }

        // Generar el token
        const token = jwt.sign({ Cedula: user.Cedula,Nombre: user.Nombre}, secretKey, { expiresIn: '1s' });

        // Responder con el token
        return res.json({ token }); 

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
 

 app.post('/Validation', async (req, res) => {
    try {
        const { Cedula, Contraseña } = req.body;

        // Buscar usuario por cédula
        const user = await Usermodel.findOne({ where: { Cedula } });

        // Verificar si el usuario existe y si la contraseña es correcta
        if (!user || Contraseña !== user.Contraseña) {
            return res.status(401).json({ success: false, message: 'Cedula o Contraseña incorrectos' });
        }
 
        // Verificar si el usuario ya ha votado buscando en la tabla VotesModel
        const existingVote = await VotesModel.findOne({ where: { id_voter: Cedula } });

        if (existingVote) {
            return res.status(403).json({ success: false, message: 'Este usuario ya ha votado.' });
        }

        // Si la cédula no está en la tabla VotesModel, se permite la votación
        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

 
 

 const title ='' 
try {
    await db.authenticate()
    console.log('conexion ala base de datos exitosa ')
} catch (error) {
    console.log('error en la conexion en la bd')
}
 
 
//respuestas del servidor
 app.get('/',(req,res)=>{
    res.send('hola mundo ')
   
})  

io.on('connection', (socket) => {
   
    console.log('A new client connected:', socket.id);
    // Enviar mensaje solo al cliente recién conectado
    socket.emit('bienvenida', `Bienvenido! Tu ID de socket es: ${socket.id  }`);
    
 
        socket.on('enviaridCard', (idCard, question) => {
     
            console.log("respuesta del cliente", idCard, question);
            io.emit('enviaridCard', idCard, question);
        })

           
});


    
server.listen(8000,()=>{
    console.log('server andando en el http://localhost:8000/')
}) 

 