import { useState } from "preact/hooks";

export const QuizItem = ({ item }) => {
	const [selected, setSelected] = useState(null);
	const isCorrect = selected === item.answer;

	return (
		<div className="p-5 bg-white rounded-lg shadow-sm">
			<p className="font-semibold mb-4">{item.question}</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{item.options.map((option, index) => {
					let buttonClass =
						"border-slate-300 hover:border-blue-500 hover:bg-blue-50";
					if (selected !== null) {
						buttonClass =
							index === item.answer
								? "bg-green-100 border-green-500 text-green-800"
								: index === selected
								? "bg-red-100 border-red-500 text-red-800"
								: "cursor-not-allowed";
					}
					return (
						<button
							key={index}
							onClick={() => setSelected(index)}
							disabled={selected !== null}
							className={`w-full text-left p-3 border rounded-lg transition-colors ${buttonClass}`}
						>
							{option}
						</button>
					);
				})}
			</div>
			{selected !== null && (
				<p
					className={`mt-4 text-sm font-semibold ${
						isCorrect ? "text-green-600" : "text-red-600"
					}`}
				>
					{isCorrect ? "¡Correcto!" : "Respuesta incorrecta."}
				</p>
			)}
		</div>
	);
};
