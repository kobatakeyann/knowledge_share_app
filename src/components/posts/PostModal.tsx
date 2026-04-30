import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import type { PostType, MoodType } from "../../types";
import { AVAILABLE_TAGS } from "../../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const POST_TYPES: { value: PostType; label: string; icon: string; desc: string; color: string }[] = [
  { value: "casual", label: "つぶやき", icon: "💬", desc: "雑な感想・悩みをシェア", color: "pink" },
  { value: "question", label: "質問", icon: "❓", desc: "誰かに聞いてみたい", color: "emerald" },
  { value: "knowledge", label: "ナレッジ", icon: "📘", desc: "ノウハウを共有", color: "blue" },
];

const MOODS: { value: MoodType; label: string; icon: string }[] = [
  { value: "troubled", label: "困っている", icon: "😣" },
  { value: "thinking", label: "相談したい", icon: "🤔" },
  { value: "sharing", label: "軽い共有", icon: "✨" },
];

const TAG_CATEGORY_LABELS = {
  tech: "🖥️ テクノロジー",
  process: "⚙️ プロセス",
  industry: "🏢 業界",
};

export default function PostModal({ isOpen, onClose }: Props) {
  const { addPost } = useApp();
  const [postType, setPostType] = useState<PostType>("casual");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<MoodType>("sharing");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addPost({
      type: postType,
      content: content.trim(),
      tags: selectedTags,
      mood: postType !== "knowledge" ? mood : undefined,
      authorId: "current-user",
    });
    setContent("");
    setSelectedTags([]);
    setPostType("casual");
    setMood("sharing");
    onClose();
  };

  const groupedTags = AVAILABLE_TAGS.reduce((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl animate-slide-up overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-lg font-bold text-gray-100">新しい投稿</h2>
          <button
            id="close-post-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Post type selector */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
              投稿タイプ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  id={`post-type-${t.value}`}
                  onClick={() => setPostType(t.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    postType === t.value
                      ? t.value === "casual"
                        ? "bg-pink-500/20 border-pink-500/50 text-pink-200"
                        : t.value === "question"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                        : "bg-blue-500/20 border-blue-500/50 text-blue-200"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-xs font-medium">{t.label}</span>
                  <span className="text-[10px] text-center opacity-70">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood selector (only for casual/question) */}
          {postType !== "knowledge" && (
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                今の気持ち
              </label>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    id={`mood-${m.value}`}
                    onClick={() => setMood(m.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      mood === m.value
                        ? "bg-primary-500/20 border-primary-400/50 text-primary-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
              内容
            </label>
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === "casual"
                  ? "気軽につぶやいてみましょう…"
                  : postType === "question"
                  ? "何について相談したいですか？"
                  : "どんなナレッジを共有しますか？"
              }
              rows={4}
              className="input-field resize-none"
              required
            />
            <div className="text-xs text-gray-600 text-right mt-1">{content.length} 文字</div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>タグ（最大3つ）</span>
              <span className="text-primary-400">{selectedTags.length}/3</span>
            </label>
            {Object.entries(groupedTags).map(([category, tags]) => (
              <div key={category} className="mb-3">
                <div className="text-[10px] text-gray-500 mb-1.5">
                  {TAG_CATEGORY_LABELS[category as keyof typeof TAG_CATEGORY_LABELS]}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    const isDisabled = !isSelected && selectedTags.length >= 3;
                    return (
                      <button
                        key={tag}
                        type="button"
                        id={`tag-${tag}`}
                        onClick={() => handleTagToggle(tag)}
                        disabled={isDisabled}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          isSelected
                            ? "bg-primary-500/20 text-primary-300 border-primary-400/50"
                            : isDisabled
                            ? "bg-white/5 text-gray-600 border-white/5 cursor-not-allowed"
                            : "tag-pill"
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              キャンセル
            </button>
            <button
              type="submit"
              id="submit-post"
              disabled={!content.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              投稿する ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
