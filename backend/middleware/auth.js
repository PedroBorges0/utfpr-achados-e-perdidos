const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    console.log('Recebido cabeçalho Authorization:', req.header('Authorization'));
    console.log('Recebido cabeçalho x-auth-token:', req.header('x-auth-token'));

    const authHeader = req.header('Authorization');
    const xAuthToken = req.header('x-auth-token');

    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    } else if (xAuthToken) {
        token = xAuthToken;
    }

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const secret = (process.env.JWT_SECRET || 'fallback_secret').trim();

        // 🔐 Log para verificar qual segredo está sendo usado para validar
        console.log('🔐 Segredo usado para validar token:', secret);

        const decoded = jwt.verify(token, secret);
        req.usuario = decoded;
        next();
    } catch (e) {
        console.error("Erro na verificação do token:", e.message);
        res.status(400).json({ msg: 'Token inválido.' });
    }
}

module.exports = auth;