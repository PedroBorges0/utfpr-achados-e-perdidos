const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');

const router = express.Router();

const getJwtSecret = () => (process.env.JWT_SECRET || 'fallback_secret_for_dev_mode').trim();

// =========================================================
// CADASTRAR USUÁRIO
// =========================================================

router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'Email já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      telefone: telefone || null,
    });

    return res.status(201).json({ msg: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    return res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// =========================================================
// LOGIN
// =========================================================

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ msg: 'Credenciais inválidas.' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ msg: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: usuario.id_usuario, nome: usuario.nome },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      msg: 'Login bem-sucedido!',
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// =========================================================
// PERFIL DO USUÁRIO LOGADO
// =========================================================

router.get('/me', auth, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ['id_usuario', 'nome', 'email', 'telefone', 'tipo', 'ativo'],
    });

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    return res.status(200).json(usuario);
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    return res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

module.exports = router;