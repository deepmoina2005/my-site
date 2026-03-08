import os
import re
from pathlib import Path

PUBLIC_DIR = Path("v:/My Website/public/src")

def fix_content(file_path_str, content):
    
    # Context
    content = re.sub(r'([\'"])(?:\.\./)+context/(.*?)([\'"])', r'\1@/context/\2\3', content)
    # Data
    content = re.sub(r'([\'"])(?:\.\./)+data/(.*?)([\'"])', r'\1@/data/\2\3', content)
    # Components
    content = re.sub(r'([\'"])(?:\.\./)+components/(.*?)([\'"])', r'\1@/shared/components/\2\3', content)
    content = content.replace("@/components/", "@/shared/components/")
    
    # Specific fix for Navbar
    content = content.replace("../data/navbar", "@/data/navbar")
    content = content.replace("../../data/navbar", "@/data/navbar")
    
    return content

for root, dirs, files in os.walk(PUBLIC_DIR):
    for file in files:
        if file.endswith((".js", ".jsx", ".ts", ".tsx")):
            path = Path(root) / file
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            new_content = fix_content(str(path), content)
            if new_content != content:
                print(f"Fixing {file}")
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)

print("Done fixing public imports.")
