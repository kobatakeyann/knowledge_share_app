import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";

export default function ThanksLog() {
	const { state } = useApp();
	const { thanks, users, currentUser } = state;

	const myThanks = thanks.filter((t) => t.toUserId === currentUser.id);
	const allThanks = thanks;

	const getUserName = (id: string) => {
		if (id === currentUser.id) return currentUser.name;
		return users.find((u) => u.id === id)?.name ?? "不明";
	};

	return (
		<div className="space-y-3">
			{myThanks.length > 0 && (
				<div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-3">
					<div className="text-xs font-semibold text-pink-300 mb-2 flex items-center gap-1">
						<span>💝</span> あなたへの感謝
					</div>
					<div className="space-y-2">
						{myThanks.map((t) => (
							<div
								key={t.id}
								className="flex items-start gap-2"
							>
								<div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
									{getUserName(t.fromUserId).charAt(0)}
								</div>
								<div>
									<span className="text-xs font-medium text-gray-200">
										{getUserName(t.fromUserId)}さん
									</span>
									<span className="text-xs text-gray-400">が感謝しました</span>
									<p className="text-xs text-gray-400 mt-0.5">
										「{t.message}」
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div>
				<div className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
					<span>🙏</span> 感謝の流れ
				</div>
				<div className="space-y-2">
					{allThanks.map((t) => (
						<div
							key={t.id}
							className="glass rounded-xl p-2.5 border border-white/5"
						>
							<div className="flex items-center gap-1.5 text-xs">
								<Link
									to={`/profile/${t.fromUserId}`}
									className="font-medium text-gray-300 hover:text-white"
								>
									{getUserName(t.fromUserId)}
								</Link>
								<span className="text-gray-600">→</span>
								<Link
									to={`/profile/${t.toUserId}`}
									className="font-medium text-primary-400 hover:text-primary-300"
								>
									{getUserName(t.toUserId)}
								</Link>
							</div>
							<p className="text-xs text-gray-500 mt-1">「{t.message}」</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
