import { authMiddleware } from "@clerk/nextjs";

// Este middleware protege todas las rutas dentro de /(dashboard)
// Las rutas fuera de ahí (like landing page /) son públicas por defecto
export default authMiddleware({
    publicRoutes: ["/", "/api/webhooks/payments"],
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
