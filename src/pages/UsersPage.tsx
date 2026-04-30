import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { AVAILABLE_TAGS } from "../types";
import UserCard from "../components/users/UserCard";

const TAG_CATEGORY_LABELS = {
  tech: "🖥️ テクノロジー",
  process: "⚙️ プロセス",
  industry: "🏢 業界",
};

export default function UsersPage() {
  const { state } = useApp();
  const { users } = state;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"contributions" | "activities">("contributions");

  const filtered = users
    .filter((user) => {
      if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedTag && !user.skills.includes(selectedTag)) {
        return false;
      }
      return true;
    })
    .sort((a, b) =>
      sortBy === "contributions"
        ? b.contributions - a.contributions
        : b.recentActivities - a.recentActivities
    );

  const groupedTags = AVAILABLE_TAGS.reduce((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100 mb-1">メンバー一覧</h1>
        <p className="text-gray-400 text-sm">
          スキルで有識者を探して、気軽に相談しよう
        </p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl border border-white/5 p-5 space-y-4">
        {/* Search & Sort */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              id="user-search"
              type="text"
              placeholder="名前で検索…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>
          <select
            id="sort-users"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input-field w-auto"
          >
            <option value="contributions">貢献度順</option>
            <option value="activities">活動量順</option>
          </select>
        </div>

        {/* Tag filters */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-400">スキルで絞り込み</div>
          {Object.entries(groupedTags).map(([category, tags]) => (
            <div key={category}>
              <div className="text-[10px] text-gray-600 mb-1">
                {TAG_CATEGORY_LABELS[category as keyof typeof TAG_CATEGORY_LABELS]}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    id={`user-filter-tag-${tag}`}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={selectedTag === tag ? "tag-pill-active" : "tag-pill"}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              ✕ フィルターをクリア
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-500 mb-2">{filtered.length} 人のメンバー</div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">👥</div>
          <div className="text-lg font-medium mb-1">メンバーが見つかりません</div>
          <div className="text-sm">検索条件を変えてみてください</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((user, i) => (
            <UserCard key={user.id} user={user} animationDelay={i} />
          ))}
        </div>
      )}
    </div>
  );
}
