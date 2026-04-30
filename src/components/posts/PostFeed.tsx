import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import type { PostType } from "../../types";
import { AVAILABLE_TAGS } from "../../types";
import PostCard from "./PostCard";

const FILTER_TYPES: { value: PostType | "all"; label: string; icon: string }[] = [
  { value: "all", label: "すべて", icon: "📋" },
  { value: "knowledge", label: "ナレッジ", icon: "📘" },
  { value: "question", label: "質問", icon: "❓" },
  { value: "casual", label: "つぶやき", icon: "💬" },
];

export default function PostFeed() {
  const { state } = useApp();
  const { posts } = state;

  const [typeFilter, setTypeFilter] = useState<PostType | "all">("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [unresolvedOnly, setUnresolvedOnly] = useState(false);

  const filtered = posts.filter((post) => {
    if (typeFilter !== "all" && post.type !== typeFilter) return false;
    if (tagFilter && !post.tags.includes(tagFilter)) return false;
    if (unresolvedOnly && post.resolved) return false;
    return true;
  });

  const popularTags = AVAILABLE_TAGS.slice(0, 12).map((t) => t.name);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="glass rounded-xl p-4 space-y-3">
        {/* Type filters */}
        <div className="flex flex-wrap gap-2">
          {FILTER_TYPES.map((f) => (
            <button
              key={f.value}
              id={`filter-type-${f.value}`}
              onClick={() => setTypeFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                typeFilter === f.value
                  ? "bg-primary-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200"
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
          <button
            id="filter-unresolved"
            onClick={() => setUnresolvedOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ml-auto ${
              unresolvedOnly
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            <span>🔍</span>
            <span>未解決のみ</span>
          </button>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTagFilter(null)}
            className={tagFilter === null ? "tag-pill-active" : "tag-pill"}
          >
            #すべて
          </button>
          {popularTags.map((tag) => (
            <button
              key={tag}
              id={`filter-tag-${tag}`}
              onClick={() => setTagFilter(tag === tagFilter ? null : tag)}
              className={tagFilter === tag ? "tag-pill-active" : "tag-pill"}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        {filtered.length} 件の投稿
      </div>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-lg font-medium mb-1">投稿が見つかりません</div>
          <div className="text-sm">フィルターを変えてみてください</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post, i) => (
            <PostCard key={post.id} post={post} animationDelay={i} />
          ))}
        </div>
      )}
    </div>
  );
}
