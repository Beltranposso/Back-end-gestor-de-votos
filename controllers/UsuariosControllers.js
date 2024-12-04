const ModelUser = require('../models/UsuariosModelD.js');
// const dotenv = require('dotenv'); // Si es necesario, puedes descomentar esta línea


// Métodos para el CRUD

// Este método muestra todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const Users = await ModelUser.findAll();
        res.json(Users);
    } catch (error) {
        console.log("Hubo un error al traer los usuarios");
        res.json({
            "message": error.message 
        });
    }
};
exports.getAllUsersCounter = async (req, res) => {
    try {
        const Users = await ModelUser.findAll();
        res.status(200).json({ count: Users.length });
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
        const user = await ModelUser.findAll({
            where: { id_card: req.params.id_card    }
        });

        if (user.length === 0) {
            // Si no se encuentra ningún usuario, se retorna un JSON predeterminado
            return res.json({
                message: "No hay usuarios",
                id_card: req.params.id_card,
                data: null
            });
        }

        // Si se encuentran usuarios, se retorna el resultado
        res.json(user);
    } catch (error) {
        console.error("Hubo un error al traer los usuarios:", error.message);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Este método crea un registro
exports.createUser = async (req, res) => {
    try {
        await ModelUser.create(req.body);
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
        await ModelUser.update(req.body, {
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
        await ModelUser.destroy({
            where: { Cedula: req.params.Cedula }
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};
exports.getVotosByCardIdAndEstado = async (req, res) => {
    try {
        const votos = await ModelUser.findAll({
            where: {
                id_card: req.params.id_card, // Filtra por id_card
                EstadoVoto: "No"            // Solo donde EstadoVoto sea "No"
            }
        });
        res.json(votos);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

exports.SetAsistencia = async (req, res) => {
    try {
        // Obtener la cédula desde los parámetros de la solicitud
        const cedula = req.params.Cedula;

        // Verificar que se recibió la cédula
        if (!cedula) {
            return res.status(400).json({
                message: "La cédula del usuario es obligatoria.",
            });
        }

        // Buscar el usuario en la base de datos por la cédula
        const user = await ModelUser.findOne({ where: { Cedula: cedula } });

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        // Actualizar solo el campo Asistencia del usuario encontrado
        await ModelUser.update(
            { Asistencia: "Presente" }, // Datos a actualizar
            { where: { Cedula: cedula } } // Condición de búsqueda
        );

        // Opcional: Buscar nuevamente al usuario actualizado para confirmarlo
        const updatedUser = await ModelUser.findOne({ where: { Cedula: cedula } });

        // Enviar respuesta con el usuario actualizado
        res.json({
            message: "La asistencia del usuario se actualizó correctamente."
        });
    } catch (error) {
        console.log("Hubo un error al actualizar la asistencia del usuario:", error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};