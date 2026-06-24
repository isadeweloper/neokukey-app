import { LoginRequest } from "@/app/api/interaface/LoginRequest";

export type RegisterResult = { ok: true } | { ok: false; status: number };

export const register = async (payload: LoginRequest): Promise<RegisterResult> => {
    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
            cache: "no-store",
        });
        if (!response.ok) return { ok: false, status: response.status };
        return { ok: true };
    } catch {
        return { ok: false, status: 0 };
    }
};
