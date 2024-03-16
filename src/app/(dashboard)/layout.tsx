import Menu from "@/components/Menu";
import { getCurrentUser } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="container">
            <Menu />
            {children}
        </div>
    );
}
