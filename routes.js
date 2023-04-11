const { Router } = require('express')
const searchController = require('./controllers/Search.contoller')
const studentsController = require('./controllers/Student.controller')
const routes = Router()


routes.get('/', (req, res) => {
    console.log(req.body)
    res.status(200).send({ message: "Websocket worked" })
})
routes.post('/students', studentsController.storeStudent)
routes.get('/students', studentsController.index)
routes.put('/students', studentsController.update)
routes.delete('/students', studentsController.destroy)
routes.get('/search', searchController.index)

module.exports = routes