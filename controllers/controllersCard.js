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
        const Card = await Cardmodel.findAll({
            where: { id: req.params.id }
        });
        res.json(Card[0]);
    } catch (error) {
        console.log("Hubo un error al traer la tarjeta");
        res.json({
            "message": error.message
        });
    }
};

// Crear una nueva tarjeta
exports.createCard = async (req, res) => {
    try {
        await Cardmodel.create(req.body);
        res.json({
            "message": "El registro de la votación fue exitoso"
        });
    } catch (error) {
        res.json({
            "message": error.message
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
        const cards = await Cardmodel.findAll({
            where: { cedula: req.params.cedula }
        });
        res.json(cards);
    } catch (error) {
        console.log("Hubo un error al traer las cards por cédula");
        res.json({
            "message": error.message
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
