export const ToolButton = ({ icon, label, tool, activeTool, onClick }) => {
	const isActive = tool === activeTool;
	return (
		<button
			onClick={() => onClick(tool)}
			className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors ${
				isActive
					? "bg-blue-100 text-blue-700"
					: "text-slate-600 hover:bg-slate-100"
			}`}
		>
			<i
				className={`ph-fill ph-${icon} text-xl ${
					isActive ? "text-blue-600" : "text-slate-500"
				}`}
			></i>
			<span className="font-semibold">{label}</span>
		</button>
	);
};
