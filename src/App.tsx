import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootProvider } from "@/core/providers/RootProvider";
import { routeConfig, errorRoute, type RouteConfig } from "@/core/config/routes";
import { ProtectedRoute } from "@/core/routes";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Recursive function to render routes from configuration
const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route, index) => {
    const Element = route.element;
    
    if (route.children) {
      return (
        <Route
          key={route.path + index}
          path={route.path}
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Element />
              </Suspense>
            </ProtectedRoute>
          }
        >
          {route.children.map((child, childIndex) => {
            const ChildElement = child.element;
            return (
              <Route
                key={child.path + childIndex}
                path={child.path}
                index={child.index}
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ChildElement />
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      );
    }

    // Only protect dashboard routes (routes starting with /dashboard)
    const shouldProtect = route.path.startsWith('/dashboard');
    
    return (
      <Route
        key={route.path + index}
        path={route.path}
        index={route.index}
        element={
          shouldProtect ? (
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Element />
              </Suspense>
            </ProtectedRoute>
          ) : (
            <Suspense fallback={<LoadingFallback />}>
              <Element />
            </Suspense>
          )
        }
      />
    );
  });
};

const App = () => {
  const ErrorElement = errorRoute.element;
  
  return (
    <RootProvider>
      <BrowserRouter>
        <Routes>
          {renderRoutes(routeConfig)}
          
          {/* Catch-all error route */}
          <Route 
            path={errorRoute.path} 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ErrorElement />
              </Suspense>
            } 
          />
        </Routes>
      </BrowserRouter>
    </RootProvider>
  );
};

export default App;
