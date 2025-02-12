const express = require("express");
const bodyParser = require("body-parser");

const infoRouter = express.Router();
infoRouter.use(bodyParser.json());

const {createInfoShop,getInfoShop,updateInfoShop} = require("../controllers/model/infor-controller")

infoRouter.get("", getInfoShop);
infoRouter.post("/createInfo",createInfoShop)
infoRouter.put("/updateInfo/:id",updateInfoShop)// làm nốt cho tôi t chưa nghĩ ra cái put này 
module.exports=infoRouter;