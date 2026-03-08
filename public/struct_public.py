import os
import shutil
import re
from pathlib import Path

PUBLIC_DIR = Path("v:/My Website/public/src")

features = [
    "blog", "project", "product", "service", "book", 
    "certificate", "education", "category", "experience", "skill", "contact", "home", "about"
]

features_dir = PUBLIC_DIR / "features"
shared_dir = PUBLIC_DIR / "shared"
redux_dir = PUBLIC_DIR / "redux"

features_dir.mkdir(parents=True, exist_ok=True)
shared_dir.mkdir(parents=True, exist_ok=True)
redux_dir.mkdir(parents=True, exist_ok=True)

for sub in ["components", "hooks", "utils", "api"]:
    (shared_dir / sub).mkdir(parents=True, exist_ok=True)

for feature in features:
    f_dir = features_dir / feature
    f_dir.mkdir(parents=True, exist_ok=True)
    (f_dir / "components").mkdir(parents=True, exist_ok=True)
    (f_dir / "pages").mkdir(parents=True, exist_ok=True)

print("Created folder structure.")

# Move pages
pages_dir = PUBLIC_DIR / "pages"
if pages_dir.exists():
    for item in pages_dir.iterdir():
        if item.is_file() and item.name == "Home.jsx":
            shutil.move(str(item), str(features_dir / "home" / "pages" / item.name))

# Move components
components_dir = PUBLIC_DIR / "components"
if components_dir.exists():
    for item in components_dir.iterdir():
        if item.is_file():
            shutil.move(str(item), str(shared_dir / "components" / item.name))

# Move sections
sections_dir = PUBLIC_DIR / "sections"
if sections_dir.exists():
    for item in sections_dir.iterdir():
         if item.is_file():
            # Home page sections
            shutil.move(str(item), str(features_dir / "home" / "components" / item.name))

# Fix imports
def fix_content(file_path_str, content):
    filename = Path(file_path_str).name
    # Fix App.jsx
    if filename == "App.jsx":
        content = content.replace("./pages/Home", "@/features/home/pages/Home")
        content = content.replace("./components/", "@/shared/components/")
    
    # Home.jsx
    if filename == "Home.jsx":
        content = content.replace("../components/", "@/shared/components/")
        content = content.replace("../sections/", "../components/")
        
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

print("Public folder structured.")
