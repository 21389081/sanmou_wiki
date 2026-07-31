'use client';

import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { loginAdminAction } from './actions';

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        startTransition(async () => {
            const result = await loginAdminAction(password);
            if (!result.success) {
                setError(result.message);
                return;
            }
            setPassword('');
            router.refresh();
        });
    };

    return (
        <div className='relative min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 overflow-hidden'>
            <div className='pointer-events-none absolute inset-0'>
                <div className='absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-gold/8 blur-3xl' />
                <div className='absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent' />
                <div className='absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent-gold/5' />
            </div>

            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className='relative w-full max-w-md'
                aria-labelledby='admin-login-title'
            >
                <div className='absolute -inset-px rounded-2xl bg-gradient-to-b from-accent-gold/35 via-white/5 to-transparent' />
                <div className='relative overflow-hidden rounded-2xl bg-surface/95 p-7 shadow-2xl shadow-black/50 sm:p-9'>
                    <div className='absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full border border-accent-gold/20' />
                    <div className='mb-8 flex items-start justify-between gap-6'>
                        <div>
                            <p className='mb-2 text-xs tracking-[0.28em] text-accent-gold'>內務府 · 陣容錄入</p>
                            <h1 id='admin-login-title' className='text-3xl font-serif'>驗明軍令</h1>
                            <p className='mt-3 text-sm leading-6 text-foreground-muted'>
                                此處僅供管理員維護配將資料，驗證後可使用八小時。
                            </p>
                        </div>
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent-gold/30 bg-accent-gold/10 text-accent-gold'>
                            <ShieldCheck size={22} aria-hidden='true' />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <label htmlFor='admin-password' className='mb-2 block text-sm text-foreground-muted'>
                                管理員密碼
                            </label>
                            <div className='group relative'>
                                <KeyRound
                                    size={17}
                                    className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted transition-colors group-focus-within:text-accent-gold'
                                    aria-hidden='true'
                                />
                                <input
                                    id='admin-password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete='current-password'
                                    required
                                    autoFocus
                                    className='w-full rounded-xl border border-white/10 bg-black/25 py-3 pl-11 pr-11 text-foreground outline-none transition placeholder:text-foreground-muted/50 focus:border-accent-gold/60 focus:ring-2 focus:ring-accent-gold/10'
                                    placeholder='輸入軍令密碼'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    className='absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground-muted transition hover:bg-white/5 hover:text-foreground'
                                    aria-label={showPassword ? '隱藏密碼' : '顯示密碼'}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {error && (
                                <p className='mt-2 text-sm text-red-300' role='alert'>
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type='submit'
                            disabled={isPending || !password}
                            className='flex w-full items-center justify-center gap-2 rounded-xl bg-accent-gold px-5 py-3 font-medium text-background transition hover:bg-accent-gold/90 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {isPending ? <Loader2 size={18} className='animate-spin' /> : <ShieldCheck size={18} />}
                            {isPending ? '驗證中' : '進入陣容錄入'}
                        </button>
                    </form>

                    <div className='mt-6 border-t border-white/8 pt-5 text-xs leading-5 text-foreground-muted'>
                        密碼只會送往伺服器驗證，不會儲存在瀏覽器或資料庫。
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
