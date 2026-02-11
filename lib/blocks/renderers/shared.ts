import { Icons } from '@/components/ui/Icons';

// ============================================
// Animation Variants (shared across all block renderers)
// ============================================

export const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

// ============================================
// Icon Mapping
// ============================================

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    regulatory: Icons.regulatory,
    market: Icons.market,
    wellness: Icons.wellness,
    insights: Icons.insights,
    search: Icons.search,
    strategy: Icons.regulatory,
    execute: Icons.market,
    success: Icons.wellness,
};
