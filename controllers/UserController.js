const UserModel = require("../models/UserModel");

var PassWordToken = require('../models/PasswordToken')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');

var secret = "312asdsadasdsadsdsadsdasdsad"



class UserController {
    // Lista usuários ou retorna um específico
    async index(req, res) {
        const { id } = req.params;

        if (id) {
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({ err: "Usuário não encontrado!" });
            }
            return res.json(user);
        }

        const users = await UserModel.findAll();
        res.json(users);
    }

    // Cria um novo usuário
    async create(req, res) {
        const { name, email, password } = req.body;

        if (!email) {
            return res.status(400).json({ err: "O e-mail é obrigatório!" });
        }

        const emailExists = await UserModel.findHasEmail(email);
        if (emailExists) {
            return res.status(406).json({ err: "O e-mail já está cadastrado!" });
        }

        try {
            await UserModel.new(name, email, password);
            res.status(201).json({ message: "Usuário criado com sucesso!" });
        } catch (err) {
            res.status(500).json({ err: "Erro ao criar o usuário!" });
        }
    }

   // Atualiza um usuário existente
async update(req, res) {
    // Desestrutura os valores enviados no corpo da requisição
    const { id, name, email, role } = req.body;

    // Verifica se o ID foi enviado, pois é obrigatório para a atualização
    if (!id) {
        return res.status(400).json({ err: "O ID do usuário é obrigatório!" });
    }

    // Cria um objeto vazio para armazenar os campos que serão atualizados
    const updateUser = {};

    // Adiciona o nome ao objeto de atualização, se enviado na requisição
    if (name) updateUser.name = name;

    // Adiciona o email ao objeto de atualização, se enviado na requisição
    if (email) updateUser.email = email;

    // Adiciona o role ao objeto de atualização, se enviado na requisição
    // Verifica explicitamente se o role foi definido para evitar sobrescrever com undefined
    if (role !== undefined) updateUser.role = role;

    // Chama o método `updateUser` do modelo para realizar a atualização no banco de dados
    const result = await UserModel.updateUser(id, updateUser);

    // Se a atualização foi bem-sucedida, retorna uma mensagem de sucesso
    if (result.status) {
        return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    }

    // Caso contrário, retorna o erro gerado pelo método `updateUser`
    res.status(400).json({ err: result.err });
}


    // Deleta um usuário existente
    async delete(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ err: "O ID do usuário é obrigatório!" });
        }

        const result = await UserModel.deleteUser(id);
        if (result.status) {
            return res.status(200).json({ message: "Usuário deletado com sucesso!" });
        }
        res.status(400).json({ err: result.err });
    }


    async recoverPassword(req,res){
        var email = req.body.email;
        var result = await PassWordToken.create(email)

        if(result.status){
            res.status(200)
            res.send(result.token)
            //NodeMailer.Send()
        }else{
            res.status(406)
            res.send(result.err)
        }
    }
    //alteração de senha
    async changePassWord(req, res) {

    var token = req.body.token;
    var password = req.body.password;
   

    try {
        // Espera pela validação do token
        var isTokenValid = await PassWordToken.validate(token);

        // Verifica se o token é válido
        if (isTokenValid.status) {
            
            const userId = isTokenValid.token.id_user; // Supondo que o ID do usuário esteja no token
            // Chama o método para mudar a senha
            await UserModel.changePassword(password, userId,isTokenValid.token.token); // Corrigido o argumento

            res.status(200).send("Senha alterada com sucesso!");
        } else {
            res.status(406).send("Token inválido");
        }
    } catch (err) {
        console.error("Erro ao tentar alterar a senha:", err);
        res.status(500).send("Erro ao tentar alterar a senha.");
    }
}

//login de usuário
async login(req,res){
    var {email , password} = req.body

    var user = await UserModel.findByEmail(email)

    if(user != undefined || user != null){

        var result = await bcrypt.compare(password,user.password)

        if(result){
            var token = jwt.sign({ email: user.email, role: user.role }, secret);
            res.status(200)
            res.json({token:token})
        }else{
            res.status(401)
            res.json({err: "Senha Incorreta"})
        }


    
    
    }else{
        res.status(406)
        res.json({status: false, err: "O usuário não existe"})

    }
    
}



}



module.exports = new UserController();
