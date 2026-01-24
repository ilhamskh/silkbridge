import { setRequestLocale } from 'next-intl/server';
import HeroParallax from '@/components/sections/HeroParallax';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import InsightsSnapshot from '@/components/sections/InsightsSnapshot';
import Partners from '@/components/sections/Partners';
import Contact from '@/components/sections/Contact';

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <HeroParallax />
            <About />
            <Services />
            <InsightsSnapshot />
            <Partners />
            <Contact />
        </>
    );
}
