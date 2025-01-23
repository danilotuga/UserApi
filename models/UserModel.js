
var knex = require("../database/connection"); // Importa a conexão com o banco de dados
var bcrypt = require('bcrypt');



class UserModel {
    // Busca todos os usuários
    async findAll() {
        try {
            // Realiza uma consulta na tabela "users" para obter os campos "id", "name", "email" e "role"
            return await knex.select("id", "name", "email", "role").table("users");
        } catch (err) {
            // Loga o erro em caso de falha e retorna um array vazio
            console.error("Erro ao buscar usuários:", err);
            return [];
        }
    }

    // Busca um usuário específico pelo ID
    async findById(id) {
        try {
            // Realiza uma consulta na tabela "users" pelo ID fornecido
            const result = await knex.select("id", "name", "email", "role").table("users").where({ id });
            // Retorna o primeiro usuário encontrado ou null se não houver resultado
            return result.length ? result[0] : null;
        } catch (err) {
            // Loga o erro em caso de falha e retorna null
            console.error("Erro ao buscar usuário pelo ID:", err);
            return null;
        }
    }

    // Busca um usuário específico pelo ID
    async findByEmail(email) {
        try {
            // Realiza uma consulta na tabela "users" pelo ID fornecido
            const result = await knex.select("id", "name", "email", "password","role").table("users").where({ email : email });

            // Retorna o primeiro usuário encontrado ou null se não houver resultado
            return result.length ? result[0] : null;
        } catch (err) {
            // Loga o erro em caso de falha e retorna null
            console.error("Erro ao buscar usuário pelo Email:", err);
            return null;
        }
    }

    // Verifica se um e-mail já está cadastrado no banco de dados
    async findHasEmail(email) {
        try {
           
            // Consulta o banco de dados para verificar se o e-mail existe
            const result = await knex.select("id").table("users").where({ email: email });

            // Retorna true se o e-mail já estiver cadastrado, false caso contrário
            return result.length > 0;
        } catch (err) {
            // Loga o erro em caso de falha e retorna false
            console.error("Erro ao verificar e-mail:", err);
            return false;
        }
    }

    // Verifica se um e-mail já está cadastrado no banco de dados
    async findUserEmail(email) {
        try {

            // Consulta o banco de dados para verificar se o e-mail existe retornando o id do usuário
            const result = await knex.select("id").table("users").where({ email: email });

            // Retorna código de usuário cadastrado
            return result.length ? result[0] : null;
        } catch (err) {
            // Loga o erro em caso de falha e retorna false
            console.error("Erro ao buscar usuário pelo e-mail:", err);
            return false;
        }
    }

    // Cria um novo usuário
    async new(name, email, password) {
        try {
            // Gera um hash da senha para armazenamento seguro
            const hash = await bcrypt.hash(password, 10);
            // Insere o novo usuário na tabela "users" com o hash da senha e o papel padrão (role = 0)
            await knex.insert({ name, email, password: hash, role: 0 }).table("users");
        } catch (err) {
            // Loga o erro em caso de falha e lança o erro para ser tratado pelo chamador
            console.error("Erro ao criar usuário:", err);
            throw err;
        }
    }

    // Atualiza os dados de um usuário
    async updateUser(id, updateUser) {
        // Busca o usuário pelo ID para garantir que ele existe
        const user = await this.findById(id);

        // Retorna erro se o usuário não for encontrado
        if (!user) {
            return { status: false, err: "Usuário não encontrado!" };
        }

        // Se o e-mail foi enviado e é diferente do atual, verifica se ele já está cadastrado
         if (updateUser.email && updateUser.email !== user.email) {

            const emailExists = await this.findHasEmail(updateUser.email);
            if (emailExists) {
                return { status: false, err: "O e-mail já está cadastrado!" };
            }
        }

        try {
            // Atualiza os dados do usuário na tabela "users" com os valores fornecidos
            await knex("users").update(updateUser).where({ id });
            return { status: true }; // Retorna sucesso
        } catch (err) {
            // Loga o erro em caso de falha e retorna uma mensagem de erro genérica
            console.error("Erro ao atualizar usuário:", err);
            return { status: false, err: "Erro ao atualizar o usuário!" };
        }
    }

    // Deleta um usuário pelo ID
    async deleteUser(id) {
        // Busca o usuário pelo ID para garantir que ele existe
        const user = await this.findById(id);

        // Retorna erro se o usuário não for encontrado
        if (!user) {
            return { status: false, err: "Usuário não encontrado!" };
        }

        try {
            // Remove o usuário da tabela "users" com base no ID
            await knex("users").where({ id }).del();
            return { status: true }; // Retorna sucesso
        } catch (err) {
            // Loga o erro em caso de falha e retorna uma mensagem de erro genérica
            return { status: false, err: "Erro ao deletar o usuário!" };
        }
    }

async changePassword(newPassword,id,token){
 
    try {
         // Gera um hash da senha para armazenamento seguro
        const hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("users")
        await PasswordToken.setUsedToken(token)
        
    } catch (err) {
        // Loga o erro em caso de falha e retorna uma mensagem de erro genérica
        return { status: false, err: "Erro ao tentar atribuir novo password ao usuário!" };
    }
 
   
}

}

// Exporta a classe UserModel já instanciada para ser utilizada em outras partes da aplicação
module.exports = new UserModel();
