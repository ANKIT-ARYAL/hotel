const fs = require('fs');

// 1. sidebar.tsx
let sidebar = fs.readFileSync('src/app/admin/(dashboard)/_components/sidebar.tsx', 'utf8');
sidebar = sidebar.replace(/import \{.*?Layers.*?\} from "lucide-react";/, (match) => match.replace('Layers', 'Layers2'));
sidebar = sidebar.replace(/icon: Layers/, 'icon: Layers2');
sidebar = sidebar.replace(/<span className="font-nove font-bold text-xl tracking-tighter/g, '<span className="font-nove font-bold text-lg tracking-tighter');
sidebar = sidebar.replace(/<div className="flex-1 overflow-y-auto py-4 px-2 overflow-x-hidden">/g, '<div className="flex-1 overflow-y-auto py-4 px-2 overflow-x-hidden border-b-[0.5px]">');
fs.writeFileSync('src/app/admin/(dashboard)/_components/sidebar.tsx', sidebar);

// 2. dashboard-client.tsx
let dashboard = fs.readFileSync('src/app/admin/(dashboard)/dashboard/dashboard-client.tsx', 'utf8');
dashboard = dashboard.replace(/<Button variant="outline" size="sm" className="hidden sm:flex">[\s\S]*?<\/Button>/g, '');
dashboard = dashboard.replace(/<Button size="sm" className="hidden sm:flex">[\s\S]*?<\/Button>/g, '');
dashboard = dashboard.replace(/<Button asChild[^>]*>/g, '<Button>');
fs.writeFileSync('src/app/admin/(dashboard)/dashboard/dashboard-client.tsx', dashboard);

// 3. settings-client.tsx
let settings = fs.readFileSync('src/app/admin/(dashboard)/settings/settings-client.tsx', 'utf8');
if (!settings.includes("label: 'Nove'")) {
    settings = settings.replace(
        /\{ value: 'font-montserrat', label: 'Montserrat', preview: 'The quick brown fox jumps over the lazy dog' \},/g,
        "{ value: 'font-montserrat', label: 'Montserrat', preview: 'The quick brown fox jumps over the lazy dog' },\n  { value: 'font-nove', label: 'Nove', preview: 'The quick brown fox jumps over the lazy dog' },"
    );
    fs.writeFileSync('src/app/admin/(dashboard)/settings/settings-client.tsx', settings);
}

console.log("Restored admin");
