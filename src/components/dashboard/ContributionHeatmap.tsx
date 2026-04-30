import React from "react";
import { useApp } from "../../contexts/AppContext";
import { AVAILABLE_TAGS } from "../../types";

export default function ContributionHeatmap() {
  const { state } = useApp();
  const { posts, currentUser } = state;

  // 自分の投稿のタグごとの統計
  const myPosts = posts.filter((p) => p.authorId === currentUser.id);
  const tagStats = AVAILABLE_TAGS.slice(0, 8).map((tagMeta) => {
    const tagPosts = myPosts.filter((p) => p.tags.includes(tagMeta.name));
    const totalPosts = posts.filter((p) => p.tags.includes(tagMeta.name));
    const reactions = totalPosts.reduce((acc, p) => acc + p.reactions.length, 0);
    return {
      tag: tagMeta.name,
      postCount: tagPosts.length,
      reactions,
    };
  }).filter((s) => s.postCount > 0 || s.reactions > 0);

  // 全体のタグ活発度
  const allTagStats = AVAILABLE_TAGS.slice(0, 8).map((tagMeta) => {
    const tagPosts = posts.filter((p) => p.tags.includes(tagMeta.name));
    const reactions = tagPosts.reduce((acc, p) => acc + p.reactions.length, 0);
    return {
      tag: tagMeta.name,
      postCount: tagPosts.length,
      reactions,
    };
  }).filter((s) => s.postCount > 0);

  const maxCount = Math.max(...allTagStats.map((s) => s.postCount), 1);

  const myStats = [
    { label: "投稿数", value: myPosts.length, icon: "📝" },
    {
      label: "獲得リアクション",
      value: myPosts.reduce((acc, p) => acc + p.reactions.length, 0),
      icon: "🎯",
    },
    { label: "貢献スコア", value: currentUser.contributions, icon: "⭐" },
  ];

  return (
    <div className="space-y-4">
      {/* My stats */}
      <div className="grid grid-cols-3 gap-2">
        {myStats.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-3 border border-white/5 text-center">
            <div className="text-xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-100">{stat.value}</div>
            <div className="text-[10px] text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tag activity bar chart */}
      <div>
        <div className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1">
          <span>📊</span> タグ別アクティビティ
        </div>
        <div className="space-y-2">
          {allTagStats.slice(0, 6).map((stat) => (
            <div key={stat.tag} className="flex items-center gap-2">
              <div className="text-xs text-gray-400 w-16 truncate flex-shrink-0">#{stat.tag}</div>
              <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(stat.postCount / maxCount) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 w-8 text-right">{stat.postCount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
