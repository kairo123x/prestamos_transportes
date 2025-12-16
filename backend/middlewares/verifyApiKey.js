export const apiKeys = new Map();

export function verifyApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ success: false, message: 'Acceso no autorizado' });
  }

  if (!apiKeys.has(apiKey)) {
    return res.status(401).json({ success: false, message: 'Las credenciales son incorrectas' });
  }

  req.user = apiKeys.get(apiKey);
  next();
}

