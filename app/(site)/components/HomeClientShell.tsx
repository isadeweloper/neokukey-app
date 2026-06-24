'use client';

import useIsMobile from '@/app/(site)/hooks/useIsMobile';

export default function HomeClientShell({
                                            desktop,
                                            mobile,
                                        }: {
    desktop: React.ReactNode;
    mobile: React.ReactNode;
}) {
    const isMobile = useIsMobile(768);

    return <>{isMobile ? mobile : desktop}</>;
}
