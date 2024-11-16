import Cardmodel from '../models/CardModel.js'
import { Op } from 'sequelize'



export const getAllCards = async (req, res) => {
    try {
        const card = await Cardmodel.findAll()
        res.json(card)

    } catch (error) {
        console.log("hubo un error al traer los datos")
        res.json({
            "message": error.message
        })
    }
}


export const  getCard = async(req,res)=>{
    try {

        const Card = await Cardmodel.findAll({
            where: { id: req.params.id }
        })
        res.json(Card[0])

    } catch (error) {
        console.log("hubo un error al traer las card")
        res.json({
            "message": error.message
        }) 
    }
}

export const createCard = async (req, res) => {
    try {
        await Cardmodel.create(req.body)
        res.json({
            "message": "el registro  de la votacion fue exitoso "
        })

    } catch (error) {
        res.json({
            "message": error.message
        })
    }
}


export const DeleteCard = async (req, res) => {
    try {
        await Cardmodel.destroy({
            where: { id: req.params.id }
        })

    } catch (error) {
        res.json({
            "message": error.message
        })
    }
}
export const getCardsByCedula = async (req, res) => {
    try {
        const cards = await Cardmodel.findAll({
            where: { cedula: req.params.cedula }
        })
        res.json(cards)

    } catch (error) {
        console.log("hubo un error al traer las cards por cedula")
        res.json({
            "message": error.message
        })
    }
}
  


export const updateCard = async (req, res) => { 
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

