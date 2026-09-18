with open('src/app/admin/(dashboard)/pages/spa/SpaEditor.tsx', 'r') as f:
    content = f.read()

content = content.replace('          </Card>\n        </Card>', '          </Card>')
content = content.replace('              </CardContent>\n        </Card>\n    </div>\n  );\n}', '              </CardContent>\n            )}\n          </Card>\n      </div>\n    </div>\n  );\n}')

with open('src/app/admin/(dashboard)/pages/spa/SpaEditor.tsx', 'w') as f:
    f.write(content)
