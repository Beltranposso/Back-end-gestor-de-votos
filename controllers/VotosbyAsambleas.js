




import {  QuestionsModel, OptionsModel, Votos, Usuarios, AsambleaModel} from '../models/asociations.js' // Asumiendo que tienes estos modelos definidos


export default async function getVotingByAsamblea(req, res) {
  const id = req.params.id
   console.log('ID de la asamblea:', id)
    try {
    // Buscar la asamblea específica
    const asam = await AsambleaModel.findOne({
      where: { id: '804c65e4-9c96-4e8f-af24-61e45644ff5d' },
      include: [{
        model: QuestionsModel,
        as: 'preguntas', // Alias para las preguntas de la asamblea
        include: [{
          model: OptionsModel,
          as: 'opciones', // Alias para las opciones de la pregunta
          include: [{
            model: Votos,
            as: 'votos', // Alias para los votos de la opción
            include: [{
              model: Usuarios,
              as: 'usuario', // Alias para el usuario que votó
              attributes: ['Cedula', 'nombre'] // Campos del usuario que quieres obtener
            }]
                    }] 
                }]
            }]
        });

        if (!asam) {
      return { success: false, message: res.status(404).json({ message: 'Asamblea no encontrada' }) };
        }

    // Devolver los datos estructurados
    return { success: true, response: res.json(asam) };

    } catch (error) {
    console.error('Error obteniendo la votación:', error);
    return { success: false, message: error.message };
  }
}
