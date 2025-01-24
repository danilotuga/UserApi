const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const HomeController = require("../controllers/HomeControler");

const AdminAuth = require("../middleware/AdminAuth");

router.get("/", (req, res) => res.send("API funcionando!"));

// Rotas para o UserController
router.get("/user/:id?", UserController.index); // Busca usuários
router.post("/user", UserController.create);   // Cria usuário
router.put("/user", UserController.update);    // Atualiza usuário
router.delete("/user/:id", UserController.delete); // Deleta usuário
router.post("/recoverpassword", UserController.recoverPassword); // Recupera senha
router.post("/changepassword", UserController.changePassWord);  // Altera senha
router.post("/login", UserController.login);   // Login do usuário

// Rotas para o HomeController
router.post("/validate", AdminAuth, HomeController.validate); // Rota de validação

module.exports = router;