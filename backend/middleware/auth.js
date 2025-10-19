// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {

    console.log('Recebido cabeçalho Authorization:', req.header('Authorization'));
    console.log('Recebido cabeçalho x-auth-token:', req.header('x-auth-token'));
    
    // 1. Tenta buscar o token no cabeçalho padrão 'Authorization: Bearer <token>'
    const authHeader = req.header('Authorization');
    // 2. Tenta buscar o token no cabeçalho customizado 'x-auth-token'
    const xAuthToken = req.header('x-auth-token');

    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Se for Bearer, remove "Bearer " para pegar apenas o token
        token = authHeader.substring(7); 
    } else if (xAuthToken) {
        // Se for o cabeçalho customizado, usa ele
        token = xAuthToken;
    }

    // Se o token ainda for nulo, acesso negado
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // 3. Verifica e decodifica o token usando a chave secreta limpa
        const secret = (process.env.JWT_SECRET || 'fallback_secret').trim();
        const decoded = jwt.verify(token, secret);

        // 4. Adiciona o payload à requisição
        req.usuario = decoded; 

        // 5. Continua para a próxima função (a rota)
        next();
    } catch (e) {
        console.error("Erro na verificação do token:", e.message);
        res.status(400).json({ msg: 'Token inválido.' });
    }
}

module.exports = auth;