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
const ModelUserDefinitive = require('./routes/UserDefinitive.js');
const ModelUserD = require('./models/UsuariosModelD.js');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

// Configuración de variables de entorno
dotenv.config();
console.log('SECRET_KEY:', process.env.SECRET_KEY);

const app = express();
const server = http.createServer(app);

// Configurar Socket.io
const io = new SocketServer(server, {
    cors: {
        origin: ["http//:localhost:5173"],
    }
});

app.use(cookieParser());
// Middleware para manejo de solicitudes
app.use(cors({
    /* origin: ['https://control360.co', 'https://controlvotantes360.co.control360.co'] */
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Si tu aplicación necesita cookies o autenticación basada en sesiones
}));
app.use(express.json());

// Rutas
app.use('/Usuarios', UserRoutes);
app.use('/card', CardRoutes);
app.use('/questions', QuestionsRoutes);
app.use('/options', OptionRoutes);
app.use('/votes', VotesRoutes);  
app.use('/idCard', cardRouterid);
app.use('/UsersDefinitive', ModelUserDefinitive); 

// Ruta de login
app.post('/login', async (req, res) => {
    try {
        const { Cedula, Contraseña } = req.body;

        console.log('Datos recibidos:', { Cedula, Contraseña });

        const user = await Usermodel.findOne({ where: { Cedula } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        if (Contraseña !== user.Contraseña) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const cargos = {
            1: 'Administrador',
            2: 'Operador de registro',
            3: 'Coordinador'
        };

        const userCargo = cargos[user.cargo];
        if (!userCargo) {
            return res.status(403).json({ message: 'Cargo no autorizado' });
        }

        // Crear token
        const token = jwt.sign(
            { Cedula: user.Cedula, Nombre: user.Nombre, Cargo: userCargo },
            process.env.SECRET_KEY,
            { expiresIn: '2h' }
        );

        // Configurar la cookie del token
        res.setHeader('Set-Cookie', cookie.serialize('auth_token', token, {
            httpOnly: true,
            secure: false, // true en producción
            sameSite: 'lax', // 'strict' o 'lax' según sea necesario
            path: '/',
            maxAge: 3600, // 1 hora
          }));
        // Respuesta con información adicional
        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            usuario: {
                Cedula: user.Cedula,
                Nombre: user.Nombre,
                Cargo: userCargo
            }
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ message: 'Error en el servidor. Por favor intenta de nuevo más tarde.' });
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

app.post('/CreateExcel/:id_card', async (req, res) => {
    try {
        // Obtén el id_card de los parámetros de la ruta
        const { id_card } = req.params;

        // Valida que el cuerpo de la solicitud tenga datos
        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).json({ message: 'El cuerpo de la solicitud debe ser un array no vacío' });
        }

        // Agrega el campo id_card a cada registro
        const dataConIdCard = req.body.map((registro) => ({
            ...registro,
            id_card: id_card, // Asigna el valor recibido desde la ruta 
        }));

        // Inserta los datos en la base de datos usando Sequelize
        await ModelUserD.bulkCreate(dataConIdCard);

        res.status(200).json({ message: 'Datos insertados correctamente' });
    } catch (error) {
        console.error('Error al insertar datos:', error);

        // Maneja errores específicos, como de validación o conexión
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }

        res.status(500).json({ message: 'Error al insertar datos' });
    }
});


app.get('/VotesOptions/:id', async (req, res) => {

/* Logica para ayar los resultados  por el quorum */

})


app.get('/DataAutenticathed', (req, res) => {
    console.log(req.cookies); // Verifica si la cookie está presente
    const token = req.cookies.auth_token; // Obtener el token de la cookie
  
    if (!token) {
      return res.status(401).json({ message: 'Token missing or expired' });
    }
  
    // Verificar y decodificar el token
    jwt.verify(token,  process.env.SECRET_KEY, (err, decoded) => {
      if(err) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      // Si el token es válido, extraemos la cédula y el cargo
      const { Cedula, Cargo } = decoded;
      // Devolver la cédula y cargo al cliente
      res.json({ Cedula, Cargo });
    });
  });



  app.get('/get-user-info', (req, res) => {
    const token = req.cookies.auth_token; // Obtener el token de la cookie HttpOnly
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' }); // Si no hay token, responder con 401
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' }); // Si el token es inválido, responder con 403
      }
  
      // Extraer el rol (cargo) del token y devolverlo
      const { Cargo, Cedula } = decoded;
      console.log("Cargo a devolver :", Cargo);
      res.json({ Cargo , Cedula });
    });
  });
  
  



// Configurar el puerto desde la variable de entorno o usar un valor por defecto
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Servidor andando en el http://localhost:${PORT}`);
});
