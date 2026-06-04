import { lazy, Suspense, useEffect } from "react";
import type { CSSProperties } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";
import type { Route } from "./+types/root";
import { ChakraProvider } from "@chakra-ui/react";
import { brand, system } from "./chakraTheme";
import { useAuthStore } from "./stores/authStore";
import "./app.css";

if (import.meta.env.DEV && !import.meta.env.SSR) {
  import("./mocks")
    .then(({ startMocks }) => {
      startMocks();
    })
    .catch((error) => {
      console.error("Failed to start MSW:", error);
    });
}

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const LazyAuthLayout = lazy(() => import("./layouts/AuthLayout"));
const LazyMainLayout = lazy(() => import("./layouts/MainLayout"));

function LayoutFallback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100dvh",
        background: brand.colors.bg0,
        color: brand.colors.text,
        fontFamily: brand.fonts.sans,
      }}
    >
      載入中
    </div>
  );
}

function ErrorFallback({ message, details, stack }: { message: string; details: string; stack?: string }) {
  return (
    <main
      className="min-h-dvh flex items-center justify-center p-4"
      style={{
        background: brand.colors.bg0,
        color: brand.colors.text,
        fontFamily: brand.fonts.sans,
      }}
    >
      <div
        style={{
          maxWidth: "28rem",
          width: "100%",
          background: brand.surfaces.glassStrong,
          border: `1px solid ${brand.colors.lineSoft}`,
          borderRadius: brand.radii.panel,
          boxShadow: brand.shadows.panel,
          padding: "2rem",
        }}
      >
        <div className="text-center">
          <div
            style={{
              color: brand.colors.amberLight,
              fontSize: "3rem",
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: "1rem",
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: brand.colors.text, marginBottom: "0.5rem" }}>
            {message}
          </h1>
          <p style={{ color: brand.colors.textMuted, marginBottom: "1rem" }}>{details}</p>
          <div
            style={{
              background: brand.colors.bg1,
              border: `1px solid ${brand.colors.lineSoft}`,
              borderRadius: brand.radii.crisp,
              padding: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ fontSize: "0.875rem", color: brand.colors.text }}>
              {message}
            </p>
            {import.meta.env.DEV && stack && (
              <pre
                style={{
                  fontSize: "0.75rem",
                  color: brand.colors.textDim,
                  marginTop: "0.5rem",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                }}
              >
                {stack}
              </pre>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: `linear-gradient(90deg, ${brand.colors.amberDeep}, ${brand.colors.amber})`,
              color: brand.colors.bg0,
              padding: "0.75rem 1.5rem",
              borderRadius: brand.radii.pill,
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            重新整理
          </button>
        </div>
      </div>
    </main>
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
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=TASA+Explorer:wght@400..800&display=swap",
  },
];

export function meta() {
  return [
    { title: "CDP 系統模板" },
    {
      name: "description",
      content: "檢視資料來源、建立面板，並把資料圖表放進同一個工作台。",
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        style={
          {
            "--aurum-bg0": brand.colors.bg0,
            "--aurum-bg1": brand.colors.bg1,
            "--aurum-bg2": brand.colors.bg2,
            "--aurum-bg-deep-soft": brand.surfaces.bgDeepSoft,
            "--aurum-amber-glow": brand.surfaces.heroGlow,
            "--aurum-amber-glow-soft": brand.surfaces.heroGlowSoft,
            "--aurum-amber-hover": brand.surfaces.amberHover,
            "--aurum-amber-hover-strong": brand.surfaces.amberHoverStrong,
            "--aurum-danger-hover": brand.surfaces.dangerHover,
            "--aurum-danger-hover-strong": brand.surfaces.dangerHoverStrong,
            "--aurum-chart-grid": brand.surfaces.chartGrid,
            "--aurum-chart-cursor": brand.surfaces.chartCursor,
            "--aurum-line": brand.colors.line,
            "--aurum-line-soft": brand.colors.lineSoft,
            "--aurum-text": brand.colors.text,
            "--aurum-text-muted": brand.colors.textMuted,
            "--aurum-amber": brand.colors.amber,
            "--aurum-amber-light": brand.colors.amberLight,
          } as CSSProperties
        }
      >
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

  const isAuthRoute = AUTH_ROUTES.some((route) => currentPath === route || currentPath.startsWith(`${route}/`));

  useEffect(() => {
    if (!isAuthRoute && !isAuthenticated) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    if (isAuthRoute && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isAuthRoute, navigate, location]);

  return (
    <ChakraProvider value={system}>
      <Suspense fallback={<LayoutFallback />}>
        {isAuthRoute ? (
          <LazyAuthLayout>
            <Outlet />
          </LazyAuthLayout>
        ) : (
          <LazyMainLayout>
            <Outlet />
          </LazyMainLayout>
        )}
      </Suspense>
    </ChakraProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "發生未預期的錯誤";
  let details = "請稍後再試一次。";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "找不到頁面" : "路由錯誤";
    details = error.status === 404 ? "你要找的頁面不存在或已被移除。" : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return <ErrorFallback message={message} details={details} stack={stack} />;
}
