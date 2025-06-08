export const FileUploadScreen = ({
	onFileSelect,
	isLoading,
	error,
	onDrag,
	onDrop,
	dragActive,
}) => {
	return (
		<div
			className="min-h-screen flex items-center justify-center p-4 bg-slate-50"
			onDragEnter={onDrag}
		>
			<div className="text-center max-w-2xl w-full">
				<header className="mb-8">
					<h1 className="text-5xl font-bold text-slate-800">
						Asistente de Estudio <span className="text-blue-600">IA</span>
					</h1>
					<p className="mt-4 text-lg text-slate-500">
						Transforma tus documentos PDF en resúmenes, flashcards y más. Sube
						un archivo para empezar.
					</p>
				</header>
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
				{error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
			</div>
		</div>
	);
};
