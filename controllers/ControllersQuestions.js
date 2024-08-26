import QuestionModel from '../models/QuestionsModel.js'

export const  getQuestions =async  (req,res)=> {
    try {
     const Question = await QuestionModel.findAll({
         where: { id: req.params.id }
     })
     res.json(Question[0])
    } catch (error) {
     res.json({
         "message": error.message
     })
    }
 }
 
  export const createQuestion = async (req,res)=> {
 try {
     await QuestionModel.create(req.body)
     res.json({
         "message": "pregunta creada correctamente "
     })
     } catch (error) {
       res.json({
         "message": error.message
       })
 }
 }
 