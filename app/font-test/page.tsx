export default function FontTestPage() {
    return (
        <div className="min-h-screen bg-surface p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-heading font-bold text-ink mb-8">
                    Font Rendering Test
                </h1>

                <div className="space-y-12">
                    {/* Azerbaijani Test */}
                    <section className="p-6 bg-white rounded-xl border border-border-light">
                        <h2 className="text-xl font-heading font-semibold text-primary-600 mb-4">
                            Azerbaijani (Azərbaycan)
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted mb-2">Inter Font (Body):</p>
                                <p className="text-2xl font-sans text-ink">
                                    Azərbaycan, ə, ş, ğ, ç, ö, ü
                                </p>
                                <p className="text-lg font-sans text-muted mt-2">
                                    Silkbridge International Azərbaycanda sağlamlıq və wellness turizmi xidmətləri təqdim edir.
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted mb-2">Manrope Font (Headings):</p>
                                <p className="text-2xl font-heading font-bold text-ink">
                                    Azərbaycan, ə, ş, ğ, ç, ö, ü
                                </p>
                                <p className="text-lg font-heading text-muted mt-2">
                                    Bazarları və Sağlamlıq Turizmini Birləşdiririk
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Russian Test */}
                    <section className="p-6 bg-white rounded-xl border border-border-light">
                        <h2 className="text-xl font-heading font-semibold text-primary-600 mb-4">
                            Russian (Русский)
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted mb-2">Inter Font (Body):</p>
                                <p className="text-2xl font-sans text-ink">
                                    Россия, Привет мир
                                </p>
                                <p className="text-lg font-sans text-muted mt-2">
                                    Silkbridge International предоставляет услуги фармацевтического консалтинга и медицинского туризма.
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted mb-2">Manrope Font (Headings):</p>
                                <p className="text-2xl font-heading font-bold text-ink">
                                    Россия, Привет мир
                                </p>
                                <p className="text-lg font-heading text-muted mt-2">
                                    Связываем Рынки и Медицинский Туризм
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* English Control */}
                    <section className="p-6 bg-white rounded-xl border border-border-light">
                        <h2 className="text-xl font-heading font-semibold text-primary-600 mb-4">
                            English (Control)
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted mb-2">Inter Font (Body):</p>
                                <p className="text-2xl font-sans text-ink">
                                    Silkbridge International
                                </p>
                                <p className="text-lg font-sans text-muted mt-2">
                                    Connecting Markets & Health Tourism Across Borders
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted mb-2">Manrope Font (Headings):</p>
                                <p className="text-2xl font-heading font-bold text-ink">
                                    Silkbridge International
                                </p>
                                <p className="text-lg font-heading text-muted mt-2">
                                    Premium Healthcare Services
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Character Grid */}
                    <section className="p-6 bg-white rounded-xl border border-border-light">
                        <h2 className="text-xl font-heading font-semibold text-primary-600 mb-4">
                            Special Characters Grid
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['ə', 'ğ', 'ş', 'ç', 'ö', 'ü', 'Ə', 'Ğ', 'Ş', 'Ç', 'Ö', 'Ü'].map((char) => (
                                <div key={char} className="p-4 bg-surface rounded-lg text-center">
                                    <p className="text-4xl font-sans text-ink mb-1">{char}</p>
                                    <p className="text-xs text-muted">Azerbaijani</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {['А', 'Б', 'В', 'Г', 'Д', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л'].map((char) => (
                                <div key={char} className="p-4 bg-surface rounded-lg text-center">
                                    <p className="text-4xl font-sans text-ink mb-1">{char}</p>
                                    <p className="text-xs text-muted">Cyrillic</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Status Info */}
                    <section className="p-6 bg-primary-50 rounded-xl border border-primary-200">
                        <h3 className="font-heading font-semibold text-ink mb-2">
                            ✅ Font Configuration Status
                        </h3>
                        <ul className="space-y-1 text-sm text-muted">
                            <li>• Inter: latin, latin-ext, cyrillic subsets loaded</li>
                            <li>• Manrope: latin, latin-ext, cyrillic subsets loaded</li>
                            <li>• Fallback: system-ui, -apple-system, sans-serif</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
