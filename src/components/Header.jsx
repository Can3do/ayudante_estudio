export const Header = ({ onReset }) => {
	return (
		<header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Sección del Logo/Título */}
					<div className="flex items-center gap-3">
						<i className="ph-bold ph-brain text-3xl text-blue-600"></i>
						<h1 className="text-xl font-bold text-slate-800 hidden sm:block">
							Asistente de Estudio IA
						</h1>
					</div>

					{/* Botón para volver al inicio */}
					<button
						onClick={onReset}
						className="flex items-center gap-2 text-slate-600 font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
					>
						<i className="ph ph-arrow-left text-lg"></i>
						<span className="hidden md:inline">Cargar otro archivo</span>
						<span className="md:hidden">Volver</span>
					</button>
				</div>
			</div>
		</header>
	);
};
