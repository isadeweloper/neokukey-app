import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;

export const POST = async (req: NextRequest) => {
    const target = new URL(`${BACKEND_URL}/api/cms/register`);
    const body = await req.text();
    const controller = new AbortController();
    // Allow for a cold backend (free-tier services sleep and take ~30-60s to wake).
    const timer = setTimeout(() => controller.abort(), 90000);

    try {
        const r = await fetch(target, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body,
            cache: "no-store",
            signal: controller.signal,
        });

        const text = await r.text();
        let data: unknown = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            return NextResponse.json(
                { error: "invalid_backend_response" },
                { status: 502 },
            );
        }

        const res = NextResponse.json(data, { status: r.status });
        const setCookie = r.headers.get("set-cookie");
        if (setCookie) res.headers.append("set-cookie", setCookie);
        return res;
    } catch (err: unknown) {
        const name = err instanceof Error ? err.name : "";
        const msg = name === "AbortError" ? "backend_timeout" : "backend_unreachable";
        return NextResponse.json({ error: msg }, { status: 502 });
    } finally {
        clearTimeout(timer);
    }
};
