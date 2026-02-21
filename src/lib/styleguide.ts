// Shared styleguide constants for a unified premium feel

export const springConfig = {
    // Standard UI transitions (e.g., modals, layout changes)
    default: { type: "spring", stiffness: 300, damping: 24 },
    // Snappy, energetic transitions (e.g., buttons, hover effects)
    snappy: { type: "spring", stiffness: 400, damping: 17 },
    // Soft, elegant transitions (e.g., page loads, large hero elements)
    gentle: { type: "spring", stiffness: 200, damping: 20 },
    // Rebounding, playful transitions (e.g., success checkmarks)
    bouncy: { type: "spring", stiffness: 260, damping: 15 },
} as const;

export const hoverConfig = {
    // Standard interactive elements (buttons) - simple matte hover
    button: { opacity: 0.95 },
    // Emphasized interactive elements (primary buttons)
    buttonEmphasized: { opacity: 0.9 },
    // Cards and larger interactive areas
    card: { y: -2 },
    // Image galleries and prominent visual elements
    image: { scale: 1.05 },
    // Sub-element icon wiggle (pure rotation, no scale)
    iconWiggle: { rotate: [0, -5, 5, 0] },
};

export const tapConfig = {
    // Subtle opacity/brightness change for click feedback without scaling
    default: { opacity: 0.8 },
    sharp: { opacity: 0.7 },
    gentle: { opacity: 0.9 },
} as const;

export const typography = {
    // Massive hero text (e.g. Dashboard)
    display: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]",
    // Hero headers & massive emphasis
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]",
    // Page & section headers
    h2: "text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight",
    // Subsection headers & primary card titles
    h3: "text-xl md:text-2xl font-bold tracking-tight leading-tight",
    // Small card titles, emphasized minor headers
    h4: "text-lg font-bold tracking-tight leading-snug",
    // Standard paragraph copy
    body: "text-base md:text-lg leading-relaxed text-muted-foreground",
    // Large intro paragraph text
    lead: "text-lg md:text-xl font-normal leading-relaxed text-muted-foreground",
    // Small utility text, meta info
    small: "text-sm font-medium leading-none text-muted-foreground",
    // Tiny label text
    tiny: "text-xs font-bold uppercase tracking-wider",
} as const;

export const borderRadius = {
    // Standard interactive elements (buttons, inputs)
    interactive: "rounded-xl",
    // Standard containers (cards, modals)
    container: "rounded-2xl",
    // Maximized rounded sections (page wrappers, large hero images)
    max: "rounded-[2.5rem]",
} as const;

export const effects = {
    // Premium glassmorphism effect used on badges and floating items over images
    glass: "backdrop-blur-md border border-white/20",
} as const;
