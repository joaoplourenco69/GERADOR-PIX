const express = require('express');
const router = express.Router();
const LojaController = require('../controllers/LojaController');

router.post('/clientes', LojaController.cadastrarCliente);
router.post('/produtos', LojaController.cadastrarProduto);

module.exports = router;