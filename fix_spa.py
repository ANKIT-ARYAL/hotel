import re
with open('src/app/admin/(dashboard)/pages/spa/SpaEditor.tsx', 'r') as f:
    content = f.read()
# Replace double </Card> with single </Card>
content = re.sub(r'</Card>\s*</Card>', '</Card>', content)
with open('src/app/admin/(dashboard)/pages/spa/SpaEditor.tsx', 'w') as f:
    f.write(content)
