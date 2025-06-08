import { Flashcard } from "./ui/Flashcard";
import { QuizItem } from "./ui/QuizItem";
import { marked } from "https://esm.sh/marked@13.0.1"; // Importamos la librería para Markdown

export const ContentDisplay = ({ activeTool, generatedContent }) => {
	// Si el contenido no está definido, no se renderiza nada.
	if (generatedContent === null || generatedContent === undefined) return null;

	switch (activeTool) {
		case "summary":
			// Convierte el texto Markdown del resumen a HTML y lo renderiza de forma segura.
			// La clase 'prose' de Tailwind Typography se encarga de darle un estilo atractivo.
			const summaryHtml = marked.parse(generatedContent);
			return (
				<div
					className="prose max-w-none text-slate-600"
					dangerouslySetInnerHTML={{ __html: summaryHtml }}
				></div>
			);

		case "flashcards":
			// Renderiza las flashcards en una grilla.
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{generatedContent.map((card, index) => (
						<Flashcard key={index} card={card} />
					))}
				</div>
			);

		case "quiz":
			// Renderiza los ejercicios o preguntas del quiz.
			return (
				<div className="space-y-6">
					{generatedContent.map((q, index) => (
						<QuizItem key={index} item={q} />
					))}
				</div>
			);

		case "plan":
			// Renderiza el plan de estudio.
			return (
				<div className="space-y-4">
					{generatedContent.map((item, index) => (
						<div
							key={index}
							className="flex items-start p-4 bg-slate-50 rounded-lg"
						>
							<span className="bg-orange-100 text-orange-600 font-semibold rounded-md px-3 py-1 text-sm mr-4">
								{item.day}
							</span>
							<p className="text-slate-700 flex-1">{item.task}</p>
						</div>
					))}
				</div>
			);

		case "glossary":
			// Renderiza el glosario de términos.
			return (
				<div className="space-y-5">
					<h3 className="text-xl font-bold mb-4 flex items-center">
						<i className="ph-fill ph-book-open mr-2 text-indigo-500"></i>
						Glosario de Términos
					</h3>
					{generatedContent.map((item, index) => (
						<div key={index} className="border-b border-slate-200 pb-3">
							<dt className="font-semibold text-slate-800">{item.term}</dt>
							<dd className="mt-1 text-slate-600">{item.definition}</dd>
						</div>
					))}
				</div>
			);

		default:
			// Mensaje por defecto si el tipo de herramienta no se reconoce.
			return <p>Contenido no reconocido.</p>;
	}
};
