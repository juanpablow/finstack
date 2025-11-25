interface TabNavigationProps {
  activeTab: "budget" | "goals";
  onTabChange: (tab: "budget" | "goals") => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onTabChange("budget")}
        className={`px-6 py-3 font-semibold rounded-lg transition-colors cursor-pointer min-w-[140px] ${
          activeTab === "budget"
            ? "bg-primary text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Orçamento
      </button>
      <button
        onClick={() => onTabChange("goals")}
        className={`px-6 py-3 font-semibold rounded-lg transition-colors cursor-pointer min-w-[140px] ${
          activeTab === "goals"
            ? "bg-primary text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Metas
      </button>
    </div>
  );
}
