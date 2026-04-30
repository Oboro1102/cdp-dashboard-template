import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router";
import type { Route } from "./+types/root";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { useAuthStore } from "./stores/authStore";
import { useEffect, lazy, Suspense } from "react";
import "./app.css";

// 在開發環境啟動 MSW
if (import.meta.env.DEV && !import.meta.env.SSR) {
  import('./mocks').then(({ startMocks }) => {
    startMocks();
  }).catch((error) => {
    console.error('Failed to start MSW:', error);
  });
}

// 認證相關路由
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

// 使用 React.lazy 進行懶加載
const LazyAuthLayout = lazy(() => import('./layouts/AuthLayout'));
const LazyMainLayout = lazy(() => import('./layouts/MainLayout'));

// Loading 組件
function LayoutFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      載入中...
    </div>
  );
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // 檢查是否為認證路由
  const isAuthRoute = AUTH_ROUTES.some(route =>
    currentPath === route || currentPath.startsWith(route + '/')
  );

  // 檢查是否為公開路由
  const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    currentPath === route || currentPath.startsWith(route + '/')
  );

  // 使用 useEffect 處理路由重定向，避免無限循環
  useEffect(() => {
    // 需要認證但未登入：重定向到登入頁面
    if (!isAuthRoute && !isPublicRoute && !isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // 已登入但訪問公開路由（如登入頁）：重定向到首頁
    if (isPublicRoute && isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, isAuthRoute, isPublicRoute, navigate, location]);

  return (
    <ChakraProvider value={defaultSystem}>
      <Suspense fallback={<LayoutFallback />}>
        {isAuthRoute ? (
          <LazyAuthLayout><Outlet /></LazyAuthLayout>
        ) : (
          <LazyMainLayout><Outlet /></LazyMainLayout>
        )}
      </Suspense>
    </ChakraProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
