import { useState } from "preact/hooks";

export const ApiKeyInput = ({ onSubmit }) => {
	const [key, setKey] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (key.trim()) {
			onSubmit(key.trim());
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
			<div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
				<header className="mb-6">
					<h1 className="text-3xl font-bold text-slate-800">
						Clave de API de OpenAI
					</h1>
					<p className="mt-2 text-slate-500">
						Para continuar, por favor introduce tu clave de API de OpenAI. Tu
						clave se usa únicamente para las peticiones y no se almacena.
					</p>
				</header>
				<form onSubmit={handleSubmit}>
					<input
						type="password"
						value={key}
						onInput={(e) => setKey(e.currentTarget.value)}
						placeholder="sk-..."
						className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
					/>
					<button
						type="submit"
						className="w-full mt-4 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						Guardar y Continuar
					</button>
				</form>
				<p className="text-xs text-slate-400 mt-4">
					Puedes obtener tu clave de API en la{" "}
					<a
						href="https://platform.openai.com/api-keys"
						target="_blank"
						rel="noopener noreferrer"
						className="underline hover:text-blue-600"
					>
						página de OpenAI
					</a>
					.
				</p>
			</div>
		</div>
	);
};
