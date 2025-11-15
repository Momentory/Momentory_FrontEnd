import re
import xml.etree.ElementTree as ET
import sys
import codecs

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

regions = {
    'bucheon': 'src/assets/maps/부천.svg',
    'seongnam': 'src/assets/maps/성남.svg',
    'anyang': 'src/assets/maps/안양.svg'
}

results = {}

for region_name, svg_path in regions.items():
    try:
        tree = ET.parse(svg_path)
        root = tree.getroot()

        # Find all path elements
        paths = root.findall('.//{http://www.w3.org/2000/svg}path')
        if not paths:
            paths = root.findall('.//path')

        all_coords = []

        for path in paths:
            d = path.get('d', '')
            # Extract M (moveto) and L (lineto) coordinates
            coords = re.findall(r'[ML]\s*([\d.]+)\s+([\d.]+)', d)
            all_coords.extend([(float(x), float(y)) for x, y in coords])

        if all_coords:
            xs = [x for x, y in all_coords]
            ys = [y for x, y in all_coords]

            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)

            center_x = (min_x + max_x) / 2
            center_y = (min_y + max_y) / 2

            # Convert to percentage (viewBox is 0 0 2048 2048)
            left_pct = (center_x / 2048) * 100
            top_pct = (center_y / 2048) * 100

            results[region_name] = {
                'center': (center_x, center_y),
                'top': top_pct,
                'left': left_pct
            }
    except Exception as e:
        results[region_name] = {'error': str(e)}

print('Marker Coordinates Analysis:')
print('='*50)
for region, data in results.items():
    if 'error' in data:
        print(f'{region}: ERROR - {data["error"]}')
    else:
        print(f'{region}:')
        print(f'  top: {data["top"]:.1f}%')
        print(f'  left: {data["left"]:.1f}%')
        print(f'  (SVG center: {data["center"][0]:.0f}, {data["center"][1]:.0f})')
        print()
