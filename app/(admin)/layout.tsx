import type { Metadata } from "next";
import AdminHeader from "@/app/(admin)/admin/components/header/AdminHeader";

// Keep the whole admin area (incl. /login) out of search engines.
export const metadata: Metadata = {
    title: "Админ-панель — PREMIUM",
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminHeader />
            <main style={{ paddingTop: 70 }}>{children}</main>
        </>
    );
}