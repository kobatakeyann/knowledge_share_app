import { useParams, Navigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import PostCard from "../components/posts/PostCard";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { state } = useApp();
  const { users, posts, currentUser } = state;

  const user =
    userId === currentUser.id
      ? currentUser
      : users.find((u) => u.id === userId);

  if (!user) return <Navigate to="/" />;

  const userPosts = posts
    .filter((p) => p.authorId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalReactions = userPosts.reduce((acc, p) => acc + p.reactions.length, 0);
  const knowledgePosts = userPosts.filter((p) => p.type === "knowledge");

  const isCurrentUser = user.id === currentUser.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-primary-900/50 via-purple-900/50 to-pink-900/50" />

        <div className="p-6 -mt-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-gray-900">
                {user.name.charAt(0)}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-100">{user.name}</h1>
                {isCurrentUser && (
                  <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/20">
                    あなた
                  </span>
                )}
              </div>
            </div>

            {!isCurrentUser && (
              <button
                id={`consult-profile-${user.id}`}
                className="btn-primary text-sm"
              >
                💬 この人に相談
              </button>
            )}
          </div>

          {/* Skills */}
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2">スキル</div>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((skill) => (
                <span key={skill} className="tag-pill">
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "貢献スコア", value: user.contributions, icon: "⭐", color: "text-amber-400" },
          { label: "投稿数", value: userPosts.length, icon: "📝", color: "text-blue-400" },
          { label: "ナレッジ数", value: knowledgePosts.length, icon: "📘", color: "text-emerald-400" },
          { label: "獲得リアクション", value: totalReactions, icon: "🎯", color: "text-pink-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 border border-white/5 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>📋</span>
          投稿履歴 ({userPosts.length}件)
        </h2>

        {userPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-3xl mb-2">📭</div>
            まだ投稿がありません
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {userPosts.map((post, i) => (
              <PostCard key={post.id} post={post} animationDelay={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
