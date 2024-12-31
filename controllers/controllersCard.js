const Cardmodel = require('../models/CardModel.js');
const { Op } = require('sequelize');


// Obtener todas las tarjetas
exports.getAllCards = async (req, res) => {
    try {
        const card = await Cardmodel.findAll();
        res.json(card);
    } catch (error) {
        console.log("Hubo un error al traer los datos");
        res.json({
            "message": error.message
        });
    }
};

// Obtener una tarjeta por su ID
exports.getCard = async (req, res) => {
    try {
        // Validar el parámetro id (debe ser una cadena no vacía)
        const id = req.params.id;
        if (!id || typeof id !== "string" || id.trim() === "") {
            return res.status(400).json({
                message: "El parámetro 'id' es inválido o no se proporcionó."
            });
        }

        // Buscar la tarjeta por id
        const card = await Cardmodel.findOne({
            where: { id }
        });

        // Si no se encuentra la tarjeta, responder con un mensaje claro
        if (!card) {
            return res.status(404).json({
                message: `No se encontró ninguna tarjeta con el ID: ${id}`
            });
        }

        // Respuesta exitosa
        res.status(200).json(card);
    } catch (error) {
        // Log detallado del error para depuración
        console.error("Error al traer la tarjeta por su ID:", error.message);

        // Respuesta en caso de error del servidor
        res.status(500).json({
            message: "Hubo un error al traer la tarjeta por su ID.",
            error: error.message
        });
    }
};


exports.updateEstado = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID del registro de los parámetros de la solicitud

        // Obtiene el registro para verificar el estado actual
        const card = await Cardmodel.findOne({ where: { id } });

        if (!card) {
            return res.status(404).json({ message: "No se encontró el registro" });
        }

        let nuevoEstado;

        // Verifica el estado actual y decide el nuevo estado
        switch (card.Estado) {
            case 'Activa':
                nuevoEstado = 'Finalizada';
                break;
            case 'Programada':
                nuevoEstado = 'Activa';
                break;
            default:
                return res.status(400).json({ message: "El estado actual no permite cambios" });
        }

        // Actualiza el estado en la base de datos
        const result = await Cardmodel.update(
            { Estado: nuevoEstado },
            { where: { id } }
        );

        if (result[0] === 0) {
            return res.status(500).json({ message: "No se pudo actualizar el registro" });
        }


        res.status(200).json({ message: `Estado actualizado a '${nuevoEstado}'` });
    } catch (error) {
        console.log("Hubo un error al actualizar el estado");
        res.status(500).json({ message: error.message });
    }
};


// Crear una nueva tarjeta
exports.createCard = async (req, res) => {
    try {
        // Validar los datos del cuerpo de la solicitud
        const { Title,Descripcion,UserId } = req.body;
        
        if (!Title || !Descripcion || !UserId) {
            return res.status(400).json({
                message: "Todos los campos osn obligatorios deben ser completados.",
            });
        }

        // Crear el registro en la base de datos
        const newCard = await Cardmodel.create(req.body);
 
        res.status(201).json({ 
            message: "El registro de la votación fue exitoso",
            data: newCard, // Devolver el nuevo registro creado
        });
    } catch (error) {
        // Detectar errores específicos (ejemplo: validación del modelo)
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Error de validación de datos.",
                details: error.errors, // Más información sobre el error
            });
        }

        // Error interno del servidor
        res.status(500).json({
            message: "Hubo un error al registrar la asamblea.",
            error:"diablo loco pno llego  ana", // Información para depuración
        });
    }
};
// Eliminar una tarjeta por su ID
exports.DeleteCard = async (req, res) => {
    try {
        await Cardmodel.destroy({
            where: { id: req.params.id }
        });
    } catch (error) {
        res.json({
            "message": error.message 
        });
    } 
};

// Obtener tarjetas por cédula
exports.getCardsByCedula = async (req, res) => {
    try {
        // Obtener el token desde las cookies
        const token = req.cookies.auth_token;

        if (!token) {
            return res.status(401).json({ message: 'Token missing or expired' });
        }

        // Decodificar el token
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Asegúrate de usar tu clave secreta
        const cedula = decoded.Cedula; // Ajusta el campo según el contenido de tu token
        const Cargo = decoded.Cargo;
        const Id = decoded.id;   // Ajusta el campo si el token usa otro nombre para este dato

        if (!cedula || !Cargo) {
            return res.status(403).json({ message: 'Unauthorized: Cedula or Cargo not found in token' });
        }

        // Consultar las cards en la base de datos usando la cédula
        const cards = await Cardmodel.findAll({
            where: { Id }
        });

        // Responder con las cards y el cargo del usuario
        res.json({
            cards,
            Cargo});
    } catch (error) {
        console.error("Hubo un error al traer las cards por cédula:", error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Actualizar el estado de una tarjeta
exports.updateCard = async (req, res) => { 
    try {               
        // Actualiza solo el campo 'estado'
        await Cardmodel.update(
            { Estado: req.body.Estado }, // Solo actualiza el campo 'estado'
            {
                where: { id: req.params.id }
            }
        );
        res.json({            
            "message": "El estado se actualizó correctamente"
        });
    } catch (error) {
        res.status(500).json({ // Es una buena práctica agregar un código de estado HTTP
            "message": error.message
        });
    }
};


exports.getEstado = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID del registro de los parámetros de la solicitud

        // Obtiene el registro correspondiente
        const card = await Cardmodel.findOne({ where: { id } });

        if (!card) {
            return res.status(404).json({ message: "No se encontró el registro" });
        }

        // Devuelve el campo Estado
        res.status(200).json({ Estado: card.Estado });
    } catch (error) {
        console.log("Hubo un error al obtener el estado");
        res.status(500).json({ message: error.message });
    }
};




