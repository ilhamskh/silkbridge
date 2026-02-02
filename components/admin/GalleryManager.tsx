'use client';

import { useState } from 'react';
import { GalleryGroup } from '@prisma/client';

interface GalleryManagerProps {
    groups: GalleryGroup[];
}

export default function GalleryManager({ groups }: GalleryManagerProps) {
    const [selectedGroup, setSelectedGroup] = useState<string>(groups[0]?.key || '');

    // Placeholder for now
    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Gallery Manager</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Gallery Group</label>
                <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    {groups.map(g => (
                        <option key={g.id} value={g.key}>{g.key}</option>
                    ))}
                </select>
            </div>
            <div className="border-t pt-4">
                <p>Selected: {selectedGroup}</p>
                {/* Image upload/reorder logic goes here */}
                <p className="text-gray-500 italic">Image management UI to be implemented.</p>
            </div>
        </div>
    );
}
