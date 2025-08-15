module.exports = (app) =>{
    // Import user controller
    const users = require('../controllers/user.controller');

    //add a new user
    app.post('/user' , users.create);

    //retrieve all users
    app.get('/user', users.findAll);

    //get a user with userID
    app.get('/user/:id', users.findOne);

    //update a user with userId
    app.put('/user/:id', users.update);

    //delete a user
    app.delete('/user/:id', users.delete)
}