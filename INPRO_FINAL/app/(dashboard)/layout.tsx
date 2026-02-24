import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PaywallLock } from "@/components/PaywallLock";
import { TrialBanner } from "@/components/TrialBanner";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Buscar el usuario en nuestra base de datos para ver su estado de suscripción
    let dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
    });

    // Si no existe (primer log-in), el webhook de Clerk ya debería haberlo creado.
    // Pero como medida de seguridad, si no existe, lo redirigimos para que se complete el perfil.
    if (!dbUser) {
        // En un flujo real, aquí podríamos crearlo o esperar al webhook.
        return <div>Cargando perfil...</div>;
    }

    const now = new Date();
    const trialExpired = now > new Date(dbUser.trial_end) && dbUser.subscription_status !== "ACTIVE";

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Banner de Trial persistente si está en periodo de prueba */}
            {dbUser.subscription_status === "TRIAL_ING" && !trialExpired && (
                <TrialBanner trialEndDate={dbUser.trial_end.toISOString()} />
            )}

            {/* El Bloqueo Total del Día 16 */}
            {trialExpired && <PaywallLock />}

            {/* Contenido del Dashboard (Kanban, Buscador, etc) */}
            <div className={trialExpired ? "pointer-events-none select-none" : ""}>
                {children}
            </div>
        </div>
    );
}
