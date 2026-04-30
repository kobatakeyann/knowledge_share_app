import { Link } from "react-router-dom";
import type { User } from "../../types";
import { useApp } from "../../contexts/AppContext";

type Props = {
  user: User;
  animationDelay?: number;
};

export default function UserCard({ user, animationDelay = 0 }: Props) {
  const { state } = useApp();
  const { posts } = state;

  const userPosts = posts.filter((p) => p.authorId === user.id);
  const totalReactions = userPosts.reduce((acc, p) => acc + p.reactions.length, 0);
  const answerCount = userPosts.filter((p) => p.type === "knowledge").length;

  const activityLevel =
    user.recentActivities > 8 ? "高" : user.recentActivities > 4 ? "中" : "低";

  const activityColor =
    user.recentActivities > 8
      ? "text-emerald-400"
      : user.recentActivities > 4
      ? "text-amber-400"
      : "text-gray-500";

  return (
    <article
      className="glass rounded-2xl p-4 border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 animate-slide-up flex flex-col gap-3"
      style={{ animationDelay: `${animationDelay * 50}ms` }}
    >
      {/* Avatar & Name */}
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user.id}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white hover:scale-105 transition-transform">
            {user.name.charAt(0)}
          </div>
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/profile/${user.id}`} className="text-sm font-semibold text-gray-100 hover:text-white transition-colors block">
            {user.name}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs ${activityColor}`}>⚡ 活動: {activityLevel}</span>
            <span className="text-xs text-gray-600">⭐ {user.contributions}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "投稿", value: userPosts.length },
          { label: "ナレッジ", value: answerCount },
          { label: "リアクション", value: totalReactions },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-gray-100">{stat.value}</div>
            <div className="text-[10px] text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1">
        {user.skills.map((skill) => (
          <span key={skill} className="tag-pill text-[11px]">
            #{skill}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          to={`/profile/${user.id}`}
          className="btn-secondary text-xs py-1.5 flex-1 text-center"
        >
          プロフィール
        </Link>
        <button
          id={`consult-${user.id}`}
          className="btn-primary text-xs py-1.5 flex-1"
        >
          💬 相談する
        </button>
      </div>
    </article>
  );
}
