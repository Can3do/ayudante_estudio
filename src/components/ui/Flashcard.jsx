import { useState } from "preact/hooks";

export const Flashcard = ({ card }) => {
	const [isFlipped, setIsFlipped] = useState(false);
	return (
		<div
			className="flashcard perspective-[1000px] cursor-pointer"
			onClick={() => setIsFlipped(!isFlipped)}
		>
			<div
				className={`flashcard-inner relative w-full h-48 rounded-xl shadow-md ${
					isFlipped ? "flipped" : ""
				}`}
			>
				<div className="flashcard-front absolute w-full h-full bg-white p-4 rounded-xl flex flex-col justify-center items-center text-center">
					<p className="text-sm text-slate-500 mb-2">Pregunta</p>
					<p className="font-semibold text-slate-700">{card.question}</p>
				</div>
				<div className="flashcard-back absolute w-full h-full bg-green-100 p-4 rounded-xl flex flex-col justify-center items-center text-center">
					<p className="text-sm text-green-700 mb-2">Respuesta</p>
					<p className="font-medium text-green-800">{card.answer}</p>
				</div>
			</div>
		</div>
	);
};
