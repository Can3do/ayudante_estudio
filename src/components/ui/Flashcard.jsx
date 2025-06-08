import { useState } from "preact/hooks";

export const Flashcard = ({ card }) => {
	// El estado para controlar si la tarjeta está volteada.
	const [isFlipped, setIsFlipped] = useState(false);

	// La función para cambiar el estado al hacer clic.
	const handleFlip = () => {
		setIsFlipped(!isFlipped);
	};

	return (
		// Contenedor principal: establece la perspectiva 3D para el efecto de volteo.
		<div
			className="w-full h-48 [perspective:1000px] cursor-pointer group"
			onClick={handleFlip}
		>
			{/* Contenedor interno: este es el que realmente rota. */}
			{/* 'transition-all' y 'duration-500' crean la animación suave. */}
			{/* '[transform-style:preserve-3d]' mantiene el espacio 3D para las caras. */}
			{/* La clase de rotación se aplica condicionalmente basado en el estado 'isFlipped'. */}
			<div
				className={`relative h-full w-full rounded-xl shadow-md transition-all duration-500 [transform-style:preserve-3d] ${
					isFlipped ? "[transform:rotateY(180deg)]" : ""
				}`}
			>
				{/* Cara frontal (Pregunta) */}
				{/* Se posiciona de forma absoluta para ocupar todo el espacio. */}
				{/* '[backface-visibility:hidden]' la oculta cuando está de espaldas. */}
				<div className="absolute inset-0 rounded-xl bg-white p-4 flex flex-col justify-center items-center text-center [backface-visibility:hidden]">
					<div className="text-slate-700">
						<p className="text-sm text-slate-500 mb-2">Pregunta</p>
						<p className="font-semibold">{card.question}</p>
					</div>
				</div>

				{/* Cara trasera (Respuesta) */}
				{/* Se rota 180 grados desde el principio para que esté "detrás". */}
				{/* '[backface-visibility:hidden]' también la oculta cuando está de espaldas. */}
				<div className="absolute inset-0 h-full w-full rounded-xl bg-green-100 p-4 flex flex-col justify-center items-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
					<div className="text-green-800">
						<p className="text-sm font-medium mb-2">Respuesta</p>
						<p className="font-semibold">{card.answer}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
