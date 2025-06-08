import { useState, useCallback } from "preact/hooks";
import "./app.css";

// Importa los componentes de sección
import { StudyDashboard } from "./components/StudyDashboard";

// --- Componente para la pantalla de subida de archivos y texto ---
const FileUploadScreen = ({
	onFileSelect,
	onTextSubmit,
	isLoading,
	error,
	onDrag,
	onDrop,
	dragActive,
}) => {
	const [mode, setMode] = useState("pdf"); // 'pdf' o 'text'
	const [textAreaValue, setTextAreaValue] = useState("");

	const handleFormSubmit = (e) => {
		e.preventDefault();
		onTextSubmit(textAreaValue);
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
			<div className="text-center max-w-2xl w-full">
				<header className="mb-8">
					<h1 className="text-5xl font-bold text-slate-800">
						Asistente de Estudio <span className="text-blue-600">IA</span>
					</h1>
					<p className="mt-4 text-lg text-slate-500">
						Transforma tus documentos o texto en resúmenes, flashcards y más.
					</p>
				</header>

				{/* Pestañas para seleccionar el modo de entrada */}
				<div className="mb-6 flex justify-center border-b border-slate-200">
					<button
						onClick={() => setMode("pdf")}
						className={`px-6 py-3 font-semibold transition-colors ${
							mode === "pdf"
								? "border-b-2 border-blue-600 text-blue-600"
								: "text-slate-500 hover:text-blue-600"
						}`}
					>
						Subir PDF
					</button>
					<button
						onClick={() => setMode("text")}
						className={`px-6 py-3 font-semibold transition-colors ${
							mode === "text"
								? "border-b-2 border-blue-600 text-blue-600"
								: "text-slate-500 hover:text-blue-600"
						}`}
					>
						Pegar Texto
					</button>
				</div>

				{/* Renderizado condicional basado en el modo */}
				{mode === "pdf" ? (
					<form
						className={`relative w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col justify-center items-center transition-all ${
							dragActive ? "drop-zone-active" : ""
						}`}
						onDragEnter={onDrag}
						onDragLeave={onDrag}
						onDragOver={onDrag}
						onDrop={onDrop}
					>
						<input
							type="file"
							id="file-upload"
							className="hidden"
							accept=".pdf"
							onChange={(e) => onFileSelect(e.target.files[0])}
						/>
						{isLoading ? (
							<>
								<i className="ph-light ph-circle-notch text-5xl text-blue-500 animate-spin"></i>
								<p className="mt-4 font-medium">Procesando tu PDF...</p>
							</>
						) : (
							<>
								<i className="ph-light ph-file-pdf text-6xl text-slate-400"></i>
								<p className="mt-4 font-semibold text-slate-600">
									Arrastra y suelta tu archivo PDF aquí
								</p>
								<p className="text-slate-500">o</p>
								<label
									htmlFor="file-upload"
									className="cursor-pointer mt-2 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								>
									Selecciona un archivo
								</label>
							</>
						)}
					</form>
				) : (
					<form onSubmit={handleFormSubmit}>
						<textarea
							value={textAreaValue}
							onInput={(e) => setTextAreaValue(e.currentTarget.value)}
							className="w-full h-64 p-4 border-2 border-slate-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							placeholder="Pega tu texto aquí..."
						></textarea>
						<button
							type="submit"
							className="mt-4 bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400"
							disabled={!textAreaValue}
						>
							Analizar Texto
						</button>
					</form>
				)}
				{error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
			</div>
		</div>
	);
};

// --- COMPONENTE PRINCIPAL (ORQUESTADOR) ---
export function App() {
	// --- ESTADO GLOBAL DE LA APLICACIÓN ---
	const [inputText, setInputText] = useState("");
	const [cache, setCache] = useState({}); // Nuevo estado para el caché
	const [isLoadingPdf, setIsLoadingPdf] = useState(false);
	const [isLoadingContent, setIsLoadingContent] = useState(false);
	const [activeTool, setActiveTool] = useState(null);
	const [generatedContent, setGeneratedContent] = useState(null);
	const [error, setError] = useState("");
	const [dragActive, setDragActive] = useState(false);

	// --- MANEJADORES DE LÓGICA ---
	const clearAllData = () => {
		setInputText("");
		setActiveTool(null);
		setGeneratedContent(null);
		setError("");
		setCache({}); // Limpia el caché
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

	const handleToolSelection = async (tool) => {
		if (!inputText) {
			setError("No hay texto para analizar.");
			return;
		}

		setActiveTool(tool);
		setError("");

		// --- LÓGICA DE CACHÉ ---
		if (cache[tool]) {
			setGeneratedContent(cache[tool]);
			return;
		}

		setIsLoadingContent(true);
		setGeneratedContent(null);

		try {
			const response = await fetch("/api/generate-content", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: inputText, tool: tool }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || "La respuesta de la API no fue exitosa."
				);
			}

			const data = await response.json();
			let contentToCache;

			// --- CORRECCIÓN APLICADA AQUÍ ---
			// Lógica robusta para manejar diferentes formatos de respuesta de la API.
			if (tool === "summary") {
				contentToCache = data.summary;
			} else if (tool === "plan") {
				contentToCache = data.plan || [];
			} else if (tool === "flashcards") {
				// Busca el array en la raíz, o dentro de claves comunes como 'flashcards' o 'cards'.
				contentToCache = Array.isArray(data)
					? data
					: data.flashcards || data.cards || [];
			} else if (tool === "quiz") {
				// Busca el array en la raíz, o dentro de claves comunes como 'quiz' o 'questions'.
				contentToCache = Array.isArray(data)
					? data
					: data.quiz || data.questions || [];
			} else {
				// Fallback genérico para cualquier otra herramienta futura.
				contentToCache = data;
			}

			setGeneratedContent(contentToCache);
			setCache((prevCache) => ({
				...prevCache,
				[tool]: contentToCache,
			}));
		} catch (err) {
			console.error("Error al llamar a la API:", err);
			setError(`Error: ${err.message}`);
		} finally {
			setIsLoadingContent(false);
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

	// Se pasa el `error` al dashboard para que pueda ser mostrado
	return (
		<StudyDashboard
			activeTool={activeTool}
			onToolSelect={handleToolSelection}
			onReset={clearAllData}
			isLoadingContent={isLoadingContent}
			generatedContent={generatedContent}
			error={error}
		/>
	);
}
