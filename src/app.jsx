import { useState, useCallback } from "preact/hooks";
import "./app.css";

// Importa los componentes de sección
import { FileUploadScreen } from "./components/FileUploadScreen";
import { StudyDashboard } from "./components/StudyDashboard";

// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
export function App() {
	// --- ESTADO GLOBAL DE LA APLICACIÓN ---
	const [pdfText, setPdfText] = useState("");
	const [isLoadingPdf, setIsLoadingPdf] = useState(false);
	const [isLoadingContent, setIsLoadingContent] = useState(false);
	const [activeTool, setActiveTool] = useState(null);
	const [generatedContent, setGeneratedContent] = useState(null);
	const [error, setError] = useState("");
	const [dragActive, setDragActive] = useState(false);

	// --- MANEJADORES DE LÓGICA ---

	const handleFile = useCallback(async (file) => {
		if (!file || file.type !== "application/pdf") {
			setError("Por favor, selecciona un archivo PDF válido.");
			return;
		}

		setError("");
		setIsLoadingPdf(true);
		setPdfText("");
		setActiveTool(null);
		setGeneratedContent(null);

		try {
			const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");
			pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.31/build/pdf.worker.mjs`;
			const reader = new FileReader();
			reader.onload = async (e) => {
				try {
					const typedarray = new Uint8Array(e.target.result);
					const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
					let fullText = "";
					for (let i = 1; i <= pdf.numPages; i++) {
						const page = await pdf.getPage(i);
						const textContent = await page.getTextContent();
						fullText +=
							textContent.items.map((item) => item.str).join(" ") + "\n\n";
					}
					setPdfText(fullText);
				} catch (e) {
					console.error("Error al procesar el PDF:", e);
					setError("No se pudo leer el contenido del PDF.");
				} finally {
					setIsLoadingPdf(false);
				}
			};
			reader.readAsArrayBuffer(file);
		} catch (e) {
			console.error("Error al cargar PDF.js:", e);
			setError("Ocurrió un error al cargar las herramientas de lectura.");
			setIsLoadingPdf(false);
		}
	}, []);

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
		else if (e.type === "dragleave") setDragActive(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
	};

	const handleReset = () => {
		setPdfText("");
		setActiveTool(null);
		setGeneratedContent(null);
		setError("");
	};

	const handleToolSelection = async (tool) => {
		// 1. Validaciones iniciales
		if (!pdfText) {
			setError("Primero debes cargar un PDF.");
			return;
		}

		// 2. Prepara la UI para la carga
		setActiveTool(tool);
		setIsLoadingContent(true);
		setGeneratedContent(null);
		setError("");

		// 3. Bloque try...catch para manejar la llamada a la API y los errores
		try {
			// Llamada a la Netlify Function usando la ruta relativa
			const response = await fetch("/api/generate-content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				// Envía el texto del PDF, la herramienta seleccionada y la clave
				body: JSON.stringify({
					text: pdfText,
					tool: tool,
				}),
			});

			// 4. Manejo de la respuesta del backend
			if (!response.ok) {
				// Si la respuesta no es exitosa (ej: error 400 o 500), lee el error
				const errorData = await response.json();
				throw new Error(
					errorData.error || "La respuesta de la API no fue exitosa."
				);
			}

			const data = await response.json();

			// 5. Guarda el contenido generado en el estado
			// Si es un resumen, el contenido está en data.summary.
			// Para los otros casos, data es directamente el objeto/array JSON.
			if (tool === "summary") {
				setGeneratedContent(data.summary);
			} else {
				setGeneratedContent(data);
			}
		} catch (err) {
			// Si algo falla, muestra el error en la UI
			console.error("Error al llamar a la API:", err);
			setError(`Error: ${err.message}`);
		} finally {
			// 6. Pase lo que pase, quita el indicador de carga
			setIsLoadingContent(false);
		}
	};

	// Renderiza una vista u otra dependiendo de si se ha cargado un PDF
	if (!pdfText) {
		return (
			<FileUploadScreen
				onFileSelect={handleFile}
				isLoading={isLoadingPdf}
				error={error}
				onDrag={handleDrag}
				onDrop={handleDrop}
				dragActive={dragActive}
			/>
		);
	}

	return (
		<StudyDashboard
			activeTool={activeTool}
			onToolSelect={handleToolSelection}
			onReset={handleReset}
			isLoadingContent={isLoadingContent}
			generatedContent={generatedContent}
		/>
	);
}
