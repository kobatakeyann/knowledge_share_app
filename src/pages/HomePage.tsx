import React from "react";
import { useApp } from "../contexts/AppContext";
import TodayTopics from "../components/dashboard/TodayTopics";
import ThanksLog from "../components/dashboard/ThanksLog";
import ContributionHeatmap from "../components/dashboard/ContributionHeatmap";
import RecommendPosts from "../components/dashboard/RecommendPosts";

type DashboardSection = {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  colSpan?: string;
};

export default function HomePage() {
  const { state } = useApp();
  const { currentUser, posts } = state;
  const unresolvedCount = posts.filter((p) => !p.resolved && p.type === "question").length;

  const sections: DashboardSection[] = [
    {
      id: "today-topics",
      title: "今日のトピック",
      icon: "🔥",
      component: <TodayTopics />,
    },
    {
      id: "thanks-log",
      title: "感謝ログ",
      icon: "🙏",
      component: <ThanksLog />,
    },
    {
      id: "contribution",
      title: "自分の貢献状況",
      icon: "📊",
      component: <ContributionHeatmap />,
    },
    {
      id: "recommend",
      title: "今困っている人（レコメンド）",
      icon: "🎯",
      component: <RecommendPosts />,
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900/50 to-purple-900/50 border border-primary-500/20 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-purple-600/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">
              こんにちは、<span className="text-gradient">{currentUser.name}</span> 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              今日も知見をシェアして、チームを強くしよう
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-right">
            <div>
              <div className="text-2xl font-bold text-primary-400">{currentUser.contributions}</div>
              <div className="text-xs text-gray-500">貢献スコア</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{unresolvedCount}</div>
              <div className="text-xs text-gray-500">未解決の質問</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className={`glass rounded-2xl border border-white/5 p-5 ${section.colSpan ?? ""}`}
          >
            <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <span className="text-base">{section.icon}</span>
              {section.title}
            </h2>
            {section.component}
          </div>
        ))}
      </div>
    </div>
  );
}
