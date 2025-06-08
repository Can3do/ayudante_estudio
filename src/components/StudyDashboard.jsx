import { ContentDisplay } from "./ContentDisplay";
import { ToolButton } from "./ui/ToolButton";

export const StudyDashboard = ({
	activeTool,
	onToolSelect,
	onRegenerate,
	isLoadingContent,
	isRegenerating,
	generatedContent,
	error,
	isSidebarOpen,
	toggleSidebar,
}) => {
	// Función interna para renderizar el contenido principal de forma condicional
	const renderMainContent = () => {
		// 1. Si está cargando por primera vez, muestra el indicador de carga
		if (isLoadingContent) {
			return (
				<div className="flex flex-col items-center justify-center text-center p-8 h-full">
					<i className="ph-light ph-brain text-5xl text-blue-500 animate-pulse"></i>
					<p className="mt-4 text-lg font-medium">La IA está pensando...</p>
					<p className="text-slate-500">
						Analizando el documento para generar tu contenido.
					</p>
				</div>
			);
		}

		// 2. Si hay contenido generado, lo mapea y muestra
		if (Array.isArray(generatedContent) && generatedContent.length > 0) {
			return (
				<>
					{generatedContent.map((contentBlock, index) => (
						<div
							key={index}
							className="mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-md border border-slate-200"
						>
							<ContentDisplay
								activeTool={activeTool}
								generatedContent={contentBlock} // Pasa cada bloque individual
							/>
						</div>
					))}
					{/* Botón para volver a generar */}
					<div className="mt-6 flex justify-center">
						<button
							onClick={onRegenerate}
							disabled={isRegenerating}
							className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
						>
							{isRegenerating ? (
								<>
									<i className="ph-light ph-circle-notch animate-spin"></i>
									<span>Generando...</span>
								</>
							) : (
								<>
									<i className="ph-light ph-sparkle"></i>
									<span>Volver a generar</span>
								</>
							)}
						</button>
					</div>
				</>
			);
		}

		// 3. Si no hay contenido ni está cargando, y no hay error, muestra el mensaje inicial
		if (!error) {
			return (
				<div className="flex flex-col items-center justify-center text-center p-8 h-full bg-slate-100 rounded-xl">
					<i className="ph-light ph-sparkle text-5xl text-slate-400"></i>
					<p className="mt-4 text-lg font-medium">Selecciona una herramienta</p>
					<p className="text-slate-500">
						Elige una opción del panel izquierdo para comenzar.
					</p>
				</div>
			);
		}

		// 4. Si ninguna de las condiciones anteriores se cumple (por ejemplo, hay un error pero no hay contenido), no muestra nada.
		return null;
	};

	return (
		// --- CAMBIO 1: Se cambia min-h-full a h-full para asegurar que el contenedor tenga una altura definida ---
		<div className="relative h-full md:flex">
			{/* Overlay para móvil */}
			{isSidebarOpen && (
				<div
					onClick={toggleSidebar}
					className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
				></div>
			)}

			{/* Menú Lateral (Sidebar) */}
			<aside
				className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 p-6 flex flex-col w-72 transform transition-transform duration-300 ease-in-out z-30 md:relative md:translate-x-0 ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<i className="ph-bold ph-brain text-3xl text-blue-600"></i>
						<h1 className="text-xl font-bold">Asistente IA</h1>
					</div>
					<button
						onClick={toggleSidebar}
						className="md:hidden text-slate-500 hover:text-slate-800"
					>
						<i className="ph-bold ph-x text-2xl"></i>
					</button>
				</div>
				<nav className="flex flex-col space-y-2">
					<ToolButton
						icon="text-align-left"
						label="Resumen"
						tool="summary"
						activeTool={activeTool}
						onClick={onToolSelect}
					/>
					<ToolButton
						icon="cards"
						label="Flashcards"
						tool="flashcards"
						activeTool={activeTool}
						onClick={onToolSelect}
					/>
					<ToolButton
						icon="question"
						label="Ejercicios"
						tool="quiz"
						activeTool={activeTool}
						onClick={onToolSelect}
					/>
					<ToolButton
						icon="calendar-check"
						label="Plan de Estudio"
						tool="plan"
						activeTool={activeTool}
						onClick={onToolSelect}
					/>
					<ToolButton
						icon="book-open"
						label="Glosario"
						tool="glossary"
						activeTool={activeTool}
						onClick={onToolSelect}
					/>
				</nav>
			</aside>

			{/* --- CAMBIO 2: Se reestructura el <main> para que sea un contenedor flex en columna --- */}
			<main className="flex-1 flex flex-col h-full">
				<header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b md:hidden">
					<h2 className="text-lg font-bold text-slate-700 capitalize">
						{activeTool || "Dashboard"}
					</h2>
					<button
						onClick={toggleSidebar}
						className="text-slate-600 hover:text-slate-900"
					>
						<i className="ph-bold ph-list text-2xl"></i>
					</button>
				</header>

				{/* --- CAMBIO 3: Este div ahora es el área de scroll --- */}
				<div className="flex-1 p-4 sm:p-8 overflow-y-auto">
					<div className="max-w-4xl mx-auto">
						{error && (
							<div
								className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
								role="alert"
							>
								{error}
							</div>
						)}

						{renderMainContent()}
					</div>
				</div>
			</main>
		</div>
	);
};
