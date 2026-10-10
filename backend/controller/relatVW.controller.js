const VwHistoricoSaidas = require('../models/VwHistoricoSaidas')
const VwTotalCategoria = require('../models/VwTotalCategoria')

const listarPorCategorias = async (req, res) => {
    try {
        const dados = await VwTotalCategoria.findAll()
        return res.status(200).json(dados)
    } catch (err) {
        console.error('Não foi possível listar por Categorias', err)
        return res.status(500).json({ message: 'Não foi possível listar por Categorias' })
    }
}

const listarHistoricoSaidas = async (req, res) => {
    try {
        const dados = await VwHistoricoSaidas.findAll()
        return res.status(200).json(dados)
    } catch (err) {
        console.error('Não foi possível listar o histórico das Saídas', err)
        return res.status(500).json({ message: 'Não foi possível listar o histórico das Saídas' })
    }
}

module.exports = { listarPorCategorias, listarHistoricoSaidas }