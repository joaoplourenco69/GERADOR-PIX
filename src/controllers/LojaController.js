const db = require('../config/database');

class LojaController {
    async cadastrarCliente(req, res) {
        const { nome, documento, email } = req.body || {};
        try {
            const sql = 'INSERT INTO clientes (nome, documento, email) VALUES (?, ?, ?)';
            await db.execute(sql, [nome, documento, email]);
            res.status(201).json({ mensagem: "Cliente salvo com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    async cadastrarProduto(req, res) {
        const { nome, categoria, preco } = req.body || {};
        try {
            const sql = 'INSERT INTO produtos (nome, categoria, preco) VALUES (?, ?, ?)';
            await db.execute(sql, [nome, categoria, preco]);
            res.status(201).json({ mensagem: "Produto salvo com sucesso!" });
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

module.exports = new LojaController();