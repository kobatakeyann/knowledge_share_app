// 投稿タイプ
export type PostType = "knowledge" | "question" | "casual";

// mood（温度感）
export type MoodType = "troubled" | "thinking" | "sharing";

// タグカテゴリ
export type TagCategory = "tech" | "process" | "industry";

// リアクションタイプ
export type ReactionType = "agree" | "trouble" | "experience" | "later";

// リアクション
export type Reaction = {
  id: string;
  type: ReactionType;
  userId: string;
};

// 投稿
export type Post = {
  id: string;
  type: PostType;
  content: string;
  tags: string[];
  mood?: MoodType;
  reactions: Reaction[];
  authorId: string;
  createdAt: string;
  resolved?: boolean;
};

// ユーザー
export type User = {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  contributions: number;
  recentActivities: number;
};

// 感謝ログ
export type Thanks = {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  createdAt: string;
};

// アプリ全体の状態
export type AppState = {
  posts: Post[];
  users: User[];
  currentUser: User;
  thanks: Thanks[];
};

// タグのメタデータ
export type TagMeta = {
  name: string;
  category: TagCategory;
};

export const REACTION_LABELS: Record<ReactionType, string> = {
  agree: "わかる",
  trouble: "それ困る",
  experience: "自分もやった",
  later: "後で見る",
};

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  agree: "👍",
  trouble: "😰",
  experience: "💡",
  later: "🔖",
};

export const POST_TYPE_LABELS: Record<PostType, string> = {
  knowledge: "ナレッジ",
  question: "質問",
  casual: "つぶやき",
};

export const MOOD_LABELS: Record<MoodType, string> = {
  troubled: "😣 困っている",
  thinking: "🤔 相談したい",
  sharing: "✨ 軽い共有",
};

export const AVAILABLE_TAGS: TagMeta[] = [
  // tech
  { name: "React", category: "tech" },
  { name: "TypeScript", category: "tech" },
  { name: "Java", category: "tech" },
  { name: "AWS", category: "tech" },
  { name: "Python", category: "tech" },
  { name: "Docker", category: "tech" },
  { name: "SQL", category: "tech" },
  { name: "Git", category: "tech" },
  // process
  { name: "要件定義", category: "process" },
  { name: "設計", category: "process" },
  { name: "テスト", category: "process" },
  { name: "レビュー", category: "process" },
  { name: "CI/CD", category: "process" },
  // industry
  { name: "金融", category: "industry" },
  { name: "通信", category: "industry" },
  { name: "製造", category: "industry" },
  { name: "小売", category: "industry" },
];
