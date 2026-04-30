import type { Post, ReactionType } from "../../types";
import { REACTION_LABELS, REACTION_EMOJIS } from "../../types";
import { useApp } from "../../contexts/AppContext";

type Props = {
  post: Post;
};

const REACTION_TYPES: ReactionType[] = ["agree", "trouble", "experience", "later"];

export default function ReactionBar({ post }: Props) {
  const { state, toggleReaction } = useApp();
  const currentUserId = state.currentUser.id;

  const getCount = (type: ReactionType) =>
    post.reactions.filter((r) => r.type === type).length;

  const hasReacted = (type: ReactionType) =>
    post.reactions.some((r) => r.userId === currentUserId && r.type === type);

  return (
    <div className="flex flex-wrap gap-1.5">
      {REACTION_TYPES.map((type) => {
        const count = getCount(type);
        const reacted = hasReacted(type);
        return (
          <button
            key={type}
            id={`reaction-${post.id}-${type}`}
            onClick={() => toggleReaction(post.id, type)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
              reacted
                ? "bg-primary-500/30 text-primary-300 border border-primary-400/50"
                : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 border border-white/10"
            }`}
          >
            <span>{REACTION_EMOJIS[type]}</span>
            <span>{REACTION_LABELS[type]}</span>
            {count > 0 && (
              <span className={`font-bold ${reacted ? "text-primary-300" : "text-gray-400"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
