import { useState } from "preact/hooks";

export const FileUploadScreen = ({
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
							className="bg-white text-slate-800 w-full h-64 p-4 border-2 border-slate-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
