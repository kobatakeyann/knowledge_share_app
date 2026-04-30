import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";

const navItems = [
	{ to: "/knowledge_share_app/", label: "ダッシュボード", icon: "🏠" },
	{ to: "/knowledge_share_app/feed", label: "フィード", icon: "📋" },
	{ to: "/knowledge_share_app/users", label: "メンバー", icon: "👥" },
];

export default function Sidebar() {
	const location = useLocation();
	const { state } = useApp();
	const { currentUser } = state;

	return (
		<aside className="w-60 bg-gray-950 border-r border-white/5 flex flex-col h-full fixed left-0 top-0 z-10">
			{/* Logo */}
			<div className="p-5 border-b border-white/5">
				<Link
					to="/knowledge_share_app/"
					className="flex items-center gap-2"
				>
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-base">
						💡
					</div>
					<div>
						<div className="text-sm font-bold text-gradient">ナレッジ循環</div>
						<div className="text-[10px] text-gray-500">Knowledge Share</div>
					</div>
				</Link>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-3 space-y-1">
				{navItems.map((item) => {
					const isActive =
						item.to === "/"
							? location.pathname === "/"
							: location.pathname.startsWith(item.to);
					return (
						<Link
							key={item.to}
							to={item.to}
							className={isActive ? "nav-link-active" : "nav-link"}
						>
							<span className="text-base">{item.icon}</span>
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* User info */}
			<div className="p-3 border-t border-white/5">
				<Link
					to={`/knowledge_share_app/profile/${currentUser.id}`}
					className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
				>
					<div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
						{currentUser.name.charAt(0)}
					</div>
					<div className="min-w-0">
						<div className="text-sm font-medium text-gray-200 truncate">
							{currentUser.name}
						</div>
						<div className="text-xs text-gray-500">
							貢献度: {currentUser.contributions}
						</div>
					</div>
				</Link>
			</div>
		</aside>
	);
}
