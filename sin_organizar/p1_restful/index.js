const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

app.use(express.json()); // Requerimiento: Parámetros en JSON [cite: 5]

// Función auxiliar para validar parámetros [cite: 7, 8]
const validateParams = (req, requiredFields) => {
    for (const field of requiredFields) {
        if (req.body[field] === undefined) return { error: `Falta el campo: ${field}` };
    }
    return null;
};

// --- TAREAS A IMPLEMENTAR ---

// i. mascaracteres [cite: 10]
app.post('/mascaracteres', (req, res) => {
    const error = validateParams(req, ['str1', 'str2']);
    if (error) return res.status(400).json(error);

    const { str1, str2 } = req.body;
    const result = str1.length >= str2.length ? str1 : str2;
    res.json({ result });
});

// iii. numcaracteres [cite: 12]
app.post('/numcaracteres', (req, res) => {
    const error = validateParams(req, ['str']);
    if (error) return res.status(400).json(error);

    res.json({ length: req.body.str.length });
});

// iv. palindroma [cite: 13]
app.post('/palindroma', (req, res) => {
    const { str } = req.body;
    if (!str) return res.status(400).json({ error: "Cadena requerida" });
    
    const cleanStr = str.toLowerCase().replace(/[\W_]/g, '');
    const isPalindroma = cleanStr === cleanStr.split('').reverse().join('');
    res.json({ result: isPalindroma });
});

// vi. applysha256 [cite: 15]
app.post('/applysha256', (req, res) => {
    const { str } = req.body;
    if (!str) return res.status(400).json({ error: "Cadena requerida" });

    const hash = crypto.createHash('sha256').update(str).digest('hex');
    res.json({ original: str, encriptada: hash });
});

// vii. verifysha256 [cite: 16, 17]
app.post('/verifysha256', (req, res) => {
    const { cadena_normal, cadena_encriptada } = req.body;
    const hash = crypto.createHash('sha256').update(cadena_normal).digest('hex');
    res.json({ coinciden: hash === cadena_encriptada });
});

app.listen(PORT, () => {
    console.log(`Servidor UPIITA corriendo en http://localhost:${PORT}`);
});
