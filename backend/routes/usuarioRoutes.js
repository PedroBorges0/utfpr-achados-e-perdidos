// backend/routes/usuarioRoutes.js (versão corrigida e validada)
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth'); // Middleware de autenticação

const router = express.Router();

// Função auxiliar para obter a chave secreta JWT
const getJwtSecret = () => (process.env.JWT_SECRET || 'fallback_secret_for_dev_mode').trim();

// =========================================================
// ROTA 1: CADASTRO DE USUÁRIO (POST)
// =========================================================
// POST /api/usuarios/cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'Email já cadastrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    await Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
    });

    res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('❌ Erro no cadastro:', err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// =========================================================
// ROTA 2: LOGIN DE USUÁRIO (POST - GERA TOKEN)
// =========================================================
// POST /api/usuarios/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ msg: 'Email e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ msg: 'Credenciais inválidas.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ msg: 'Credenciais inválidas.' });
    }

    const jwtSecret = getJwtSecret();

    // --- GERAÇÃO DO TOKEN JWT ---
    const token = jwt.sign(
      { id: usuario.id_usuario, nome: usuario.nome },
      jwtSecret,
      { expiresIn: '24h' }
    );

    const usuarioDados = {
      id: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
    };

    res.status(200).json({
      msg: 'Login bem-sucedido!',
      token,
      usuario: usuarioDados,
    });
  } catch (err) {
    console.error('❌ Erro no login:', err);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// =========================================================
// ROTA 3: BUSCAR PERFIL DO USUÁRIO LOGADO (GET /me - PROTEGIDA)
// =========================================================
// GET /api/usuarios/me
router.get('/me', auth, async (req, res) => {
  try {
    const idUsuarioLogado = req.usuario.id;

    const usuario = await Usuario.findByPk(idUsuarioLogado, {
      attributes: ['id_usuario', 'nome', 'email', 'telefone', 'tipo', 'ativo'],
    });

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error('❌ Erro ao buscar perfil:', err);
    res.status(500).json({ msg: 'Erro no servidor ao buscar perfil.' });
  }
});

module.exports = router; 