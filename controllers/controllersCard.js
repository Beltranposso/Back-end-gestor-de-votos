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
  

