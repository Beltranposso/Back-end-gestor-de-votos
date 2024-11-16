const Usermodel = require('../models/UsersModel.js');
// const dotenv = require('dotenv'); // Si es necesario, puedes descomentar esta línea
const jwt = require('jsonwebtoken');

// Métodos para el CRUD

// Este método muestra todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const Users = await Usermodel.findAll();
        res.json(Users);
    } catch (error) {
        console.log("Hubo un error al traer los usuarios");
        res.json({
            "message": error.message
        });
    }
};

// Este método muestra ciertos usuarios
exports.getUser = async (req, res) => {
    try {
        const user = await Usermodel.findAll({
            where: { id: req.params.id }
        });
        res.json(user[0]);
    } catch (error) {
        console.log("Hubo un error al traer los usuarios");
        res.json({
            "message": error.message
        });
    }
};

// Este método crea un registro
exports.createUser = async (req, res) => {
    try {
        await Usermodel.bulkCreate(req.body);
        res.json({
            "message": "El registro fue exitoso"
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Este método actualiza la información de un usuario
exports.updateUser = async (req, res) => {
    try {
        await Usermodel.update(req.body, {
            where: { Cedula: req.params.Cedula }
        });
        res.json({
            "message": "Se actualizó correctamente la información"
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Este método elimina a un usuario
exports.DeleteUser = async (req, res) => {
    try {
        await Usermodel.destroy({
            where: { Cedula: req.params.Cedula }
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// /* export const Login = async (req, res) => {
//     try {
//         const { Cedula, Contraseña } = req.body; // Captura los datos enviados en la solicitud
//         const user = await Usermodel.findOne({ where: { Cedula } });
//
//         if (!user) {
//             return res.status(401).json({ message: 'Cedula inválida' });
//         }
//
//         // Comparación directa sin usar bcrypt ni seguridad adicional
//         if (Contraseña !== user.Contraseña) {
//             return res.status(401).json({ message: 'Contraseña inválida' });
//         }
//
//         return res.json({ message: 'Inicio de sesión exitoso', user });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }; */
// dotenv.config(); // Si es necesario, puedes descomentar esta línea
// /* export const login = async (req, res) => {
//     
//     const secretKey = process.env.SECRET_KEY;
//     
//     try {
//         if (!secretKey) {         
//             throw new Error('SECRET_KEY is not defined in .env file');
//         }
//         const { Cedula, Contraseña } = req.body;
//         const user = await Usermodel.findOne({ where: { Cedula } });
//
//         if (!user || Contraseña !== user.Contraseña) {
//             return res.status(401).json({ message: 'Cedula o Contraseña incorrectos' });
//         }
//
//         // Generar el token
//         const token = jwt.sign({ Cedula: user.Cedula }, secretKey, { expiresIn: '1h' });
//
//         // Responder con el token
//         return res.json({ token });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }
// */

