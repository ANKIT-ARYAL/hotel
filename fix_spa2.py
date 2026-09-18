with open('src/app/admin/(dashboard)/pages/spa/SpaEditor.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() == '</Card>' and len(new_lines) > 0 and new_lines[-1].strip() == '</Card>':
        continue
    new_lines.append(line)

with open('src/app/admin/(dashboard)/pages/spa/SpaEditor.tsx', 'w') as f:
    f.writelines(new_lines)
