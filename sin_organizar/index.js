const express = require('express');
const app = express();
app.use(express.json()); // Requerimiento: Parámetros en JSON
const crypto = require('crypto');

// i. mascaracteres [cite: 10]
app.post('/mascaracteres', (req, res) => {
    const { str1, str2 } = req.body;

    // Validación de parámetros [cite: 7, 8]
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return res.status(400).json({ error: "Ambos parámetros deben ser cadenas de texto." });
    }

    const resultado = str2.length > str1.length ? str2 : str1; // Si son iguales, regresa el 1ero [cite: 10]

    res.json({ resultado: resultado }); // Respuesta en JSON [cite: 6]
});

// ii. menoscaracteres [cite: 11]
app.post('/menoscaracteres', (req, res) => {
    const { str1, str2 } = req.body;

    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return res.status(400).json({ error: "Ambos parámetros deben ser cadenas de texto." });
    }

    const resultado = str2.length < str1.length ? str2 : str1; // Si son iguales, regresa el 1ero [cite: 11]

    res.json({ resultado: resultado });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

// iii. numcaracteres: recibe una cadena y regresa su longitud [cite: 12]
app.post('/numcaracteres', (req, res) => {
    const { str } = req.body;

    if (typeof str !== 'string') {
        return res.status(400).json({ error: "El parámetro 'str' debe ser una cadena." });
    }

    res.json({
        resultado: str.length,
        mensaje: "Operación exitosa"
    });
});

// iv. palindroma: verifica si la cadena se lee igual al derecho y al revés
app.post('/palindroma', (req, res) => {
    const { str } = req.body;

    if (typeof str !== 'string') {
        return res.status(400).json({ error: "El parámetro debe ser una cadena." });
    }

    // Limpiamos la cadena (quitamos espacios y pasamos a minúsculas) para una mejor validación
    const cleanStr = str.toLowerCase().replace(/[\W_]/g, '');
    const reversedStr = cleanStr.split('').reverse().join('');

    const esPalindroma = cleanStr === reversedStr;

    res.json({
        resultado: esPalindroma
    });
});

// v. concat: une dos cadenas iniciando con el primer parámetro [cite: 14]
app.post('/concat', (req, res) => {
    const { str1, str2 } = req.body;

    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return res.status(400).json({ error: "Ambos parámetros str1 y str2 son requeridos." });
    }

    res.json({
        resultado: str1 + str2
    });
});


// vi. applysha256: encripta una cadena y regresa original + hash
app.post('/applysha256', (req, res) => {
    const { str } = req.body;

    if (typeof str !== 'string') {
        return res.status(400).json({ error: "Se requiere una cadena en el campo 'str'." });
    }

    // Generamos el hash SHA256 en formato hexadecimal
    const hash = crypto.createHash('sha256').update(str).digest('hex');

    res.json({
        cadena_original: str,
        cadena_encriptada: hash,
        resultado: "Operación exitosa"
    });
});

// vii. verifysha256: compara una cadena normal contra un hash
app.post('/verifysha256', (req, res) => {
    const { cadena_encriptada, cadena_normal } = req.body;

    // Validación de parámetros requeridos (Punto 1.a.iii)
    if (typeof cadena_encriptada !== 'string' || typeof cadena_normal !== 'string') {
        return res.status(400).json({ error: "Se requieren 'cadena_encriptada' y 'cadena_normal'." });
    }

    // Aplicamos SHA256 a la cadena normal para comparar
    const hashGenerado = crypto.createHash('sha256').update(cadena_normal).digest('hex');
    
    // Comparamos los hashes (Punto 1.b.vii)
    const coinciden = hashGenerado === cadena_encriptada;

    res.json({
        resultado: coinciden
    });
});

