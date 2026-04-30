import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login/page.tsx"),
    route("register", "routes/register/page.tsx"),
    route("forgot-password", "routes/forgot-password/page.tsx"),
    route("customer-profile", "routes/customer-profile/page.tsx"),
] satisfies RouteConfig;
