const OptionModel = require('../models/OptionsModel.js');


// Obtener todas las opciones
exports.GetallOptions = async (req, res) => {
    try {
        const Option = await OptionModel.findAll();
        res.json(Option);
    } catch (error) {
        console.log("Hubo un error al traer las opciones");
        res.json({
            "message": error.message
        });
    }
};

// Eliminar una opción por su ID
exports.DeleteOption = async (req, res) => {
    try {
        await OptionModel.destroy({
            where: { id: req.params.id }
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Crear una nueva opción
exports.createoption = async (req, res) => {
    try {
        await OptionModel.create(req.body);
        res.json({
            "message": "Opción creada correctamente"
        });
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};

// Obtener opción por ID de pregunta
exports.getOption = async (req, res) => {
    try {
        const option = await OptionModel.findAll({
            where: { id_pregunta: req.params.id_pregunta }
        });
        res.json(option[0]);
    } catch (error) {
        res.json({
            "message": error.message
        });
    }
};
