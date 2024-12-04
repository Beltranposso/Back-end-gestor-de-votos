const VotosMode = require("../models/VotosMode.js");
const UsuariosMode = require("../models/UsuariosModelD.js");
const { Votos, UsuariosDefinitive } = require("../models/asociations.js");
// Trae todos los votos
exports.getAllVotos = async (req, res) => {
    try {
        const Votos = await VotosMode.findAll();
        res.json(Votos);

    } catch (error) {
        console.log("Hubo un error al traer los votos de los usuarios");
        res.json({
            "message": error.message
        });
    }
};

// Registra un voto
exports.RegisterVote = async (req, res) => {
    try {
        await VotosMode.create(req.body);
        res.json({
            "message": "El registro fue exitoso"
        });

    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

 // Asegúrate de importar el modelo de Usuarios

 exports.getvoto = async (req, res) => {
    try {
        const votos = await Votos.findAll({
            where: { id_card: req.params.id_card },
            include: [
                {
                    model: UsuariosDefinitive,
                    as: 'usuario', // Usar el alias definido en la relación
                    attributes: ['Nombre'], // Seleccionar los campos que necesitas
                }
            ]
        });
        res.json(votos);
    } catch (error) {
        console.log("Hubo un error al traer los votos");
        res.json({
            "message": error.message
        });
    }
};


// Obtiene los votos por id de opción
exports.getVotosByid = async (req, res) => {
    try {
        const votos = await VotosMode.findAll({
            where: { id_Option: req.params.id_Option }
        });
        res.json(votos);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

