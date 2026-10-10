const Usuario = require('../models/Usuario')
const Produto = require('../models/Produto')
const Movimento = require('../models/Movimento')

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.idUsuario || !valores.idProduto || !valores.tipo || 
        !valores.qtdeMov || !valores.data) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    try {
        const produto = await Produto.findByPk(valores.idProduto)
        if (!produto) {
            return res.status(404).json({ message: "Produto inexistente!" })
        }

        const usuario = await Usuario.findByPk(valores.idUsuario)
        if (!usuario) {
            return res.status(404).json({ message: "Usuário inexistente!" })
        }

        let novaQuantidade = produto.quantidade

        if (valores.tipo === 'ENTRADA') {
            novaQuantidade += valores.qtdeMov
        } else if (valores.tipo === 'SAIDA') {
            if (produto.quantidade < valores.qtdeMov) {
                return res.status(400).json({ message: "Quantidade insuficiente no estoque!" })
            }
            novaQuantidade -= valores.qtdeMov
        } else {
            return res.status(400).json({ message: "Tipo de movimentação inválida!" })
        }

        await produto.update({ quantidade: novaQuantidade })

        const movimento = await Movimento.create(valores)
        return res.status(201).json(movimento)

    } catch (err) {
        console.error('Erro ao registrar o Movimento', err)
        return res.status(500).json({ message: "Erro ao registrar o Movimento" })
    }
}

const listar = async (req, res) => {
    try {
        const dados = await Movimento.findAll()
        return res.status(200).json(dados)
    } catch (err) {
        console.error('Não foi possível listar a movimentação!', err)
        return res.status(500).json({ message: 'Não foi possível listar a movimentação!' })
    }
}

module.exports = { cadastrar, listar }