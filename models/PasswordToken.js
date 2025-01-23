const knex = require("../database/connection"); // Importa a conexão com o banco de dados
const UserModel = require("./UserModel"); // Importa UserModel para buscar o usuário pelo e-mail


class PassWordToken {
    /**
     * Cria um token para recuperação de senha e envia um e-mail ao usuário.
     * @param {string} email - E-mail do usuário.
     * @returns {Promise<Object>} Status da operação e o token gerado, ou erro caso falhe.
     */
    async create(email) {
        try {
            // Busca o usuário pelo e-mail
            const user = await UserModel.findUserEmail(email);

            // Verifica se o usuário foi encontrado
            if (!user) {
                return { status: false, err: "E-mail não encontrado!" };
            }

            // Gera um token único com base no timestamp
            const token = Date.now().toString();

            // Insere o token na tabela "passwordtokens"
            await knex.insert({
                id_user: user.id,
                used: 0, // O token começa como não utilizado
                token: token,
            }).table("passwordtokens");


              
          //   Caso queira implementar envio de email
         
            

            // Retorna o token criado e o status de sucesso
            return { status: true, token: token };
        } catch (err) {
            console.error("Erro ao criar token:", err);
            return { status: false, err: "Erro ao gerar o token." };
        }
    }

    // Valida se um token é válido e não foi usado
    async validate(token) {
        try {
            // Busca o token na tabela "passwordtokens"
            const result = await knex.select("*").from("passwordtokens").where({ token }).first();

            // Verifica se o token existe e se não foi usado
            if (result && result.used === 0) {
                return { status: true, token: result };
            }

            return { status: false, err: "Token inválido ou já utilizado!" };
        } catch (err) {
            console.error("Erro ao validar token:", err);
            return { status: false, err: "Erro ao validar o token." };
        }
    }

    
    // Marca um token como utilizado
    async setUsedToken(token) {
        try {
            await knex("passwordtokens").update({ used: 1 }).where({ token });
        } catch (err) {
            console.error("Erro ao invalidar o token:", err);
            throw new Error("Erro ao invalidar o token.");
        }
    }
}

module.exports = new PassWordToken();
