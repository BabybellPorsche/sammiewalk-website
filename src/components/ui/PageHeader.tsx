import type { ReactNode } from 'react';
import { typography } from '../../lib/styleguide';

interface PageHeaderProps {
    title: string;
    description: string;
    badgeText?: string;
    icon?: ReactNode;
}

export default function PageHeader({ title, description, badgeText, icon }: PageHeaderProps) {
    return (
        <header className="mb-8 md:mb-12">
            {(badgeText || icon) && (
                <div className="flex items-center gap-3 text-primary mb-2">
                    {icon}
                    {badgeText && (
                        <span className="font-bold tracking-wider uppercase text-sm">{badgeText}</span>
                    )}
                </div>
            )}
            <h1 className={`${typography.h1} mb-3`}>{title}</h1>
            <p className={typography.lead}>
                {description}
            </p>
        </header>
    );
}
