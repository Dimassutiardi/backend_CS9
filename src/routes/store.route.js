const express = require("express");
const router = express.Router();
const controller = require("../controllers/store.controller");

router.get("/getAll", controller.getAllStores);
router.post("/create", controller.createStore);
router.get("/:id", controller.getStoreById);
router.put("/", controller.updateStore);
router.delete('/test/:id', (req, res) => {
    res.send(`You hit DELETE /store/test/${req.params.id}`);
});


module.exports = router;

