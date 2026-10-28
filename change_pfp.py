#!/usr/bin/env python3
"""
MathWorks Clone - Profile Picture (PFP) Manager
------------------------------------------------
Usage:
  1) Generate initials avatar in official MathWorks style:
     python3 change_pfp.py HC
     python3 change_pfp.py AM
     python3 change_pfp.py XYZ

  2) Use a custom photo / image file:
     python3 change_pfp.py /path/to/my_photo.png

  3) Revert back to original:
     python3 change_pfp.py --revert
"""

import sys
import os
import shutil
from PIL import Image, ImageDraw, ImageFont

AVATAR_DESTINATIONS = [
    "hc_avatar.png",
    "matlabcentral/profiles/hc_avatar.png",
    "41788712_1784142686681_DEF.jpg",
    "matlabcentral/profiles/41788712_1784142686681_DEF.jpg",
    "MathWorks Account_files/41788712_1784142686681_DEF.jpg",
    "account.mathworks.com/images.mathworks.com/profile/41788712_1784142686681_DEF.jpg",
    "community_files/cfd0ace5339444aa011816c7a3769d632505c0b8"
]

BACKUP_FILE = "matlabcentral/profiles/41788712_1784142686681_DEF_AN_ORIGINAL.jpg"

def set_avatar_image(img):
    # Resize to crisp 128x128
    out_img = img.resize((128, 128), Image.Resampling.LANCZOS)
    for dst in AVATAR_DESTINATIONS:
        parent = os.path.dirname(dst)
        if parent == "" or os.path.exists(parent):
            out_img.save(dst, format="PNG")
            print(f"✓ Updated avatar: {dst}")

def generate_initials_avatar(text, bg_hex="#fe9043", text_hex="#000000"):
    # Convert hex to RGB
    bg_rgb = tuple(int(bg_hex.lstrip("#")[i:i+2], 16) for i in (0, 2, 4)) + (255,)
    text_rgb = tuple(int(text_hex.lstrip("#")[i:i+2], 16) for i in (0, 2, 4)) + (255,)

    size_large = 256
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNS.ttf"
    ]
    font_path = None
    for p in font_paths:
        if os.path.exists(p):
            font_path = p
            break

    # Adjust font size based on text length
    if len(text) <= 2:
        font_size = 124
    elif len(text) == 3:
        font_size = 90
    else:
        font_size = int(240 / len(text))

    if font_path:
        font = ImageFont.truetype(font_path, font_size)
    else:
        font = ImageFont.load_default()

    img_large = Image.new("RGBA", (size_large, size_large), bg_rgb)
    draw = ImageDraw.Draw(img_large)
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = (size_large - w) / 2 - bbox[0]
    y = (size_large - h) / 2 - bbox[1]
    draw.text((x, y), text, fill=text_rgb, font=font)

    set_avatar_image(img_large)
    print(f"\n✓ Successfully changed profile picture to initials '{text}' in MathWorks style!")

def use_custom_file(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        sys.exit(1)
    img = Image.open(file_path).convert("RGBA")
    # Crop to center square if not 1:1
    w, h = img.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    img_square = img.crop((left, top, left + min_dim, top + min_dim))
    set_avatar_image(img_square)
    print(f"\n✓ Successfully set profile picture from '{file_path}'!")

def revert_to_original():
    if os.path.exists(BACKUP_FILE):
        img = Image.open(BACKUP_FILE)
        set_avatar_image(img)
        print("\n✓ Successfully reverted profile picture to original 'AN'!")
    else:
        generate_initials_avatar("AN")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    arg = sys.argv[1].strip()
    if arg in ("--revert", "-r", "revert"):
        revert_to_original()
    elif os.path.exists(arg) and not os.path.isdir(arg):
        use_custom_file(arg)
    else:
        generate_initials_avatar(arg.upper())
