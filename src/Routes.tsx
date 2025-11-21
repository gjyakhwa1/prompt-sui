import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/notfound";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";

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
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/sell-prompt",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <NotFound />,
  },
]);
