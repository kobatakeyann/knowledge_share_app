import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import PostModal from "../posts/PostModal";

export default function Layout() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-end">
          <button
            id="open-post-modal"
            onClick={() => setIsPostModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <span className="text-base">✏️</span>
            <span>投稿する</span>
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Post Modal */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
}
