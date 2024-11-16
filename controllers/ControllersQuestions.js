const QuestionModel = require('../models/QuestionsModel.js');

// Obtener preguntas por id de la tarjeta
exports.getQuestions = async (req, res) => {
    try {
        const Question = await QuestionModel.findAll({
            where: { id_card: req.params.id_card }
        });
        res.json(Question[0]);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Crear una nueva pregunta
exports.createQuestion = async (req, res) => {
    try {
        await QuestionModel.create(req.body);
        res.json({
            "message": "Pregunta creada correctamente"
        });
    } catch (error) {
        res.json({
            "message": error.message + ", error al crear la pregunta"
        });
    }
};

// Obtener todas las preguntas
exports.getAllQuestions = async (req, res) => {
    try {
        const pregunta = await QuestionModel.findAll();
        res.json(pregunta);
    } catch (error) {
        console.log("Hubo un error al traer los datos");
        res.json({
            "message": error.message
        });
    }
};
