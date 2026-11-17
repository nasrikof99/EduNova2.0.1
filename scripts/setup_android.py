"""Configure generated Capacitor Android project for EduNova 2.0."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parent.parent
manifest = root / 'android/app/src/main/AndroidManifest.xml'
if not manifest.exists():
    raise SystemExit('AndroidManifest.xml tidak ditemui; jalankan npx cap add android terlebih dahulu.')
s = manifest.read_text(encoding='utf-8')
permissions = [
    'android.permission.RECORD_AUDIO',
    'android.permission.POST_NOTIFICATIONS',
    'android.permission.SCHEDULE_EXACT_ALARM',
]
missing = ''.join(
    f'    <uses-permission android:name="{perm}" />\n'
    for perm in permissions
    if f'android:name="{perm}"' not in s
)
if missing:
    if '    <application' not in s:
        raise SystemExit('Tag <application> tidak ditemui dalam manifest.')
    s = s.replace('    <application', missing + '    <application', 1)
    manifest.write_text(s, encoding='utf-8')

src = root / 'android-assets'
dst = root / 'android/app/src/main/res'
if src.exists():
    for file in src.rglob('*.png'):
        target = dst / file.relative_to(src)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file, target)

colors_xml = dst / 'values/colors.xml'
if colors_xml.exists():
    content = colors_xml.read_text(encoding='utf-8')
    # Colors for adaptive launcher icons
    import re
    content = re.sub(r'(<color name="ic_launcher_background">).*?(</color>)',
                     r'\g<1>#5749D9\g<2>', content)
    colors_xml.write_text(content, encoding='utf-8')
print('✓ AndroidManifest permissions + EduNova branding completed.')
