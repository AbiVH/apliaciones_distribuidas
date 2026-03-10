const express = require('express');
const app = express();
app.use(express.json());

// --- BASE DE DATOS EN MEMORIA (Ejercicio 3) ---
let tareas = []; // 

// --- MIDDLEWARE DE VALIDACIÓN GENÉRICO ---
const responder = (res, status, data, error = null) => {
    const response = { estado: status, ...data };
    if (error) response.error = error;
    return res.json(response);
};

// Ejercicio 1: Saludo Básico [cite: 28]
app.post('/saludo', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return responder(res, 400, {}, "Nombre es requerido");
    responder(res, 200, { mensaje: `Hola, ${nombre}` }); // [cite: 30]
});

// Ejercicio 2: Calculadora [cite: 31]
app.post('/calcular', (req, res) => {
    const { a, b, operacion } = req.body;
    let resultado;

    try {
        switch (operacion) {
            case 'suma': resultado = a + b; break;
            case 'resta': resultado = a - b; break;
            case 'multiplicacion': resultado = a * b; break;
            case 'division': 
                if (b === 0) throw new Error("División por cero"); // [cite: 33]
                resultado = a / b; 
                break;
            default: throw new Error("Operación no válida");
        }
        responder(res, 200, { resultado });
    } catch (e) {
        responder(res, 400, {}, e.message);
    }
});

// Ejercicio 3: CRUD de Tareas [cite: 34]
app.get('/tareas', (req, res) => responder(res, 200, { tareas })); // Listar [cite: 37]

app.post('/tareas', (req, res) => {
    const { id, titulo, completada } = req.body; // [cite: 36]
    tareas.push({ id, titulo, completada });
    responder(res, 201, { mensaje: "Tarea creada", tareas });
});

app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    tareas = tareas.filter(t => t.id !== parseInt(id)); // [cite: 39]
    responder(res, 200, { mensaje: "Tarea eliminada" });
});

// Ejercicio 4: Validador de Password [cite: 42]
app.post('/validar-password', (req, res) => {
    const { password } = req.body;
    const errores = [];

    if (password.length < 8) errores.push("Mínimo 8 caracteres"); // [cite: 44]
    if (!/[A-Z]/.test(password)) errores.push("Al menos una mayúscula"); // [cite: 44]
    if (!/[a-z]/.test(password)) errores.push("Al menos una minúscula"); // [cite: 44]
    if (!/[0-9]/.test(password)) errores.push("Al menos un número"); // [cite: 44]

    responder(res, 200, { 
        esValida: errores.length === 0, 
        errores: errores 
    }); // [cite: 45]
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Segunda práctica en puerto ${PORT}`));

// Ejercicio 5: Conversor de Temperatura
app.post('/convertir-temperatura', (req, res) => {
    const { valor, desde, hacia } = req.body;

    // Validación de parámetros [cite: 26]
    if (valor === undefined || !desde || !hacia) {
        return responder(res, 400, {}, "Faltan parámetros (valor, desde, hacia)");
    }

    let resultado;
    // Normalizamos a Celsius primero para facilitar la conversión [cite: 49]
    let tempEnC;
    if (desde === 'C') tempEnC = valor;
    else if (desde === 'F') tempEnC = (valor - 32) * 5 / 9;
    else if (desde === 'K') tempEnC = valor - 273.15;
    else return responder(res, 400, {}, "Escala 'desde' no válida (C|F|K)");

    // Convertimos de Celsius al destino [cite: 50]
    if (hacia === 'C') resultado = tempEnC;
    else if (hacia === 'F') resultado = (tempEnC * 9 / 5) + 32;
    else if (hacia === 'K') resultado = tempEnC + 273.15;
    else return responder(res, 400, {}, "Escala 'hacia' no válida (C|F|K)");

    responder(res, 200, {
        valorOriginal: valor,
        valorConvertido: Number(resultado.toFixed(2)),
        escalaOriginal: desde,
        escalaConvertida: hacia
    });
});

// Ejercicio 6: Buscador en Array
app.post('/buscar', (req, res) => {
    const { array, elemento } = req.body;

    // Validación: que el array sea realmente un arreglo [cite: 26]
    if (!Array.isArray(array)) {
        return responder(res, 400, {}, "El campo 'array' debe ser un arreglo válido");
    }

    const indice = array.indexOf(elemento);
    const encontrado = indice !== -1;

    responder(res, 200, {
        encontrado: encontrado,
        indice: indice,
        tipoElemento: typeof elemento
    });
});

// Ejercicio 7: Contador de Palabras
app.post('/contar-palabras', (req, res) => {
    const { texto } = req.body;

    if (typeof texto !== 'string') {
        return responder(res, 400, {}, "El campo 'texto' debe ser una cadena");
    }

    // Limpiamos el texto de espacios extra y dividimos por palabras [cite: 55]
    const palabras = texto.trim().split(/\s+/).filter(p => p.length > 0);
    const palabrasUnicas = new Set(palabras.map(p => p.toLowerCase())).size;

    responder(res, 200, {
        totalPalabras: palabras.length,
        totalCaracteres: texto.length,
        palabrasUnicas: palabrasUnicas
    });
});





