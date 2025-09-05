import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AssemblyUnits from "./pages/AssemblyUnits";
import Batches from "./pages/Batches";
import WorkOrders from "./pages/WorkOrders";
import BillOfMaterials from "./pages/BillOfMaterials";
import NotFound from "./pages/NotFound";
import RawMaterialScanForm from "./components/form/RawMaterialScanForm";
import RMCheck from "./pages/RMCheck";
import ProcessExecution from "./pages/ProcessExecution";
import ConfigurablePageRenderer from "./components/ConfigurablePageRenderer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assembly-units" element={<AssemblyUnits />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/raw-materials" element={<RMCheck />} />
          <Route path="/stations" element={<Dashboard />} />
          <Route path="/bill-of-materials" element={<BillOfMaterials />} />
          <Route path="/process-steps" element={<Dashboard />} />
          <Route path="/process-execution" element={<ProcessExecution />} />
          <Route path="/configurable-workflow" element={<ConfigurablePageRenderer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;