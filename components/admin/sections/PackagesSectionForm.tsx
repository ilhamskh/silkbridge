'use client';

import { AdminInput } from '../ui/AdminInput';
import { TourPackagesSectionForm as PackagesData } from '@/lib/admin/section-adapters';

interface PackagesSectionFormProps {
    data: PackagesData | null;
    onChange: (data: PackagesData) => void;
}

export function PackagesSectionForm({ data, onChange }: PackagesSectionFormProps) {
    const formData: PackagesData = data || {
        eyebrow: '',
        headline: '',
        packages: [],
    };

    const handleChange = (field: keyof PackagesData, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    // Placeholder for simplified package editing
    // A robust implementation would allow adding/removing packages
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Packages Section</strong> - Display tour or wellness packages.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Eyebrow
                </label>
                <AdminInput
                    value={formData.eyebrow}
                    onChange={(e) => handleChange('eyebrow', e.target.value)}
                    placeholder="Exclusive Offers"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Headline
                </label>
                <AdminInput
                    value={formData.headline}
                    onChange={(e) => handleChange('headline', e.target.value)}
                    placeholder="Our Packages"
                />
            </div>

            <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-4">Packages</h4>
                <p className="text-sm text-gray-500 mb-4">
                    Package management is currently read-only in this simplified editor.
                    Please use the JSON editor or Database Seed for now to add packages.
                </p>
                <div className="space-y-4">
                    {formData.packages.map((pkg, idx) => (
                        <div key={idx} className="p-3 border rounded bg-gray-50">
                            <p className="font-medium">{pkg.title}</p>
                            <p className="text-sm text-gray-600">{pkg.duration} | {pkg.price}</p>
                        </div>
                    ))}
                    {formData.packages.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No packages defined.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
