import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { POST_TYPE_LABELS } from "../../types";

export default function RecommendPosts() {
	const { state } = useApp();
	const { posts, currentUser } = state;

	// 自分のスキルに一致する未解決投稿
	const recommended = posts
		.filter((p) => {
			if (p.authorId === currentUser.id) return false;
			if (p.resolved) return false;
			return p.tags.some((tag) => currentUser.skills.includes(tag));
		})
		.sort((a, b) => b.reactions.length - a.reactions.length)
		.slice(0, 4);

	const typeColors = {
		knowledge: "text-blue-400",
		question: "text-emerald-400",
		casual: "text-pink-400",
	};

	if (recommended.length === 0) {
		return (
			<div className="text-center py-6 text-gray-500 text-sm">
				<div className="text-2xl mb-2">🎯</div>
				レコメンドなし
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="text-[10px] text-gray-500 mb-1">
				あなたのスキル（{currentUser.skills.join(", ")}）に関連する投稿
			</div>
			{recommended.map((post) => {
				const author = state.users.find((u) => u.id === post.authorId);
				const matchingTags = post.tags.filter((t) =>
					currentUser.skills.includes(t),
				);
				return (
					<Link
						key={post.id}
						to="/feed"
						className="block glass rounded-xl p-3 border border-white/5 hover:bg-white/5 transition-all"
					>
						<div className="flex items-start gap-2">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-1.5 mb-1">
									<span
										className={`text-xs font-medium ${typeColors[post.type]}`}
									>
										{POST_TYPE_LABELS[post.type]}
									</span>
									{post.type === "question" && (
										<span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
											🆘 回答を求めています
										</span>
									)}
								</div>
								<p className="text-xs text-gray-300 line-clamp-2">
									{post.content}
								</p>
								<div className="flex items-center gap-2 mt-1.5">
									<span className="text-[10px] text-gray-500">
										{author?.name}
									</span>
									<div className="flex gap-1">
										{matchingTags.map((tag) => (
											<span
												key={tag}
												className="text-[10px] text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full"
											>
												#{tag}
											</span>
										))}
									</div>
								</div>
							</div>
							<div className="flex-shrink-0 text-center">
								<div className="text-sm font-bold text-gray-300">
									{post.reactions.length}
								</div>
								<div className="text-[10px] text-gray-600">反応</div>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
