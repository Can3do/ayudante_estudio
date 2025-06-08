// Importa el cliente de OpenAI
import OpenAI from "openai";

// --- PROMPTS PARA CADA HERRAMIENTA ---
const getPrompt = (tool, text) => {
	const commonInstructions = `Analiza el siguiente texto y genera el contenido solicitado. El texto es: """${text}"""`;

	switch (tool) {
		case "summary":
			// Este prompt pide texto plano, por lo que no debe forzarse a JSON.
			return `
                ${commonInstructions}
                Tarea: Genera un resumen conciso y claro del texto. Debe capturar las ideas principales y los puntos clave.
            `;
		case "flashcards":
			return `
                ${commonInstructions}
                Tarea: Genera 3 flashcards. Tu respuesta DEBE ser un objeto JSON VÁLIDO y nada más. El objeto raíz debe tener una única clave llamada "flashcards", cuyo valor es un array de objetos. Cada objeto del array debe tener las claves "question" y "answer".
                Ejemplo de formato: {"flashcards": [{"question": "Pregunta 1", "answer": "Respuesta 1"}]}
            `;
		case "quiz":
			return `
                ${commonInstructions}
                Tarea: Genera 2 preguntas de quiz. Tu respuesta DEBE ser un objeto JSON VÁLIDO y nada más. El objeto raíz debe tener una única clave llamada "quiz", cuyo valor es un array de objetos. Cada objeto debe tener una clave "question", un array de 4 strings en "options" y el índice de la respuesta correcta en "answer".
                Ejemplo de formato: {"quiz": [{"question": "Pregunta", "options": ["A", "B", "C", "D"], "answer": 1}]}
            `;
		case "plan":
			return `
                Analiza el siguiente texto: """${text}"""
                Tu tarea es generar un plan de estudio de 4 días. Tu respuesta DEBE ser un objeto JSON VÁLIDO y nada más. El objeto raíz debe tener una única clave llamada "plan", cuyo valor es un array de objetos. Cada objeto debe tener las claves "day" y "task".
                Ejemplo de formato: {"plan": [{"day": "Día 1", "task": "Tarea 1"}]}
            `;
		default:
			return null;
	}
};

export const handler = async (event) => {
	if (event.httpMethod !== "POST") {
		return { statusCode: 405, body: "Method Not Allowed" };
	}

	try {
		const { text, tool } = JSON.parse(event.body);

		if (!text || !tool || !process.env.OPENAI_API_KEY) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					error:
						"Faltan parámetros: texto, herramienta y clave API son requeridos.",
				}),
			};
		}

		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		const prompt = getPrompt(tool, text);

		if (!prompt) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: "Herramienta no válida." }),
			};
		}

		console.log(`Ejecutando la API de OpenAI para la herramienta: ${tool}`);

		const response = await openai.chat.completions.create({
			model: "gpt-4.1-nano",
			messages: [{ role: "user", content: prompt }],
			// --- CORRECCIÓN APLICADA AQUÍ ---
			// El formato de respuesta ahora es condicional.
			// Para 'summary', permite texto. Para el resto, fuerza un objeto JSON.
			response_format:
				tool === "summary" ? { type: "text" } : { type: "json_object" },
		});

		const content = response.choices[0].message.content;

		return {
			statusCode: 200,
			headers: { "Content-Type": "application/json" },
			// La lógica para envolver el resumen en un JSON se mantiene, lo cual es correcto.
			body: tool === "summary" ? JSON.stringify({ summary: content }) : content,
		};
	} catch (error) {
		console.error("Error en la función de Netlify:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: "Ocurrió un error al procesar tu solicitud.",
			}),
		};
	}
};
