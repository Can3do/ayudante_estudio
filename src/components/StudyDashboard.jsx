import { ContentDisplay } from "./ContentDisplay";
import { ToolButton } from "./ui/ToolButton";

export const StudyDashboard = ({
	activeTool,
	onToolSelect,
	onReset,
	isLoadingContent,
	generatedContent,
}) => {
	return (
		<div className="flex h-screen w-full bg-slate-50">
			<aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col">
				<div className="flex items-center gap-3 mb-8">
					<i className="ph-bold ph-brain text-3xl text-blue-600"></i>
					<h1 className="text-xl font-bold">Asistente IA</h1>
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
				</nav>
				<div className="mt-auto">
					<button
						onClick={onReset}
						className="w-full flex items-center justify-center gap-2 text-slate-600 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors"
					>
						<i className="ph ph-arrow-left"></i>
						Cargar otro PDF
					</button>
				</div>
			</aside>
			<main className="flex-1 p-8 overflow-y-auto">
				<div className="max-w-4xl mx-auto">
					<ContentDisplay
						isLoading={isLoadingContent}
						activeTool={activeTool}
						generatedContent={generatedContent}
					/>
				</div>
			</main>
		</div>
	);
};
