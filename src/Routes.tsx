import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/notfound";
import Dashboard from "@/pages/dashboard";
import Marketplace from "@/pages/marketplace";
import SellPrompt from "@/pages/sell-prompt";
import PromptDetail from "@/pages/prompt-detail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      //   <Suspense fallback={<Spinner />}>
      <Index />
      //   </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <NotFound />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
    errorElement: <NotFound />,
  },
  {
    path: "/sell-prompt",
    element: <SellPrompt />,
    errorElement: <NotFound />,
  },
  {
    path: "/sell-prompt/:id",
    element: <SellPrompt />,
    errorElement: <NotFound />,
  },
  {
    path: "/prompt/:id",
    element: <PromptDetail />,
    errorElement: <NotFound />,
  },
]);
