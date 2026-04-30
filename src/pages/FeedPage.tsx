import React from "react";
import PostFeed from "../components/posts/PostFeed";

export default function FeedPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 mb-1">投稿フィード</h1>
        <p className="text-gray-400 text-sm">
          チームのつぶやき・質問・ナレッジをチェックしよう
        </p>
      </div>
      <PostFeed />
    </div>
  );
}
