"use client";

import { useState } from "react";
import { register } from "@/app/api/register/register";
import { login } from "@/app/api/login/login";
import styles from "./RegisterModal.module.css";

type Mode = "register" | "login";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
    const [mode, setMode] = useState<Mode>("register");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [err, setErr] = useState("");

    const switchMode = (m: Mode) => {
        setMode(m);
        setErr("");
        setDone(false);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        if (mode === "login") {
            const ok = await login({ username: username.trim(), password });
            setLoading(false);
            if (ok) setDone(true);
            else setErr("Неверный логин или пароль.");
            return;
        }

        const res = await register({ username: username.trim(), password });
        setLoading(false);
        if (res.ok) {
            setDone(true);
            return;
        }
        if (res.status === 409) setErr("Такой логин уже занят.");
        else if (res.status === 400) setErr("Введите логин и пароль.");
        else setErr("Не удалось зарегистрироваться. Попробуйте позже.");
    };

    const isLogin = mode === "login";

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={isLogin ? "Вход" : "Регистрация"}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose} aria-label="Закрыть">×</button>
                <h2 className={styles.heading}>{isLogin ? "Вход" : "Регистрация"}</h2>
                <p className={styles.subtitle}>
                    {isLogin ? "Войдите в свой аккаунт." : "Создайте аккаунт — по желанию."}
                </p>

                {done ? (
                    <p className={`${styles.message} ${styles.success}`}>
                        {isLogin ? "Вы вошли. Добро пожаловать!" : "Вы успешно зарегистрированы. Добро пожаловать!"}
                    </p>
                ) : (
                    <>
                        <form className={styles.form} onSubmit={onSubmit}>
                            <input
                                className={styles.input}
                                placeholder="Логин"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                            <input
                                className={styles.input}
                                placeholder="Пароль"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                            />
                            <button className={styles.button} type="submit" disabled={loading}>
                                {loading ? "Пожалуйста, подождите…" : isLogin ? "Войти" : "Зарегистрироваться"}
                            </button>
                            {err ? <p className={`${styles.message} ${styles.error}`}>{err}</p> : null}
                        </form>

                        <p className={styles.switch}>
                            {isLogin ? (
                                <>
                                    Нет аккаунта?{" "}
                                    <button type="button" className={styles.switchLink} onClick={() => switchMode("register")}>
                                        Зарегистрироваться
                                    </button>
                                </>
                            ) : (
                                <>
                                    Уже есть аккаунт?{" "}
                                    <button type="button" className={styles.switchLink} onClick={() => switchMode("login")}>
                                        Войти
                                    </button>
                                </>
                            )}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
