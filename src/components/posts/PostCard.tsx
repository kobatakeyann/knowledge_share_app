import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import type { Post } from "../../types";
import { MOOD_LABELS, POST_TYPE_LABELS } from "../../types";
import ReactionBar from "./ReactionBar";

type Props = {
	post: Post;
	animationDelay?: number;
};

const TYPE_COLORS = {
	knowledge: {
		badge: "badge-knowledge",
		border: "border-blue-500/30",
		glow: "hover:shadow-blue-500/10",
		icon: "📘",
		dot: "bg-blue-400",
	},
	question: {
		badge: "badge-question",
		border: "border-emerald-500/30",
		glow: "hover:shadow-emerald-500/10",
		icon: "❓",
		dot: "bg-emerald-400",
	},
	casual: {
		badge: "badge-casual",
		border: "border-pink-500/30",
		glow: "hover:shadow-pink-500/10",
		icon: "💬",
		dot: "bg-pink-400",
	},
};

const MOOD_ICONS: Record<string, string> = {
	troubled: "😣",
	thinking: "🤔",
	sharing: "✨",
};

function formatRelativeTime(dateStr: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 1) return "たった今";
	if (diffMins < 60) return `${diffMins}分前`;
	if (diffHours < 24) return `${diffHours}時間前`;
	return `${diffDays}日前`;
}

export default function PostCard({ post, animationDelay = 0 }: Props) {
	const { state, promoteToKnowledge } = useApp();
	const { users } = state;
	const colors = TYPE_COLORS[post.type];
	const author = users.find((u) => u.id === post.authorId);
	const totalReactions = post.reactions.length;
	const canPromote = post.type !== "knowledge" && totalReactions >= 5;

	const handlePromote = (e: React.MouseEvent) => {
		e.stopPropagation();
		promoteToKnowledge(post.id, post.tags);
	};

	return (
		<article
			className={`
        glass rounded-2xl p-4 border ${colors.border}
        hover:shadow-xl ${colors.glow} transition-all duration-300
        animate-slide-up flex flex-col gap-3
        ${totalReactions > 3 ? "ring-1 ring-white/5" : ""}
      `}
			style={{ animationDelay: `${animationDelay * 50}ms` }}
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2 min-w-0">
					{/* Author avatar */}
					<Link
						to={`/knowledge_share_app/profile/${post.authorId}`}
						className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 hover:scale-105 transition-transform"
					>
						{author?.name.charAt(0) ?? "?"}
					</Link>
					<div className="min-w-0">
						<Link
							to={`/knowledge_share_app/profile/${post.authorId}`}
							className="text-sm font-medium text-gray-200 hover:text-white transition-colors truncate block"
						>
							{author?.name ?? "不明"}
						</Link>
						<div className="text-xs text-gray-500">
							{formatRelativeTime(post.createdAt)}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-1.5 flex-shrink-0">
					{post.mood && (
						<span
							className="text-base"
							title={MOOD_LABELS[post.mood]}
						>
							{MOOD_ICONS[post.mood]}
						</span>
					)}
					<span className={colors.badge}>
						{colors.icon} {POST_TYPE_LABELS[post.type]}
					</span>
					{post.resolved && (
						<span className="bg-gray-700/50 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-600/30">
							✓ 解決済
						</span>
					)}
				</div>
			</div>

			{/* Content */}
			<p className="text-sm text-gray-200 leading-relaxed">{post.content}</p>

			{/* Tags */}
			{post.tags.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{post.tags.map((tag) => (
						<span
							key={tag}
							className="tag-pill"
						>
							#{tag}
						</span>
					))}
				</div>
			)}

			{/* Reactions */}
			<div className="pt-1 border-t border-white/5">
				<ReactionBar post={post} />
			</div>

			{/* Promote button */}
			{canPromote && (
				<button
					id={`promote-${post.id}`}
					onClick={handlePromote}
					className="flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-all active:scale-95 w-fit"
				>
					<span>⭐</span>
					<span>ナレッジ化する</span>
					<span className="text-amber-500/60">
						({totalReactions} reactions)
					</span>
				</button>
			)}
		</article>
	);
}
