const userService = require("../services/user");
const userController = {
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;

      const response = await userService.updateUser({ id, ...updateFields });
      console.log(response, "result");
      res.status(200).json({ response });
    } catch (e) {
      console.error(e, "error");
      res.status(400).json({ error: e.message || "Error updating user" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const response = await userService.deleteUser(req.params);
      console.log(response, "result");
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, "error");
    }
  },
  getUser: async (req, res) => {
    try {
      const response = await userService.getUser(req.params);
      console.log(response, "result");
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, "error");
    }
  },
  getUsers: async (req, res) => {
    try {
      const response = await userService.getUsers();
      console.log(response, "result");
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, "error");
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = await userService.getProfile(req); // Pass `req` to the service
      res.status(200).json({ response: user });
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      res.status(500).json({ message: error.message });
    }
  },
  createOrder:async(req,res) => {
    try{
        /*const response = await userService.createOrder();
        if(response){
            
        }*/
        //kafka.sendMessage('asdas','asdads')
        res.status(200).send({response:[]})
    }catch(e){
        console.log(e,'error')
    }
},
};
module.exports = userController;
