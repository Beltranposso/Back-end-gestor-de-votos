const { AsambleaModel, Usuarios } = require('../models/asociations.js'); // Importar correctamente los modelos

exports.getUsersByAsamblea = async (req, res) => {
    try {
      // Buscar la asamblea específica con sus usuarios relacionados
      const asamblea = await AsambleaModel.findOne({
        where: { id: req.params.id_card }, // Buscar por el id de la asamblea
        include: [
          {
            model:Usuarios, // Incluir los usuarios relacionados
            as: 'Usuarios', // Usar el alias 'usuarios' que definiste en las asociaciones
          }
        ]
      });
  
      console.log("Resultado obtenido de la base de datos:", asamblea); // <-- Agregado para depuración
  
      if (!asamblea) {
        return res.status(404).json({
          message: "No se encontró la asamblea con el ID proporcionado",
          data: null,
        });
      }
  
      // Responder con los usuarios relacionados a la asamblea
      res.json({
        message: "Usuarios obtenidos exitosamente",
        data: asamblea, // Devuelve los usuarios asociados, o vacío si no hay
      });
    } catch (error) {
      console.error("Hubo un error al procesar la solicitud:", error.message);
      res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };