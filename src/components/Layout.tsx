import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle, Settings, LogOut, Info as InfoIcon, ArrowUp, Map, Star, Compass, Heart } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import AnimatedButton from './ui/AnimatedButton';

const navItems = [
    { icon: Star, label: 'Uitgelicht', to: '/' },
    { icon: Compass, label: 'Alle Routes', to: '/routes' },
    { icon: Heart, label: 'Bewaard', to: '/saved' },
    { icon: InfoIcon, label: 'Info & FAQ', to: '/info' },
    { icon: PlusCircle, label: 'Nieuwe Route', to: '/editor' },
    { icon: Settings, label: 'Instellingen', to: '/settings' },
];

export default function Layout() {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const mainRef = useRef<HTMLElement>(null);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const handleScroll = () => {
        if (mainRef.current) {
            setShowBackToTop(mainRef.current.scrollTop > 300);
        }
    };

    const scrollToTop = () => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Reset scroll on route change
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [location.pathname]);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            <aside className="w-64 border-r border-border/10 bg-card hidden md:flex flex-col">
                <Link to="/" className="p-6 pb-12 flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                        <Map className="w-5 h-5 text-white/90" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight leading-none text-foreground">SammieWalk</h1>
                    </div>
                </Link>

                <motion.nav
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
                    }}
                    initial="hidden"
                    animate="show"
                    className="flex-1 px-4 py-4 space-y-2"
                >
                    {navItems.map((item) => (
                        (!user && (item.to === '/editor' || item.to === '/settings')) ? null : (
                            <motion.div
                                key={item.label}
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                }}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <NavLink
                                    to={item.to}
                                    className="block"
                                >
                                    {({ isActive }) => (
                                        <AnimatedButton
                                            variant={isActive ? "primary" : "ghost"}
                                            icon={<item.icon className="w-5 h-5" />}
                                            className={`w-full justify-start ${isActive ? 'shadow-lg shadow-primary/20' : ''}`}
                                        >
                                            {item.label}
                                        </AnimatedButton>
                                    )}
                                </NavLink>
                            </motion.div>
                        )
                    ))}
                </motion.nav>

                {user && (
                    <div className="p-4 border-t border-border/10">
                        <AnimatedButton
                            onClick={handleLogout}
                            variant="ghost"
                            icon={<LogOut className="w-5 h-5" />}
                            className="w-full justify-start text-muted-foreground"
                        >
                            Log Out
                        </AnimatedButton>
                    </div>
                )}
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className={`h-16 border-b border-border/10 flex items-center justify-between px-4 md:px-6 shrink-0 bg-background z-30 relative ${!user ? 'md:hidden' : ''}`}>
                    <div className="flex items-center gap-2 md:hidden">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                                <Map className="w-5 h-5 text-white/90" />
                            </div>
                            <h1 className="font-bold text-xl tracking-tight leading-none text-foreground">SammieWalk</h1>
                        </Link>
                    </div>

                    <div className="flex-1 hidden md:block"></div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium leading-none">{user.email}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Admin</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-primary/20 border border-border/10 overflow-hidden flex items-center justify-center text-primary font-bold">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main
                    ref={mainRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-auto bg-background pb-24 md:pb-0 relative"
                >
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full min-h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>

                    {/* Back to Top Button */}
                    <AnimatePresence>
                        {showBackToTop && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                onClick={scrollToTop}
                                className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors pointer-events-auto"
                                aria-label="Terug naar boven"
                            >
                                <ArrowUp className="w-5 h-5" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/10 z-50 flex items-center justify-around px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
                {navItems.map((item) => (
                    (!user && (item.to === '/editor' || item.to === '/settings')) ? null : (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `relative flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors z-10 ${isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav-mobile"
                                            className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'mb-0' : 'mb-1'}`} />
                                    {!isActive && <span className="text-[10px] font-medium">{item.label}</span>}
                                </>
                            )}
                        </NavLink>
                    )
                ))}
            </div>
        </div>
    );
}
