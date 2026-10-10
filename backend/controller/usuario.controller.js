const Usuario = require('../models/Usuario')

const cryptojs = require('crypto-js')
const CHAVE_SECRETA = 'chave_baixa'

const cadastrar = async (req, res) => {
    const valores = req.body
    console.log(valores)

    if (!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.telefone) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' })
    }

    if (valores.cpf.length !== 11) {
        return res.status(400).json({ message: 'Tamanho do cpf invalido' })
    }

    try {

        const cpfCrypto = cryptojs.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        const senhaCrypto = cryptojs.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await Usuario.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCrypto,
            cpf: cpfCrypto,
            telefone: valores.telefone
        })
        res.status(201).json({ message: 'Usuario Cadastrado com sucesso!' })
    } catch (err) {
        console.error('Não foi possível cadastrar o Usuário', err)
        res.status(500).json({ message: 'Não foi possível cadastrar o Usuário' })
    }
}
const listar = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll()
        let resultado = []
        let cpfDescriptografado = ''

        usuarios.forEach((el) => {
            const bytes = cryptojs.AES.decrypt(el.cpf, CHAVE_SECRETA)
            cpfDescriptografado = bytes.toString(cryptojs.enc.Utf8)

            resultado.push({
                codigo_Usuario: el.codUsuario,
                nome: el.nome,
                email: el.email,
                telefone: el.telefone,
                cpf: cpfDescriptografado
            })
        })

        res.status(200).json(resultado)

    } catch (err) {
        console.error('Erro ao listar o Usuario!', err)
        res.status(500).json({ message: 'Erro ao listar o Usuario!' })
    }
}

const buscarPorCod = async (req, res) => {
    const id = req.params.id

    try {
        const usuario = await Usuario.findByPk(id)

        if (!usuario) {
            return res.status(404).json({ message: "Usuario não encontrado!" })
        }

        const bytes = cryptojs.AES.decrypt(usuario.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(cryptojs.enc.Utf8)

        return res.status(200).json({
            codigo_Usuario: el.codUsuario,
            nome: el.nome,
            email: el.email,
            telefone: el.telefone,
            cpf: cpfDescriptografado
        })
    } catch (err) {
        console.error('Erro ao consultar o Usuario!', err)
        res.status(500), json({ message: 'Erro ao consultar o Usuario!' })
    }
}

const buscarPorNome = async (req,res)=>{
    const nome = req.params.nome

    try{
        const usuario = await Usuario.findOne({ where: { nome: nome}})

        if(!usuario){
            return res.status(404).json({message: "Usuario não encontrado!"})
        }
        const bytes = cryptojs.AES.decrypt(usuario.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(cryptojs.enc.Utf8)

        return res.status(200).json({
            codigo_ciclista : usuario.codUsuario,
            nome: usuario.nome,
            email: usuario.email,
            cpf: cpfDescriptografado,
            endereco: usuario.endereco,
            celular: usuario.celular

        })

    }catch(err){
        console.error('Erro ao consultar o ciclista!',err)
        res.status(500),json({message: 'Erro ao consultar o ciclista!'})
    }
}

const excluir = async (req,res)=>{
     const id = req.params.id

    try{
        const usuario = await Usuario.findByPk(id)

        if(!usuario){
            return res.status(404).json({message: "Usuario não encontrado!"})
        }

        await Usuario.destroy({ where: { codUsuario: id}})

        return res.status(200).json({message: 'Usuario excluído com sucesso!' })
    }catch(err){
        console.error('Erro ao apagar o Usuario!',err)
        res.status(500),json({message: 'Erro ao apagar o Usuario!'})
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const usuario = await Usuario.findByPk(id)

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado no banco de dados!' })
        }


        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'Tamanho do CPF inválido!' })
            }
            valores.cpf = cryptojs.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if (valores.senha) {
            valores.senha = cryptojs.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        }

        await Usuario.update(valores, { where: { codUsuario: id } })

        const usuarioAtualizado = await Usuario.findByPk(id)

        const bytes = cryptojs.AES.decrypt(usuarioAtualizado.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(cryptojs.enc.Utf8)

        return res.status(200).json({
            codigo_Usuario: usuarioAtualizado.codUsuario,
            nome: usuarioAtualizado.nome,
            email: usuarioAtualizado.email,
            telefone: usuarioAtualizado.telefone,
            cpf: cpfDescriptografado
        })
    } catch (err) {
        console.error('Não foi possível atualizar o Usuário', err)
        return res.status(500).json({ message: 'Não foi possível atualizar o Usuário' })
    }
}
module.exports = { cadastrar, listar, buscarPorCod, buscarPorNome, excluir, atualizar }