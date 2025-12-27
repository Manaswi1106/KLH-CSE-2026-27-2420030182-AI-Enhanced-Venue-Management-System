import React from "react";

interface Props {
  page: "login" | "explorer" | "dashboard" | "map" | "organizer";
  children: React.ReactNode;
}

const PageBackground: React.FC<Props> = ({ page, children }) => {
  const backgrounds: Record<string, string> = {
    login:
      "bg-gradient-to-br from-indigo-700 via-purple-700 to-slate-900",
    explorer:
      "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
    dashboard:
      "bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950",
    map:
      "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
    organizer:
      "bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950",
  };

  return (
    <div className={`min-h-screen w-full ${backgrounds[page]} relative`}>
      {/* subtle glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#6366f1,_transparent_60%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default PageBackground;
