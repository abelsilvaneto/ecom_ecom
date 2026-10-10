const Usuario = require('../models/Usuario')
const cryptojs = require('crypto-js')

const CHAVE_SECRETA = 'chave_baixa'

const login = async (req, res) => {
    const valores = req.body

    if (!valores.email || !valores.senha) {
        return res.status(400).json({ message: 'Campos de email e senha são obrigatórios' })
    }

    try {
        const usuario = await Usuario.findOne({ where: { email: valores.email } })

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const bytes = cryptojs.AES.decrypt(usuario.senha, CHAVE_SECRETA)
        const senhaDescriptografada = bytes.toString(cryptojs.enc.Utf8)

        if (valores.senha !== senhaDescriptografada) {
            return res.status(401).json({ message: 'Senha incorreta, não autorizado' })
        }

        const horasEmMs = 1.5 * 60 * 60 * 1000
        const tempoExpirar = Date.now() + horasEmMs

        const payload = {
            idUsuario: usuario.codUsuario,
            nome: usuario.nome,
            expiraEm: tempoExpirar
        }

        const token = cryptojs.AES.encrypt(JSON.stringify(payload), CHAVE_SECRETA).toString()

        return res.status(200).json({
            message: 'Login realizado com sucesso',
            nome: usuario.nome,
            token: token
        })

    } catch (err) {
        console.error('Não foi possível fazer o login', err)
        return res.status(500).json({ message: 'Não foi possível fazer o login' })
    }
}

module.exports = login