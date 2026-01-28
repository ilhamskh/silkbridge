import { redirect } from 'next/navigation';

// Redirect /admin/content/pages to /admin/content
export default function PagesRedirect() {
    redirect('/admin/content');
}
