const fs = require('fs');
let code = fs.readFileSync('src/app/admin/(dashboard)/pages/homepage/HomepageEditor.tsx', 'utf8');

// I will insert the new sections before the "Our Story Section"
const newSections = `

      {/* Featured Accommodations Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Featured Accommodations</CardTitle>
            <CardDescription>Showcase your best rooms and suites</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('featuredRooms')}
            className={settings.featuredRooms?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.featuredRooms?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.featuredRooms?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.featuredRooms.title} 
                onChange={(e) => updateSectionField('featuredRooms', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.featuredRooms.description} 
                onChange={(val) => updateSectionField('featuredRooms', 'description', val)} 
              />
            </div>
            <p className="text-xs text-muted-foreground italic">Note: The individual rooms displayed here are managed from the Rooms Management tab.</p>
          </CardContent>
        )}
      </Card>

      {/* Amenities Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>World-Class Amenities</CardTitle>
            <CardDescription>Highlight your property's features</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('amenities')}
            className={settings.amenities?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.amenities?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.amenities?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.amenities.title} 
                onChange={(e) => updateSectionField('amenities', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.amenities.description} 
                onChange={(val) => updateSectionField('amenities', 'description', val)} 
              />
            </div>
            <p className="text-xs text-muted-foreground italic">Note: Specific amenity icons and details are managed from the Amenities Management tab.</p>
          </CardContent>
        )}
      </Card>

      {/* Testimonials Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Testimonials Section</CardTitle>
            <CardDescription>What our guests say</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('testimonials')}
            className={settings.testimonials?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.testimonials?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.testimonials?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.testimonials.title} 
                onChange={(e) => updateSectionField('testimonials', 'title', e.target.value)} 
              />
            </div>
            <p className="text-xs text-muted-foreground italic">Note: Reviews are managed from the Reviews Management tab.</p>
          </CardContent>
        )}
      </Card>

`;

code = code.replace('{/* Our Story Section */}', newSections + '{/* Our Story Section */}');
fs.writeFileSync('src/app/admin/(dashboard)/pages/homepage/HomepageEditor.tsx', code);
