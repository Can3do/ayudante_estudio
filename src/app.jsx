import { useState, useCallback, useRef } from "preact/hooks";
import "./app.css";

// Importa los componentes de sección
import { StudyDashboard } from "./components/StudyDashboard";
import { FileUploadScreen } from "./components/FileUploadScreen";

// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
export function App() {
	// --- ESTADO GLOBAL DE LA APLICACIÓN ---
	const [inputText, setInputText] = useState("");
	const [cache, setCache] = useState({});
	const [isLoadingPdf, setIsLoadingPdf] = useState(false);
	const [isLoadingContent, setIsLoadingContent] = useState(false);
	const [isRegenerating, setIsRegenerating] = useState(false);
	const [activeTool, setActiveTool] = useState(null);
	const [generatedContent, setGeneratedContent] = useState(null);
	const [error, setError] = useState("");
	const [dragActive, setDragActive] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const abortControllerRef = useRef(null);

	// --- MANEJADORES DE LÓGICA ---
	const clearAllData = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		setInputText("");
		setActiveTool(null);
		setGeneratedContent(null);
		setError("");
		setCache({});
		setIsSidebarOpen(false);
	};

	const handleFile = useCallback(async (file) => {
		if (!file || file.type !== "application/pdf") {
			setError("Por favor, selecciona un archivo PDF válido.");
			return;
		}
		clearAllData();
		setIsLoadingPdf(true);

		try {
			const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");
			pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

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
					setInputText(fullText);
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

	const handleTextSubmit = (text) => {
		if (!text || !text.trim()) {
			setError("Por favor, introduce algo de texto para analizar.");
			return;
		}
		clearAllData();
		setInputText(text);
	};

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

	const handleToolSelection = async (tool, isRegenerating = false) => {
		if (!inputText) {
			setError("No hay texto para analizar.");
			return;
		}

		const currentTool = isRegenerating ? activeTool : tool;

		if (!isRegenerating) {
			setActiveTool(tool);
			setError("");
			setIsSidebarOpen(false);
			if (cache[tool]) {
				setGeneratedContent(cache[tool]);
				return;
			}
		}

		if (isRegenerating) {
			setIsRegenerating(true);
		} else {
			setIsLoadingContent(true);
			setGeneratedContent(null);
		}

		try {
			abortControllerRef.current = new AbortController();

			const response = await fetch("/api/generate-content", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: inputText, tool: currentTool }),
				signal: abortControllerRef.current.signal,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || "La respuesta de la API no fue exitosa."
				);
			}

			const data = await response.json();
			let newContentBlock;

			if (currentTool === "summary") {
				newContentBlock = data.summary;
			} else if (currentTool === "plan") {
				newContentBlock = data.plan || [];
			} else if (currentTool === "glossary") {
				newContentBlock = data.glossary || [];
			} else if (currentTool === "flashcards") {
				newContentBlock = data.flashcards || [];
			} else if (currentTool === "quiz") {
				newContentBlock = data.quiz || [];
			} else {
				newContentBlock = data;
			}

			const newGeneratedContent = isRegenerating
				? [...(generatedContent || []), newContentBlock]
				: [newContentBlock];

			setGeneratedContent(newGeneratedContent);
			setCache((prevCache) => ({
				...prevCache,
				[currentTool]: newGeneratedContent,
			}));
		} catch (err) {
			if (err.name !== "AbortError") {
				console.error("Error al llamar a la API:", err);
				setError(`Error: ${err.message}`);
			} else {
				console.log("Petición abortada por el usuario.");
			}
		} finally {
			if (isRegenerating) {
				setIsRegenerating(false);
			} else {
				setIsLoadingContent(false);
			}
		}
	};

	if (!inputText) {
		return (
			<FileUploadScreen
				onFileSelect={handleFile}
				onTextSubmit={handleTextSubmit}
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
			onToolSelect={(tool) => handleToolSelection(tool, false)}
			onRegenerate={() => handleToolSelection(activeTool, true)}
			onReset={clearAllData}
			isLoadingContent={isLoadingContent}
			isRegenerating={isRegenerating}
			generatedContent={generatedContent}
			error={error}
			isSidebarOpen={isSidebarOpen}
			toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
		/>
	);
}
