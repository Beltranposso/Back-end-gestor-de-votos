const VotosMode = require("../models/VotosMode.js");

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
