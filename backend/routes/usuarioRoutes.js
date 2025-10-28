const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

// --- Rota de Cadastro ---
router.post('/register', async (req, res) => {
    console.log('Dados recebidos no req.body:', req.body);

    const { nome, email, senha, telefone, tipo } = req.body || {};

    if (!nome || !email || !senha) {
        return res.status(400).json({ msg: 'Nome, email e senha são obrigatórios.' });
    }

    try {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'Email já cadastrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada,
            telefone: telefone || null,
            tipo: tipo || 'aluno'
        });

        res.status(201).json({
            msg: 'Usuário cadastrado com sucesso!',
            usuario: {
                id: novoUsuario.id_usuario,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        });

    } catch (err) {
        console.error('Erro no cadastro:', err);
        res.status(500).json({ msg: 'Erro interno no servidor ao tentar cadastrar.' });
    }
});

// --- Rota de Login ---
router.post('/login', async (req, res) => {
    console.log('Login recebido:', req.body);
    const { email, senha } = req.body || {};

    if (!email || !senha) {
        return res.status(400).json({ msg: 'Email e senha são obrigatórios.' });
    }

    try {
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(401).json({ msg: 'Credenciais inválidas.' });

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) return res.status(401).json({ msg: 'Credenciais inválidas.' });

        const jwtSecret = (process.env.JWT_SECRET || 'sua_chave_secreta_padrao_insegura').trim();

        console.log(' Segredo usado para criar token:', jwtSecret);

        const payload = { id: usuario.id_usuario, nome: usuario.nome };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

        res.status(200).json({
            msg: 'Login bem-sucedido!',
            token,
            usuario: {
                id: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ msg: 'Erro interno no servidor ao tentar fazer login.' });
    }
});

module.exports = router;