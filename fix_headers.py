import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Find all h2, h3, h4 tags with var(--theme-heading-size)
    # We want to remove the style prop and ensure they have a standard size class
    
    # For <h2 ... style={{ fontSize: 'var(--theme-heading-size)' }}>
    # We will remove the style attribute and add text-4xl to the className
    
    def h2_repl(match):
        cls = match.group(1)
        # remove any existing text- size classes
        cls = re.sub(r'text-\d+xl\s*', '', cls)
        # add standard size
        if 'text-4xl' not in cls:
            cls += ' text-4xl font-medium'
        return f'<h2 className="{cls.strip()}"'

    def h3_repl(match):
        cls = match.group(1)
        cls = re.sub(r'text-\d+xl\s*', '', cls)
        if 'text-2xl' not in cls:
            cls += ' text-2xl font-medium'
        return f'<h3 className="{cls.strip()}"'
        
    # Replace style={{ fontSize: 'var(--theme-heading-size)' }}
    # and style={{ fontSize: settings.typography?.titleSize || 'var(--theme-heading-size)' }}
    
    # First, strip the style prop from h2 and h3
    content = re.sub(r'(<h[234][^>]*?)style=\{\{[^}]*(?:var\(--theme-heading-size\)|var\(--admin-heading-size\))[^}]*\}\}\s*', r'\1', content)
    
    # Also fix <h2 className="... "> to include standard sizes
    # We only do this if it's a file in src/components or src/app
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
