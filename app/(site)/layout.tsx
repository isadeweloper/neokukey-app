import Header from "@/app/(site)/components/Header";
import Footer from "@/app/(site)/components/Footer";
import A11yToggle from "@/app/(site)/components/A11yToggle";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="site">
            <Header />
            <div className="max-w-[980px] mx-auto px-4 pt-3 flex justify-end">
                <A11yToggle />
            </div>
            <main className="site-main">{children}</main>
            <Footer />
        </div>
    );
}