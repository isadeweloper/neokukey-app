"use client";

import { useState } from "react";
import { register } from "@/app/api/register/register";
import styles from "./RegisterModal.module.css";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [err, setErr] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
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

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Регистрация">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={onClose} aria-label="Закрыть">×</button>
                <h2 className={styles.heading}>Регистрация</h2>
                <p className={styles.subtitle}>Создайте аккаунт — по желанию.</p>

                {done ? (
                    <p className={`${styles.message} ${styles.success}`}>
                        Вы успешно зарегистрированы. Добро пожаловать!
                    </p>
                ) : (
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
                            autoComplete="new-password"
                            required
                        />
                        <button className={styles.button} type="submit" disabled={loading}>
                            {loading ? "Регистрация…" : "Зарегистрироваться"}
                        </button>
                        {err ? <p className={`${styles.message} ${styles.error}`}>{err}</p> : null}
                    </form>
                )}
            </div>
        </div>
    );
}
