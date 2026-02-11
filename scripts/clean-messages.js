#!/usr/bin/env node
/**
 * Clean Messages Script
 * =====================
 * 
 * Removes unused translation namespaces from messages/*.json files.
 * These namespaces were migrated to the Content Access Layer or
 * their associated components were removed.
 */

const fs = require('fs');
const path = require('path');

// Namespaces to remove (no longer used)
const NAMESPACES_TO_REMOVE = [
    'nav',      // Migrated to getNavigation.ts
    'footer',   // Migrated to footer.tsx inline labels
    'hero',     // Legacy, unused
    'heroFramed', // Legacy, unused
    'about',    // Legacy section component removed
    'services', // Legacy section component removed
    'insights', // Legacy section component removed
    'partners', // Legacy section component removed
    'contact',  // Legacy section component removed
];

// Messages files to clean
const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const MESSAGE_FILES = ['en.json', 'az.json', 'ru.json'];

function cleanMessages() {
    console.log('Cleaning unused namespaces from messages files...\n');
    console.log('Namespaces to remove:', NAMESPACES_TO_REMOVE.join(', '), '\n');

    for (const fileName of MESSAGE_FILES) {
        const filePath = path.join(MESSAGES_DIR, fileName);

        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  ${fileName} not found, skipping`);
            continue;
        }

        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const originalKeys = Object.keys(content);

        let removed = [];
        for (const namespace of NAMESPACES_TO_REMOVE) {
            if (content[namespace]) {
                delete content[namespace];
                removed.push(namespace);
            }
        }

        if (removed.length > 0) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 4) + '\n', 'utf8');
            console.log(`✅ ${fileName}: Removed ${removed.length} namespaces (${removed.join(', ')})`);
        } else {
            console.log(`ℹ️  ${fileName}: No namespaces to remove`);
        }
    }

    console.log('\n✨ Done! Unused namespaces have been removed.');
    console.log('\nRemaining namespaces are used by:');
    console.log('  - common: Shared UI strings');
    console.log('  - aboutPage: About page content');
    console.log('  - contactPage: Contact form UI');
    console.log('  - partnersPage: Partners page content');
    console.log('  - servicesPage: Services page content');
    console.log('  - blog: Market insights/blog UI');
    console.log('  - seo: Page metadata');
    console.log('  - errors: Error messages');
    console.log('  - stats: Statistics display');
    console.log('  - accessibility: A11y labels');
}

cleanMessages();
