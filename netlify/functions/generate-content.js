// Importa el cliente de OpenAI
import OpenAI from "openai";

// --- PROMPTS PARA CADA HERRAMIENTA ---
const getPrompt = (tool, text) => {
	const commonInstructions = `Analiza el siguiente texto y genera el contenido solicitado. El texto es: """${text}"""`;
	// ... (El resto de esta función no cambia)
	switch (tool) {
		case "summary":
			return `
                ${commonInstructions}
                Tarea: Genera un resumen conciso y claro del texto. Debe capturar las ideas principales y los puntos clave.
            `;
		case "flashcards":
			return `
                ${commonInstructions}
                Tarea: Genera 3 flashcards en formato JSON. Cada flashcard debe tener una pregunta ('question') y una respuesta ('answer').
                Ejemplo de formato de respuesta: [{"question": "Pregunta 1", "answer": "Respuesta 1"}, ...]
            `;
		case "quiz":
			return `
                ${commonInstructions}
                Tarea: Genera 2 preguntas de opción múltiple (quiz) en formato JSON. Cada pregunta debe tener un enunciado ('question'), un array de 4 opciones ('options') y el índice de la respuesta correcta ('answer', de 0 a 3).
                Ejemplo de formato de respuesta: [{"question": "Pregunta 1", "options": ["Opción A", "Opción B", "Opción C", "Opción D"], "answer": 1}, ...]
            `;
		case "plan":
			return `
                ${commonInstructions}
                Tarea: Genera un plan de estudio simple de 4 días en formato JSON. Cada día debe tener una propiedad 'day' y una 'task'.
                Ejemplo de formato de respuesta: [{"day": "Día 1", "task": "Tarea del día 1"}, ...]
            `;
		default:
			return null;
	}
};

export const handler = async (event) => {
	// Solo permitir peticiones POST
	if (event.httpMethod !== "POST") {
		return { statusCode: 405, body: "Method Not Allowed" };
	}

	try {
		const { text, tool } = JSON.parse(event.body);

		// --- CORRECCIÓN APLICADA AQUÍ ---
		// La validación ahora comprueba si la clave de API NO existe.
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
			model: "gpt-4o-mini",
			messages: [{ role: "user", content: prompt }],
			response_format:
				tool !== "summary" ? { type: "json_object" } : { type: "text" },
		});

		const content = response.choices[0].message.content;

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: tool !== "summary" ? content : JSON.stringify({ summary: content }),
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
