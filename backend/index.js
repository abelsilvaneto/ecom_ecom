const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

const authMiddleware = require('./middleware/auth.middleware')
const authController = require('./controller/auth.controller')
const usuarioController = require('./controller/usuario.controller')
const produtoController = require('./controller/produto.controller')
const movimentoController = require('./controller/movimento.controller')
const relatVwController = require('./controller/relatVW.controller')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Aplicação rodando!!!' })
})

app.post('/login', authController)
app.post('/usuario', usuarioController.cadastrar)


app.use(authMiddleware)

// ------- Rotas Privadas -------

app.get('/usuarios', usuarioController.listar)
app.get('/usuario/:id', usuarioController.buscarPorCod)
app.get('/usuario/buscar/:nome', usuarioController.buscarPorNome)
app.delete('/usuario/:id', usuarioController.excluir)
app.put('/usuario/:id', usuarioController.atualizar)

app.post('/produto', produtoController.cadastrar)
app.get('/produtos', produtoController.listar)
app.get('/produto/:id', produtoController.buscarPorCod)
app.get('/produto/buscar/:nome', produtoController.buscarPorNome)
app.delete('/produto/:id', produtoController.excluir)
app.put('/produto/:id', produtoController.atualizar)


app.post('/movimento', movimentoController.cadastrar)
app.get('/movimentos', movimentoController.listar)

app.get('/relatorio/categorias', relatVwController.listarPorCategorias)
app.get('/relatorio/saidas', relatVwController.listarHistoricoSaidas)

conn.sync()
    .then(() => {
        app.listen(PORT, hostname, () => {
            console.log(`Servidor rodando em http://${hostname}:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro de conexão com o banco de dados!', err)
    })