const express = require('express');
const http = require('http');
const { Server: SocketServer } = require('socket.io');
const cors = require('cors');
const db = require('./database/db.js');
const UserRoutes = require('./routes/routes.js');
const CardRoutes = require('./routes/RoutesCard.js');
const QuestionsRoutes = require('./routes/RoutesQuestions.js');
const OptionRoutes = require('./routes/RoutesOption.js');
const VotesRoutes = require('./routes/RoutesVotes.js');
const dotenv = require('dotenv');
const Usermodel = require('./models/UsersModel.js');
const VotesModel = require('./models/VotosMode.js');
const cardRouterid = require('./routes/CardRouterid.js');
const CardModel = require('./models/CardModel.js');
const jwt = require('jsonwebtoken');

// Configuración de variables de entorno
dotenv.config();
console.log('SECRET_KEY:', process.env.SECRET_KEY);

const app = express();
const server = http.createServer(app);

// Configurar Socket.io
const io = new SocketServer(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
    }
});

// Middleware para manejo de solicitudes
app.use(cors());
app.use(express.json());

// Rutas
app.use('/Usuarios', UserRoutes);
app.use('/card', CardRoutes);
app.use('/questions', QuestionsRoutes);
app.use('/options', OptionRoutes);
app.use('/votes', VotesRoutes);
app.use('/idCard', cardRouterid);

// Ruta de login
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
        const token = jwt.sign({ Cedula: user.Cedula, Nombre: user.Nombre }, secretKey, { expiresIn: '1h' });

        // Responder con el token
        return res.json({ token });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Ruta de validación
app.post('/Validation', async (req, res) => {
    try {
        const { Cedula, Contraseña } = req.body;
        const user = await Usermodel.findOne({ where: { Cedula } });

        if (!user || Contraseña !== user.Contraseña) {
            return res.status(401).json({ success: false, message: 'Cedula o Contraseña incorrectos' });
        }

        const existingVote = await VotesModel.findOne({ where: { id_voter: Cedula } });

        if (existingVote) {
            return res.status(403).json({ success: false, message: 'Este usuario ya ha votado.' });
        }

        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// Ruta para obtener enlace por ID
app.get('/Link/:id', async (req, res) => {
    try {
        const link = await CardModel.findOne({ where: { id: req.params.id }, attributes: ['link'] });
        if (!link) {
            return res.status(404).json({ message: 'Asamblea no encontrada' });
        }
        return res.json(link);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
(async () => {
    try {
        await db.authenticate();
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.log('Error en la conexión a la base de datos');
    }
})(); 

// Conexión a la base de datos
// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('Hola mundo');
});

// Configuración de sockets
io.on('connection', (socket) => {
    console.log('A new client connected:', socket.id);
    socket.emit('bienvenida', `Bienvenido! Tu ID de socket es: ${socket.id}`);

    socket.on('iniciar', (msg) => {
        console.log('Recibido iniciar:', msg);
        socket.broadcast.emit('I', msg);
    });

    socket.on('señal', (señal) => {
        console.log('Señal recibida:', señal);
        socket.broadcast.emit('M', señal);
    });

    app.post('/api/votacion/estado', async (req, res) => {
        const { Estado, id } = req.body;
        try {
            await CardModel.update({ Estado }, { where: { id } });
            res.status(200).json({ message: 'Estado actualizado correctamente' });
            io.emit('iniciar', Estado);
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
            res.status(500).json({ message: 'Error al actualizar el estado' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// Ruta para obtener estado de votación por ID
app.get('/api/votacion/estado/:id', async (req, res) => {
    try {
        const card = await CardModel.findOne({ attributes: ['Estado'], where: { id: req.params.id } });
        if (card) {
            res.type('text/plain');
            res.send(card.Estado.toString());
        } else {
            res.send(null);
        }
    } catch (error) {
        res.status(500).send('Error al obtener el estado');
    }
});

// Configurar el puerto desde la variable de entorno o usar un valor por defecto
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Servidor andando en el http://localhost:${PORT}`);
});
