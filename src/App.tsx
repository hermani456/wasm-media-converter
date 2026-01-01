import { Navbar } from "./features/converter/components/NavBar";
import { ThemeProvider } from "./features/converter/components/ThemeProvider";
import { ConverterDashboard } from "./features/converter/components/ConverterDashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="media-forge-theme">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
        <Navbar />
        <div className="pt-10">
          <ConverterDashboard />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
