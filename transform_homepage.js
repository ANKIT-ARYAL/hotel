const fs = require('fs');

const code = fs.readFileSync('temp_HomepageEditor.tsx', 'utf8');

// We need to parse out the different sections from the vertical layout
// Luckily they are all wrapped in `<Card>` and separated by comments.
// We can use regex to extract them.

const newImports = `
import { ChevronRight, ArrowLeft } from 'lucide-react';
`;

let transformed = code.replace("import { Eye, EyeOff, Save, Loader2 } from 'lucide-react';", "import { Eye, EyeOff, Save, Loader2, ChevronRight, ArrowLeft } from 'lucide-react';");

// find all sections.
// We have comments like {/* Hero Section */}
// We can capture the block from {/* ... Section */} to </Card>

const regex = /{\/\*\s+(.+?)\s+\*\/}\s*<Card>([\s\S]*?)<\/Card>/g;
let match;
let sectionsData = [];
let sectionForms = {};

while ((match = regex.exec(code)) !== null) {
  const title = match[1];
  // Convert title to a valid ID (e.g. Hero Section -> hero)
  const id = title.split(' ')[0].toLowerCase();
  
  // Try to find the CardDescription for the desc
  const descMatch = match[2].match(/<CardDescription>(.*?)<\/CardDescription>/);
  const desc = descMatch ? descMatch[1] : '';

  sectionsData.push({ id, title, desc });
  
  // The actual form is the entire Card
  sectionForms[id] = `<Card>${match[2]}</Card>`;
}

const componentStart = `
export function HomepageEditor({ initialSettings }: { initialSettings: HomepageSettings }) {
  const [settings, setSettings] = useState<HomepageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    await updateHomepageSettings(settings);
    setIsSaving(false);
    toast.success('Changes saved!');
    router.refresh();
  };

  const toggleVisibility = (section: keyof HomepageSettings) => {
    if (settings[section] && 'isVisible' in settings[section]) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          isVisible: !(prev[section] as any).isVisible
        }
      }));
    }
  };

  const updateSectionField = (section: keyof HomepageSettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const sectionsList = ${JSON.stringify(sectionsData, null, 2)};

  // Level 1: Page Selection
  if (!activePageId) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Select a Page to Edit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="cursor-pointer hover:border-zinc-800 transition-colors shadow-sm"
            onClick={() => setActivePageId('main')}
          >
            <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Main Homepage</h3>
                <p className="text-sm text-muted-foreground mt-1">/ (Root)</p>
              </div>
              <div className="flex items-center text-sm font-medium text-blue-600">
                Edit Pages <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Level 2: Section Selection
  if (!activeSectionId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b pb-4">
          <Button variant="ghost" size="icon" onClick={() => setActivePageId(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Editing: Main Homepage</h2>
            <p className="text-sm text-muted-foreground">Select a section to customize</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionsList.map(sec => (
            <Card 
              key={sec.id}
              className="cursor-pointer hover:border-zinc-800 transition-colors shadow-sm"
              onClick={() => setActiveSectionId(sec.id)}
            >
              <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{sec.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{sec.desc}</p>
                </div>
                <div className="flex items-center text-sm font-medium text-blue-600">
                  Edit Section <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Level 3: Form Editor
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="ghost" size="icon" onClick={() => setActiveSectionId(null)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">{sectionsList.find(s => s.id === activeSectionId)?.title}</h2>
          <p className="text-sm text-muted-foreground">Customize this section's content</p>
        </div>
      </div>

      <div className="max-w-4xl">
        {activeSectionId === 'hero' && (${sectionForms['hero']})}
        {activeSectionId === 'search' && (${sectionForms['search']})}
        {activeSectionId === 'culinary' && (${sectionForms['culinary']})}
        {activeSectionId === 'spa' && (${sectionForms['spa']})}
        {activeSectionId === 'bespoke' && (${sectionForms['bespoke']})}
        {activeSectionId === 'our' && (${sectionForms['our']})}
        {activeSectionId === 'booking' && (${sectionForms['booking']})}
        {activeSectionId === 'featured' && (${sectionForms['featured']})}
        {activeSectionId === 'world-class' && (${sectionForms['world-class']})}
        {activeSectionId === 'testimonials' && (${sectionForms['testimonials']})}

        <div className="flex justify-end pt-8">
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="w-40">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2"/> Save Changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
`;

const finalCode = transformed.replace(/export function HomepageEditor\([\s\S]*$/, componentStart);

fs.writeFileSync('src/app/admin/(dashboard)/pages/homepage/HomepageEditor.tsx', finalCode);

