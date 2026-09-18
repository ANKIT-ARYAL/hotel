import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    def h2_repl(match):
        attrs = match.group(1)
        if 'className="' in attrs:
            # Inject text-4xl if there's no text-\d+xl
            if not re.search(r'text-\d+xl', attrs) and not re.search(r'text-\w*(lg|sm|base)', attrs):
                attrs = attrs.replace('className="', 'className="text-4xl ')
        else:
            attrs += ' className="text-4xl"'
        return f'<h2{attrs}>'

    def h3_repl(match):
        attrs = match.group(1)
        if 'className="' in attrs:
            if not re.search(r'text-\d+xl', attrs) and not re.search(r'text-\w*(lg|sm|base)', attrs):
                attrs = attrs.replace('className="', 'className="text-2xl ')
        else:
            attrs += ' className="text-2xl"'
        return f'<h3{attrs}>'

    content = re.sub(r'<h2([^>]*?)>', h2_repl, content)
    content = re.sub(r'<h3([^>]*?)>', h3_repl, content)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)

files_to_fix = [
    'src/app/rooms-and-suites/_components/RoomsList.tsx',
    'src/app/rooms-and-suites/_components/RoomDetails.tsx',
    'src/app/rooms-and-suites/[slug]/[roomNumber]/page.tsx',
    'src/components/homepage/TestimonialsSection.tsx',
    'src/components/homepage/FeaturedRooms.tsx',
    'src/components/homepage/AmenitiesSection.tsx',
    'src/components/homepage/ExperiencesSection.tsx',
    'src/components/dining/RestaurantsList.tsx',
    'src/components/dining/DiningSliderSection.tsx',
    'src/components/rooms/BookingForm.tsx',
    'src/components/homepage/CulinarySection.tsx',
    'src/components/homepage/SpaWellnessSection.tsx',
    'src/components/homepage/OurStorySection.tsx',
    'src/components/homepage/BookingCtaSection.tsx'
]

for file in files_to_fix:
    if os.path.exists(file):
        process_file(file)
