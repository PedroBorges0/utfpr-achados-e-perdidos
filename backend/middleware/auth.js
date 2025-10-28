<<<<<<< HEAD
// backend/middleware/auth.js (CORRIGIDO PARA JAVASCRIPT PURO)

const jwt = require('jsonwebtoken');

// A função que garante que o segredo usado no login é o mesmo usado na verificação
const getJwtSecret = () => (process.env.JWT_SECRET || 'fallback_secret_for_dev_mode').trim();

// Middleware de autenticação
module.exports = function (req, res, next) {
    let token = req.header('Authorization');

    // 1. Tenta extrair do cabeçalho "Authorization: Bearer <token>"
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trim();
    } 
    
    // Fallback: Tenta usar o cabeçalho X-Auth-Token (legacy)
    if (!token) {
        token = req.header('x-auth-token'); 
    }

    // Verifica se o token existe após todas as tentativas
    if (!token) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    try {
        const jwtSecret = getJwtSecret();
        
        // Verifica o token usando a chave consistente
        // NOTA: A tipagem (err: any) foi removida do catch para evitar o erro de sintaxe.
        const decoded = jwt.verify(token, jwtSecret); 
        
        // Adiciona o usuário do token (id e nome) ao objeto de requisição
        req.usuario = decoded; 
        
        next(); // Passa para a próxima função (a rota)

    } catch (err) { // <--- CORRIGIDO: Removida a tipagem ": any"
        console.error('Erro na verificação do token:', err.message); 
        return res.status(401).json({ msg: 'Token inválido ou expirado.' });
    }
};

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
