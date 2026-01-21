import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "@/context/ProjectContext";
import { FloatingCallButton } from "@/components/FloatingCallButton";
import Index from "./pages/Index";
import StudioDashboard from "./pages/StudioDashboard";
import ProjectDetail from "./pages/ProjectDetail";
import ClientAccess from "./pages/ClientAccess";
import ClientGallery from "./pages/ClientGallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProjectProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <FloatingCallButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/studio" element={<StudioDashboard />} />
            <Route path="/studio/project/:projectId" element={<ProjectDetail />} />
            <Route path="/client" element={<ClientAccess />} />
            <Route path="/client/gallery/:projectId" element={<ClientGallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProjectProvider>
  </QueryClientProvider>
);

export default App;
