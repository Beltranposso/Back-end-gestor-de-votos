
import Usermodel from '../models/UsersModel.js'

// Metodos para el CRUD


// Este metodo muestra todos los  usuarios 

export const getAllUsers = async (req, res) => {
    try {
        const Users = await Usermodel.findAll()
        res.json(Users)

    } catch (error) {
        console.log("hubo un error al traer los usuarios")
        res.json({
            "message": error.message
        })
    }
}


// este metodo muestra  ciertos usuarios 


export const getUser = async (req, res) => {
    try {

        const user = await Usermodel.findAll({
            where: { id: req.params.id }
        })
        res.json(user[0])

    } catch (error) {
        console.log("hubo un error al traer los usuarios")
        res.json({
            "message": error.message
        })
    }
}


// este metodo crea un registro 
export const createUser = async (req, res) => {
    try {
        await Usermodel.create(req.body)
        res.json({
            "message": "el registro fue exitoso "
        })

    } catch (error) {
        res.json({
            "message": error.message
        })
    }
}


// este metodo actualiza la infromacion de un usuario 

export const updateUser = async (req, res) => {
    try {
        await Usermodel.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({
            "message": "se actualizo correctamente la informacion "
        })


    } catch (error) {
        res.json({
            "message": error.message
        })
    }
}

//este metodo elimina a un usuario 

export const DeleteUser = async (req, res) => {
    try {
        await Usermodel.destroy({
            where: { id: req.params.id }
        })

    } catch (error) {
        res.json({
            "message": error.message
        })
    }
}


