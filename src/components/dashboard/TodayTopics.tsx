import { useApp } from "../../contexts/AppContext";
import { Link } from "react-router-dom";

export default function TodayTopics() {
  const { state } = useApp();
  const { posts } = state;

  // 人気投稿（リアクション数上位3件）
  const topPosts = [...posts]
    .sort((a, b) => b.reactions.length - a.reactions.length)
    .slice(0, 3);

  // 最近解決された問題
  const recentlyResolved = posts
    .filter((p) => p.resolved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);

  const typeColors = {
    knowledge: "border-blue-500/30 bg-blue-500/5",
    question: "border-emerald-500/30 bg-emerald-500/5",
    casual: "border-pink-500/30 bg-pink-500/5",
  };

  return (
    <div className="space-y-4">
      {/* Hot topics */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>🔥</span> 今日のホット
        </h3>
        <div className="space-y-2">
          {topPosts.map((post) => {
            const author = state.users.find((u) => u.id === post.authorId);
            return (
              <Link
                key={post.id}
                to="/feed"
                className={`block glass rounded-xl p-3 border ${typeColors[post.type]} hover:bg-white/5 transition-all`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-300 line-clamp-2 flex-1">
                    {post.content}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0 bg-white/5 px-1.5 py-0.5 rounded-full">
                    🎯 {post.reactions.length}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{author?.name}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recently resolved */}
      {recentlyResolved.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>✅</span> 最近解決された問題
          </h3>
          <div className="space-y-2">
            {recentlyResolved.map((post) => (
              <div
                key={post.id}
                className="glass rounded-xl p-3 border border-white/5"
              >
                <p className="text-xs text-gray-300 line-clamp-2">{post.content}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
