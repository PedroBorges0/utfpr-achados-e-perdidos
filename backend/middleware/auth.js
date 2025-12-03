// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Função auxiliar para obter a chave secreta com fallback
const getJwtSecret = () => (process.env.JWT_SECRET || 'fallback_secret_for_dev_mode').trim();

// Middleware de autenticação
module.exports = function (req, res, next) {
    // Tenta buscar o token no cabeçalho padrão 'Authorization: Bearer <token>'
    const authHeader = req.header('Authorization');
    const xAuthToken = req.header('x-auth-token');

    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7, authHeader.length).trim();
    } else if (xAuthToken) {
        token = xAuthToken;
    }

    if (!token) {
        return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
    }

    try {
        const jwtSecret = getJwtSecret();
        
        // Verifica o token usando a chave consistente
        const decoded = jwt.verify(token, jwtSecret); 
        
        // Adiciona o payload (ID e Nome) à requisição
        req.usuario = decoded; 
        
        next(); 

    } catch (err) {
        console.error('Erro na verificação do token:', err.message); 
        return res.status(401).json({ msg: 'Token inválido ou expirado.' });
    }
};