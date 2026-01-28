import { getSiteSettings, getEnabledLocales } from '@/lib/actions';
import SettingsEditorNew from '@/components/admin/SettingsEditorNew';

export default async function SettingsPage() {
    const [settings, locales] = await Promise.all([
        getSiteSettings(),
        getEnabledLocales(),
    ]);

    return <SettingsEditorNew settings={settings} locales={locales} />;
}
