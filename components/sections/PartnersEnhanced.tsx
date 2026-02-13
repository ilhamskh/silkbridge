'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Building2, ShieldCheck, Users, Handshake } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import type { PublicPartner } from '@/lib/content';

// Category configuration with icons and labels
const CATEGORY_CONFIG = {
    GOVERNMENT: {
        icon: Building2,
        label: { en: 'Government', az: 'Dövlət', ru: 'Государство' },
        description: {
            en: 'Official governmental partners',
            az: 'Rəsmi dövlət tərəfdaşları',
            ru: 'Официальные государственные партнёры'
        }
    },
    HOSPITAL: {
        icon: ShieldCheck,
        label: { en: 'Healthcare', az: 'Səhiyyə', ru: 'Здравоохранение' },
        description: {
            en: 'Medical institutions and hospitals',
            az: 'Tibb müəssisələri və xəstəxanalar',
            ru: 'Медицинские учреждения и больницы'
        }
    },
    PHARMA: {
        icon: Users,
        label: { en: 'Pharmaceutical', az: 'Əczaçılıq', ru: 'Фармацевтика' },
        description: {
            en: 'Pharmaceutical companies and distributors',
            az: 'Əczaçılıq şirkətləri və distribyutorlar',
            ru: 'Фармацевтические компании и дистрибьюторы'
        }
    },
    INVESTOR: {
        icon: Handshake,
        label: { en: 'Investors', az: 'İnvestorlar', ru: 'Инвесторы' },
        description: {
            en: 'Investment and financial partners',
            az: 'İnvestisiya və maliyyə tərəfdaşları',
            ru: 'Инвестиционные и финансовые партнёры'
        }
    },
    ASSOCIATION: {
        icon: Users,
        label: { en: 'Associations', az: 'Assosiasiyalar', ru: 'Ассоциации' },
        description: {
            en: 'Industry associations and networks',
            az: 'Sənaye assosiasiyaları və şəbəkələr',
            ru: 'Отраслевые ассоциации и сети'
        }
    },
} as const;

interface PartnersEnhancedProps {
    partners: PublicPartner[];
    eyebrow?: string;
    headline: string;
    description?: string;
    locale: string;
}

export function PartnersEnhanced({
    partners,
    eyebrow,
    headline,
    description,
    locale,
}: PartnersEnhancedProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>('GOVERNMENT');
    const loc = locale as 'en' | 'az' | 'ru';

    // Group partners by category
    const groupedPartners = useMemo(() => {
        const groups: Record<string, PublicPartner[]> = {};

        partners.forEach(partner => {
            if (!groups[partner.category]) {
                groups[partner.category] = [];
            }
            groups[partner.category].push(partner);
        });

        return groups;
    }, [partners]);

    const categories = Object.keys(groupedPartners).sort();
    const hasPartners = partners.length > 0;

    // Trust statement
    const trustStatement = {
        en: 'Vetted and trusted partnerships across healthcare, government, and industry',
        az: 'Səhiyyə, dövlət və sənaye sahəsində yoxlanılmış və etibarlı tərəfdaşlıqlar',
        ru: 'Проверенные и надёжные партнёрства в здравоохранении, государстве и промышленности'
    };

    if (!hasPartners) {
        return <EmptyPartnersState locale={loc} />;
    }

    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    {eyebrow && (
                        <span className="inline-block text-primary-600 text-sm font-semibold tracking-wide uppercase mb-3">
                            {eyebrow}
                        </span>
                    )}
                    <h2 className="font-heading text-display-sm lg:text-display text-ink mb-4">
                        {headline}
                    </h2>
                    <p className="text-body-lg text-muted leading-relaxed mb-6">
                        {description || trustStatement[loc]}
                    </p>

                    {/* Category Legend Chips */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => {
                            const config = CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG];
                            const Icon = config?.icon || Users;
                            const count = groupedPartners[cat]?.length || 0;

                            return (
                                <div
                                    key={cat}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border-light rounded-pill text-body-sm"
                                >
                                    <Icon className="w-4 h-4 text-primary-600" />
                                    <span className="font-medium text-ink">
                                        {config?.label[loc] || cat}
                                    </span>
                                    <span className="text-muted">({count})</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop: Category Blocks (Stacked) */}
                <div className="hidden lg:block space-y-12">
                    {categories.map((category, catIndex) => {
                        const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
                        const Icon = config?.icon || Users;
                        const categoryPartners = groupedPartners[category] || [];

                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: catIndex * 0.1 }}
                            >
                                {/* Category Header */}
                                <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-primary-600">
                                    <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-heading text-h2 text-ink">
                                            {config?.label[loc] || category}
                                        </h3>
                                        <p className="text-body-sm text-muted">
                                            {config?.description[loc]}
                                        </p>
                                    </div>
                                    <div className="px-3 py-1 bg-primary-50 text-primary-700 font-semibold rounded-pill">
                                        {categoryPartners.length}
                                    </div>
                                </div>

                                {/* Partners Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {categoryPartners.map((partner, index) => (
                                        <PartnerCard
                                            key={partner.id}
                                            partner={partner}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile/Tablet: Accordion Layout */}
                <div className="lg:hidden space-y-3">
                    {categories.map((category) => {
                        const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
                        const Icon = config?.icon || Users;
                        const categoryPartners = groupedPartners[category] || [];
                        const isExpanded = expandedCategory === category;

                        return (
                            <div
                                key={category}
                                className="border border-border-light rounded-card-lg overflow-hidden bg-white shadow-sm"
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => setExpandedCategory(isExpanded ? null : category)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'bg-primary-600' : 'bg-primary-50'
                                            }`}>
                                            <Icon className={`w-5 h-5 ${isExpanded ? 'text-white' : 'text-primary-600'}`} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-heading text-h3 text-ink">
                                                {config?.label[loc] || category}
                                            </h3>
                                            <p className="text-caption text-muted">
                                                {categoryPartners.length} {loc === 'az' ? 'tərəfdaş' : loc === 'ru' ? 'партнёр' : 'partners'}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Accordion Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-border-light"
                                        >
                                            <div className="p-4 bg-surface">
                                                <div className="grid grid-cols-2 gap-3">
                                                    {categoryPartners.map((partner, index) => (
                                                        <PartnerCard
                                                            key={partner.id}
                                                            partner={partner}
                                                            index={index}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// Partner Card Component
function PartnerCard({ partner, index }: { partner: PublicPartner; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03 }}
        >
            <a
                href={partner.websiteUrl || '#'}
                target={partner.websiteUrl ? '_blank' : undefined}
                rel={partner.websiteUrl ? 'noopener noreferrer' : undefined}
                className={`group block h-full p-4 rounded-card bg-white border border-border-light hover:border-primary-200 hover:shadow-card transition-all duration-300 ${!partner.websiteUrl ? 'cursor-default' : ''
                    }`}
            >
                {/* Logo Container */}
                <div className="aspect-[3/2] rounded-lg bg-surface flex items-center justify-center mb-3 overflow-hidden relative">
                    {partner.logoUrl ? (
                        <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            width={100}
                            height={60}
                            className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        // Fallback to initials
                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                            <span className="text-primary-600 font-heading font-bold text-lg">
                                {partner.name.charAt(0)}
                            </span>
                        </div>
                    )}

                    {/* Visit hint overlay */}
                    {partner.websiteUrl && (
                        <div className="absolute inset-0 bg-primary-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white text-body-sm font-medium flex items-center gap-1">
                                Visit
                                <ExternalLink className="w-4 h-4" />
                            </span>
                        </div>
                    )}
                </div>

                {/* Partner Info */}
                <h4 className="font-medium text-body-sm text-ink line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                    {partner.name}
                </h4>

                {partner.description && (
                    <p className="text-caption text-muted line-clamp-2">
                        {partner.description}
                    </p>
                )}
            </a>
        </motion.div>
    );
}

// Empty State Component
function EmptyPartnersState({ locale }: { locale: 'en' | 'az' | 'ru' }) {
    const content = {
        en: {
            title: "We're Building Our Partner Network",
            description: "We're actively expanding our network of trusted partners across healthcare, government, and industry.",
            cta: "Become a Partner"
        },
        az: {
            title: "Tərəfdaş Şəbəkəmizi Genişləndiririk",
            description: "Biz səhiyyə, dövlət və sənaye sahələrində etibarlı tərəfdaş şəbəkəmizi fəal şəkildə genişləndiririk.",
            cta: "Tərəfdaş Olun"
        },
        ru: {
            title: "Мы Расширяем Сеть Партнёров",
            description: "Мы активно расширяем нашу сеть надёжных партнёров в здравоохранении, государстве и промышленности.",
            cta: "Стать партнёром"
        }
    };

    const text = content[locale];

    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 mb-6">
                    <Handshake className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="font-heading text-display-sm text-ink mb-4">
                    {text.title}
                </h2>
                <p className="text-body-lg text-muted mb-8 leading-relaxed">
                    {text.description}
                </p>
                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-pill hover:bg-primary-700 shadow-button hover:shadow-button-hover transition-all"
                >
                    {text.cta}
                    <ExternalLink className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
