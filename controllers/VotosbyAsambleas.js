const { AsambleaModel, QuestionsModel, OptionsModel } = require('../models/asociations.js'); // Asegúrate de importar correctamente los modelos

exports.getVotingByAsamblea = async (req, res) => {
  try {
    // Buscar la asamblea específica con sus preguntas y opciones relacionadas
    const asam = await AsambleaModel.findOne({
      where: { id: req.params.id }, // Buscar por el id de la asamblea
      include: [
        {
          model: QuestionsModel, // Incluir las preguntas relacionadas
          as: 'preguntas',
          attributes: ['id', 'Pregunta'], // Usar el alias 'preguntas' que definiste en las asociaciones
          where: { Estado: 'Abierta' }, // Condición para traer solo preguntas con estado "Abierta"
          include: [
            {
              model: OptionsModel, // Incluir las opciones relacionadas a cada pregunta
              as: 'opciones' // Usar el alias 'opciones' que definiste en las asociaciones
            }
          ]
        }
      ]
    });

    // Si no se encuentra la asamblea, devolver un error
    if (!asam) {
      return res.status(404).json({ message: 'Asamblea no encontrada' });
    }

    // Devolver los datos estructurados
    return res.json(asam);

  } catch (error) {
    console.error('Error obteniendo la votación:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
