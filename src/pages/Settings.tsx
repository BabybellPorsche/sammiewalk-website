import { useAuth } from '../lib/AuthContext';
import { User } from 'lucide-react';

export default function Settings() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8 w-full">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your account and profile preferences.</p>
            </div>

            <div className="bg-card border border-border/10 rounded-3xl p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                        <User className="w-5 h-5" />
                    </div>
                    Profile Information
                </h2>

                <div className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Registered Email</label>
                        <input
                            type="email"
                            disabled
                            value={user?.email || ''}
                            className="w-full bg-muted border border-border/10 rounded-xl px-4 py-3 text-muted-foreground font-medium cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Your email is tied to our authentication provider and cannot be changed here.</p>
                    </div>

                    <div className="pt-6 border-t border-border/10">
                        <button className="px-6 py-3 rounded-xl font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
