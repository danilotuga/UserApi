var jwt = require("jsonwebtoken");
var secret = "312asdsadasdsadsdsadsdasdsad";

module.exports = function(req, res, next){
    const authToken = req.headers['authorization']

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        var token = bearer[1];
//         var decoded = jwt.verify(token,secret);

//         res.json({status: 403, 
//             token: token,
//             authToken: authToken,
//             secret: secret,
//             decoded: decoded
//          })

//    return false
        try{
            var decoded = jwt.verify(token,secret);
   
            if(decoded.role == 1){
                next();
            }else{
                res.status(403);
                res.send("Você não tem permissão para isso!");
                return;
            }
        }catch(err){
            res.status(403);
            res.send("Vocês não está autenticado 2",err);
            return;
        }
    }else{
        res.status(403);
        res.send("Você não está autenticado 3");
        return;
    }
}