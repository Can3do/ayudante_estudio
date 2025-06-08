import { Flashcard } from "./ui/Flashcard";
import { QuizItem } from "./ui/QuizItem";

export const ContentDisplay = ({ isLoading, activeTool, generatedContent }) => {
	if (isLoading) {
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
	if (!generatedContent) {
		return (
			<div className="flex flex-col items-center justify-center text-center p-8 h-full bg-slate-50 rounded-xl">
				<i className="ph-light ph-sparkle text-5xl text-slate-400"></i>
				<p className="mt-4 text-lg font-medium">Selecciona una herramienta</p>
				<p className="text-slate-500">
					Elige una opción del panel izquierdo para comenzar.
				</p>
			</div>
		);
	}

	switch (activeTool) {
		case "summary":
			return (
				<div className="p-6 bg-white rounded-lg shadow-sm">
					<h3 className="text-xl font-bold mb-4 flex items-center">
						<i className="ph-fill ph-text-align-left mr-2 text-blue-500"></i>
						Resumen del Documento
					</h3>
					<p className="text-slate-600 leading-relaxed">{generatedContent}</p>
				</div>
			);
		case "flashcards":
			return (
				<div>
					<h3 className="text-xl font-bold mb-4 flex items-center">
						<i className="ph-fill ph-cards mr-2 text-green-500"></i>Flashcards
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{generatedContent.map((card) => (
							<Flashcard key={card.id} card={card} />
						))}
					</div>
				</div>
			);
		case "quiz":
			return (
				<div>
					<h3 className="text-xl font-bold mb-4 flex items-center">
						<i className="ph-fill ph-question mr-2 text-purple-500"></i>
						Ejercicios (Quiz)
					</h3>
					<div className="space-y-6">
						{generatedContent.map((q) => (
							<QuizItem key={q.id} item={q} />
						))}
					</div>
				</div>
			);
		case "plan":
			return (
				<div className="p-6 bg-white rounded-lg shadow-sm">
					<h3 className="text-xl font-bold mb-4 flex items-center">
						<i className="ph-fill ph-calendar-check mr-2 text-orange-500"></i>
						Plan de Estudio Sugerido
					</h3>
					<ul className="space-y-3">
						{generatedContent.map((p, i) => (
							<li key={i} className="flex items-start">
								<span className="bg-orange-100 text-orange-600 font-semibold rounded-md px-3 py-1 text-sm mr-4">
									{p.day}
								</span>
								<span className="text-slate-700">{p.task}</span>
							</li>
						))}
					</ul>
				</div>
			);
		default:
			return null;
	}
};
