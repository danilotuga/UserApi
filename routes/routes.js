var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController");
var AdminAuth = require('../middleware/AdminAuth.js')


router.get("/", (req, res) => res.send("API funcionando!"));
router.get("/user/:id?", UserController.index); // Busca usuários
router.post("/user",AdminAuth, UserController.create); // Cria usuário
router.put("/user", UserController.update); // Atualiza usuário
router.delete("/user/:id", UserController.delete); // Deleta usuário
router.post("/recoverpassword",UserController.recoverPassword);
router.post("/changePassWord",UserController.changePassWord)
router.post("/login",UserController.login)

module.exports = router;
