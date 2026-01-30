'use client';

import { useState } from 'react';
import {
    getSectionMetaForPage,
    blocksToPageSections,
    pageSectionsToBlocks,
    type PageSections,
    type SectionMeta,
} from '@/lib/admin/section-adapters';
import type { ContentBlock } from '@/lib/validations';
import { HeroSectionForm } from './sections/HeroSectionForm';
import { WhoWeAreSectionForm } from './sections/WhoWeAreSectionForm';
import { ServicesSectionForm } from './sections/ServicesSectionForm';
import { ContactTeaserSectionForm } from './sections/ContactTeaserSectionForm';
import { IntroSectionForm } from './sections/IntroSectionForm';
import {
    StorySectionForm,
    MilestonesSectionForm,
    ValuesSectionForm,
    TeamSectionForm,
    CTASectionForm,
    ContactFormSectionForm,
} from './sections/AdditionalSectionForms';

interface GuidedSectionsEditorProps {
    pageSlug: string;
    blocks: ContentBlock[];
    onBlocksChange: (blocks: ContentBlock[]) => void;
}

export default function GuidedSectionsEditor({
    pageSlug,
    blocks,
    onBlocksChange,
}: GuidedSectionsEditorProps) {
    const sectionsMeta = getSectionMetaForPage(pageSlug);
    const [activeSectionId, setActiveSectionId] = useState<string>(sectionsMeta[0]?.id || '');
    const [sections, setSections] = useState<PageSections>(() => blocksToPageSections(pageSlug, blocks));

    // Handle pages with no guided sections defined
    if (sectionsMeta.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center max-w-md p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📝</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Guided Editor Available
                    </h3>
                    <p className="text-gray-600 mb-4">
                        The guided section editor is not yet configured for the "{pageSlug}" page.
                    </p>
                    <p className="text-sm text-gray-500">
                        You can still edit this page using the JSON editor or add sections through the database.
                    </p>
                </div>
            </div>
        );
    }

    const handleSectionChange = (sectionId: string, data: any) => {
        const updatedSections = { ...sections, [sectionId]: data };
        setSections(updatedSections);

        // Convert back to blocks and notify parent
        const updatedBlocks = pageSectionsToBlocks(pageSlug, updatedSections);
        onBlocksChange(updatedBlocks);
    };

    const renderSectionForm = (meta: SectionMeta) => {
        const sectionData = sections[meta.id];

        switch (meta.id) {
            // Home page sections
            case 'hero':
                return (
                    <HeroSectionForm
                        data={sectionData}
                        onChange={(data) => handleSectionChange('hero', data)}
                    />
                );
            case 'whoWeAre':
                return (
                    <WhoWeAreSectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('whoWeAre', data)}
                    />
                );
            case 'services':
                return (
                    <ServicesSectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('services', data)}
                    />
                );
            case 'contactTeaser':
                return (
                    <ContactTeaserSectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('contactTeaser', data)}
                    />
                );

            // About page sections
            case 'intro':
                return (
                    <IntroSectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('intro', data)}
                    />
                );
            case 'story':
                return (
                    <StorySectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('story', data)}
                    />
                );
            case 'milestones':
                return (
                    <MilestonesSectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('milestones', data)}
                    />
                );
            case 'values':
                return (
                    <ValuesSectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('values', data)}
                    />
                );
            case 'team':
                return (
                    <TeamSectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('team', data)}
                    />
                );
            case 'cta':
                return (
                    <CTASectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('cta', data)}
                    />
                );

            // Contact page
            case 'contactForm':
                return (
                    <ContactFormSectionForm
                        data={sectionData}
                        onChange={(data: any) => handleSectionChange('contactForm', data)}
                    />
                );

            default:
                return (
                    <div className="p-6 text-gray-500">
                        Section form for "{meta.label}" coming soon...
                    </div>
                );
        }
    };

    const activeMeta = sectionsMeta.find(s => s.id === activeSectionId) || sectionsMeta[0];

    return (
        <div className="flex h-full">
            {/* Left Sidebar - Section List */}
            <div className="w-72 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <h3 className="font-semibold text-gray-900">Page Sections</h3>
                    <p className="text-xs text-gray-500 mt-1">Click a section to edit</p>
                </div>

                <nav className="p-2">
                    {sectionsMeta.map((meta, index) => (
                        <button
                            key={meta.id}
                            onClick={() => setActiveSectionId(meta.id)}
                            className={`
                w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-colors
                ${activeSectionId === meta.id
                                    ? 'bg-blue-50 border border-blue-200 text-blue-900'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }
              `}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-lg leading-none mt-0.5">{meta.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                                        <div className="font-medium text-sm truncate">{meta.label}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                        {meta.description}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Right Panel - Section Form */}
            <div className="flex-1 overflow-y-auto bg-white">
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{activeMeta.icon}</span>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{activeMeta.label}</h2>
                            <p className="text-sm text-gray-500">{activeMeta.description}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {renderSectionForm(activeMeta)}
                </div>
            </div>
        </div>
    );
}
