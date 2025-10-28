// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Função para obter o segredo JWT (usando variável de ambiente ou fallback)
const getJwtSecret = () => (process.env.JWT_SECRET || 'fallback_secret_for_dev_mode').trim();

// Middleware de autenticação
module.exports = function (req, res, next) {
    // Log de diagnóstico (útil em desenvolvimento)
    console.log('Recebido cabeçalho Authorization:', req.header('Authorization'));
    console.log('Recebido cabeçalho x-auth-token:', req.header('x-auth-token'));

    let token = null;

    // 1. Verifica se existe cabeçalho Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
    }

    // 2. Alternativa: tenta cabeçalho x-auth-token (para compatibilidade)
    if (!token) {
        token = req.header('x-auth-token');
    }

    // 3. Se ainda não houver token → erro 401
    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // Obtém o segredo usado para validar o token
        const secret = getJwtSecret();

        // Log do segredo usado (apenas em ambiente de desenvolvimento)
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔐 Segredo usado para validar token:', secret);
        }

        // 4. Verifica e decodifica o token JWT
        const decoded = jwt.verify(token, secret);

        // 5. Anexa os dados do usuário decodificado ao objeto de requisição
        req.usuario = decoded;

        // 6. Continua para a próxima função ou rota
        next();
    } catch (err) {
        console.error('Erro na verificação do token:', err.message);
        return res.status(401).json({ msg: 'Token inválido ou expirado.' });
    }
};