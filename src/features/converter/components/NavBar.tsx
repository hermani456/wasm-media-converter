import { ThemeToggle } from "./ThemeToggle";
import { Zap } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          {/* The Gradient Box */}
          <div className="bg-linear-to-br from-emerald-400 to-fuchsia-400 p-1.5 rounded-lg shadow-lg shadow-fuchsia-500/20">
            {/* The Icon: text-slate-950 creates the 'cutout' look */}
            <Zap className="w-5 h-5 dark:text-slate-950 text-white fill-current" />
          </div>

          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-br from-emerald-400 to-fuchsia-400 dark:from-emerald-200 dark:to-fuchsia-500">
            MediaForge
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />{" "}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
