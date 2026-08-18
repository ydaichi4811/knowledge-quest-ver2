import sys
import os
from PIL import Image
from collections import deque

def make_transparent_and_crop(img_path, output_path, crop_box=None):
    img = Image.open(img_path).convert("RGBA")
    
    if crop_box:
        img = img.crop(crop_box)
        
    width, height = img.size
    pixels = img.load()
    
    # Check if pixel is white/off-white background candidate
    def is_white_bg(p):
        r, g, b, a = p
        # White or near-white background
        return r > 220 and g > 220 and b > 220
        
    visited = set()
    queue = deque()
    
    # Border pixels
    for x in range(width):
        if is_white_bg(pixels[x, 0]):
            visited.add((x, 0))
            queue.append((x, 0))
        if is_white_bg(pixels[x, height - 1]):
            visited.add((x, height - 1))
            queue.append((x, height - 1))
            
    for y in range(height):
        if is_white_bg(pixels[0, y]):
            visited.add((0, y))
            queue.append((0, y))
        if is_white_bg(pixels[width - 1, y]):
            visited.add((width - 1, y))
            queue.append((width - 1, y))
            
    # Flood fill
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    while queue:
        cx, cy = queue.popleft()
        for dx, dy in directions:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    if is_white_bg(pixels[nx, ny]):
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    # Turn visited background pixels into transparent (alpha=0)
    for (x, y) in visited:
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)

    # Anti-alias / feather fringe pixels adjacent to transparent background
    for y in range(height):
        for x in range(width):
            if (x, y) not in visited:
                r, g, b, a = pixels[x, y]
                min_c = min(r, g, b)
                if min_c > 195:
                    has_bg_adj = False
                    for dx, dy in directions:
                        nx, ny = x + dx, y + dy
                        if (nx, ny) in visited:
                            has_bg_adj = True
                            break
                    if has_bg_adj:
                        # Feather alpha
                        alpha_val = int(max(0, 255 - (min_c - 195) * 4.2))
                        pixels[x, y] = (r, g, b, alpha_val)

    # Crop tight to non-transparent bounding box
    bbox = img.getbbox()
    if bbox:
        left = max(0, bbox[0] - 2)
        top = max(0, bbox[1] - 2)
        right = min(width, bbox[2] + 2)
        bottom = min(height, bbox[3] + 2)
        img = img.crop((left, top, right, bottom))
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Saved transparent PNG to {output_path}: size {img.size}, alpha channel verified.")

if __name__ == "__main__":
    hero_sheet = "src/assets/images/hero_boy_v1_1785625821391.jpg"
    larny_file = "src/assets/images/buddy_purple_dragon_v1_1785625850023.jpg"
    girl_file = "src/assets/images/hero_girl_v1_1785625837606.jpg"
    
    make_transparent_and_crop(hero_sheet, "public/assets/hero/boy/idle.png", (0, 0, 512, 512))
    make_transparent_and_crop(hero_sheet, "public/assets/hero/boy/attack.png", (512, 0, 1024, 512))
    make_transparent_and_crop(hero_sheet, "public/assets/hero/boy/damage.png", (0, 512, 512, 1024))
    make_transparent_and_crop(hero_sheet, "public/assets/hero/boy/victory.png", (512, 512, 1024, 1024))
    
    make_transparent_and_crop(larny_file, "public/assets/buddy/larny/idle.png")
    
    make_transparent_and_crop(girl_file, "public/assets/hero/girl/idle.png")
    make_transparent_and_crop(girl_file, "public/assets/hero/girl/attack.png")
    make_transparent_and_crop(girl_file, "public/assets/hero/girl/damage.png")
    make_transparent_and_crop(girl_file, "public/assets/hero/girl/victory.png")
