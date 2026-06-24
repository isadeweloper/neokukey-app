"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginRequest } from "@/app/api/interaface/LoginRequest";
import { login } from "@/app/api/login/login";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        const payload: LoginRequest = { username, password };
        const ok = await login(payload);
        setLoading(false);
        if (!ok) {
            setErr("Неверный логин или пароль");
            return;
        }
        router.push("/admin");
        router.refresh();
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 12px",
        border: "1px solid #cccccc",
        borderRadius: 6,
        fontSize: 14,
        outline: "none",
        background: "#fff",
        color: "#111",
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "#ffffff",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                fontFamily: "system-ui, -apple-system, sans-serif",
            }}
        >
            <h1
                style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#111",
                    margin: 0,
                    marginBottom: 28,
                }}
            >
                PREMIUM
            </h1>

            <form
                onSubmit={onSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    width: 320,
                    border: "1px solid #cccccc",
                    borderRadius: 8,
                    padding: 24,
                }}
            >
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" }}>
                    Вход администратора
                </p>
                <input
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                    style={inputStyle}
                />
                <input
                    placeholder="Пароль"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    style={inputStyle}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "10px 12px",
                        border: "1px solid #111",
                        borderRadius: 6,
                        background: loading ? "#666" : "#111",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: loading ? "default" : "pointer",
                    }}
                >
                    {loading ? "Вход…" : "Войти"}
                </button>
                {err ? <div style={{ color: "#c00", fontSize: 13 }}>{err}</div> : null}
            </form>
        </div>
    );
}
