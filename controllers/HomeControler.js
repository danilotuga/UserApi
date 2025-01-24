class HomeController {
    async index(req, res) {
        res.send("APP EXPRESS");
    }

    async validate(req, res) {
        console.log(res)
        res.status(200).send("Okay"); // Retorna explicitamente o status 200
    }
}

module.exports = new HomeController();