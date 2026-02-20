import type { ContentBlock } from '@/lib/blocks/schema';

type BlockRecord = Record<string, unknown>;

const MEDIA_BLOCK_TYPES = new Set<string>([
    'intro',
    'serviceDetails',
    'team',
    'testimonials',
    'insightsList',
    'logoGrid',
    'areas',
    'gallery',
    'image',
    'vehicleFleet',
]);

function blockKey(block: BlockRecord, occurrenceByType: Map<string, number>): string {
    const type = String(block.type ?? 'unknown');
    const occurrence = occurrenceByType.get(type) ?? 0;
    occurrenceByType.set(type, occurrence + 1);

    if (type === 'serviceDetails') {
        return `${type}:${String(block.serviceId ?? '')}:${occurrence}`;
    }

    return `${type}:${occurrence}`;
}

function mergeMediaFields(target: BlockRecord, source: BlockRecord): BlockRecord {
    const type = String(target.type ?? '');

    switch (type) {
        case 'intro':
            return {
                ...target,
                image: source.image ?? target.image,
            };

        case 'serviceDetails':
            return {
                ...target,
                image: source.image ?? target.image,
            };

        case 'team': {
            const targetMembers = Array.isArray(target.members) ? target.members : [];
            const sourceMembers = Array.isArray(source.members) ? source.members : [];

            return {
                ...target,
                members: targetMembers.map((member, index) => {
                    const targetMember = (member ?? {}) as BlockRecord;
                    const sourceMember = (sourceMembers[index] ?? {}) as BlockRecord;
                    return {
                        ...targetMember,
                        image: sourceMember.image ?? targetMember.image,
                    };
                }),
            };
        }

        case 'testimonials': {
            const targetItems = Array.isArray(target.testimonials) ? target.testimonials : [];
            const sourceItems = Array.isArray(source.testimonials) ? source.testimonials : [];

            return {
                ...target,
                testimonials: targetItems.map((item, index) => {
                    const targetItem = (item ?? {}) as BlockRecord;
                    const sourceItem = (sourceItems[index] ?? {}) as BlockRecord;
                    return {
                        ...targetItem,
                        image: sourceItem.image ?? targetItem.image,
                    };
                }),
            };
        }

        case 'insightsList': {
            const targetItems = Array.isArray(target.items) ? target.items : [];
            const sourceItems = Array.isArray(source.items) ? source.items : [];

            return {
                ...target,
                items: targetItems.map((item, index) => {
                    const targetItem = (item ?? {}) as BlockRecord;
                    const sourceItem = (sourceItems[index] ?? {}) as BlockRecord;
                    return {
                        ...targetItem,
                        image: sourceItem.image ?? targetItem.image,
                    };
                }),
            };
        }

        case 'logoGrid': {
            const targetLogos = Array.isArray(target.logos) ? target.logos : [];
            const sourceLogos = Array.isArray(source.logos) ? source.logos : [];

            return {
                ...target,
                logos: targetLogos.map((logo, index) => {
                    const targetLogo = (logo ?? {}) as BlockRecord;
                    const sourceLogo = (sourceLogos[index] ?? {}) as BlockRecord;
                    return {
                        ...targetLogo,
                        logo: sourceLogo.logo ?? targetLogo.logo,
                    };
                }),
            };
        }

        case 'areas': {
            const targetAreas = Array.isArray(target.areas) ? target.areas : [];
            const sourceAreas = Array.isArray(source.areas) ? source.areas : [];

            return {
                ...target,
                areas: targetAreas.map((area, index) => {
                    const targetArea = (area ?? {}) as BlockRecord;
                    const sourceArea = (sourceAreas[index] ?? {}) as BlockRecord;
                    return {
                        ...targetArea,
                        image: sourceArea.image ?? targetArea.image,
                    };
                }),
            };
        }

        case 'gallery':
            return {
                ...target,
                groupKey: source.groupKey ?? target.groupKey,
                images: source.images ?? target.images,
            };

        case 'image':
            return {
                ...target,
                src: source.src ?? target.src,
            };

        case 'vehicleFleet': {
            const targetVehicles = Array.isArray(target.vehicles) ? target.vehicles : [];
            const sourceVehicles = Array.isArray(source.vehicles) ? source.vehicles : [];

            return {
                ...target,
                vehicles: targetVehicles.map((vehicle, index) => {
                    const targetVehicle = (vehicle ?? {}) as BlockRecord;
                    const sourceVehicle = (sourceVehicles[index] ?? {}) as BlockRecord;
                    return {
                        ...targetVehicle,
                        image: sourceVehicle.image ?? targetVehicle.image,
                    };
                }),
            };
        }

        default:
            return target;
    }
}

export function mergeGlobalMediaBlocks(
    targetBlocks: ContentBlock[],
    sourceBlocks: ContentBlock[]
): ContentBlock[] {
    const sourceOccurrence = new Map<string, number>();
    const sourceMap = new Map<string, BlockRecord>();

    for (const block of sourceBlocks as BlockRecord[]) {
        const type = String(block.type ?? '');
        if (!MEDIA_BLOCK_TYPES.has(type)) continue;
        sourceMap.set(blockKey(block, sourceOccurrence), block);
    }

    const targetOccurrence = new Map<string, number>();

    return (targetBlocks as BlockRecord[]).map((block) => {
        const type = String(block.type ?? '');
        if (!MEDIA_BLOCK_TYPES.has(type)) return block as ContentBlock;

        const key = blockKey(block, targetOccurrence);
        const source = sourceMap.get(key);
        if (!source) return block as ContentBlock;

        return mergeMediaFields(block, source) as ContentBlock;
    });
}

export function mergeGlobalOgImage(
    targetOgImage: string | null | undefined,
    sourceOgImage: string | null | undefined
): string | null {
    if (sourceOgImage === undefined) return targetOgImage ?? null;
    return sourceOgImage ?? null;
}
