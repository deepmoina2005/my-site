import os
import re
import shutil
from pathlib import Path

ADMIN_DIR = Path("v:/My Website/admin/src")

# 1. Move remaining components into shared/components/
components_dir = ADMIN_DIR / "components"
shared_comp_dir = ADMIN_DIR / "shared" / "components"

if components_dir.exists():
    for item in components_dir.iterdir():
        if item.is_file():
            new_item = shared_comp_dir / item.name
            print(f"Moving {item} to {new_item}")
            shutil.move(str(item), str(new_item))
        elif item.is_dir() and item.name not in ['app', 'ui', 'dashboard']:
            new_item = shared_comp_dir / item.name
            if not new_item.exists():
                print(f"Moving dir {item} to {new_item}")
                shutil.move(str(item), str(new_item))

    # deal with 'dashboard' folder in components
    db_dir = components_dir / "dashboard"
    if db_dir.exists():
        new_db_dir = shared_comp_dir / "dashboard"
        new_db_dir.mkdir(exist_ok=True)
        for item in db_dir.iterdir():
            shutil.move(str(item), str(new_db_dir / item.name))
        try:
            db_dir.rmdir()
        except:
            pass
            
    try:
        components_dir.rmdir()
    except:
        pass


# 2. Fix the imports
def fix_content(file_path_str, content):
    filename = Path(file_path_str).name
    
    # store.ts
    if filename == "store.ts":
        content = re.sub(r'([\'"])\./slices/', r'\1@/features/', content)
        # e.g './slices/blogSlice' -> '@/features/blogSlice' .. wait, they are in features/blog/blogSlice
        slice_map = {
            "blogSlice": "blog", "projectSlice": "project", "productSlice": "product",
            "bookSlice": "book", "experienceSlice": "experience", "skillSlice": "skill",
            "noteSlice": "notes", "adminSlice": "login"
        }
        for slice_name, feature in slice_map.items():
            content = content.replace(f"@/features/{slice_name}", f"@/features/{feature}/{slice_name}")
            content = content.replace(f"./slices/{slice_name}", f"@/features/{feature}/{slice_name}")

    # *Slice.ts importing services
    if "Slice.ts" in filename:
        # e.g., import authService from '../services/adminService'; -> import authService from './loginAPI';
        content = re.sub(r'([\'"])\.\./services/(.*?)Service([\'"])', r'\1./\2API\3', content)
        # special case for adminService -> loginAPI
        content = content.replace("./adminAPI", "./loginAPI")
        content = content.replace("./noteAPI", "./notesAPI")

    # App.tsx
    if filename == "App.tsx":
        content = content.replace("@/features/Contact/pages/AllContacts", "@/features/contact/pages/AllContacts")
        content = content.replace("./components/", "@/shared/components/")

    # AllBlogs.tsx, ViewBlogDetails.tsx, etc. deleting imports
    content = content.replace("@/shared/components/DeleteDialog", "@/shared/components/DeleteDialog")
    
    # Typescript type errors in components
    # We will just fix typical things or let them fail for now. 
    # Just fix path errors:
    content = content.replace("../mode-toggle", "@/shared/components/mode-toggle")
    content = content.replace("@/shared/components/login-form", "@/shared/components/login-form")
    content = content.replace("@/shared/components/app-sidebar", "@/shared/components/app-sidebar")

    return content

for root, dirs, files in os.walk(ADMIN_DIR):
    for file in files:
        if file.endswith((".ts", ".tsx")):
            path = Path(root) / file
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            new_content = fix_content(str(path), content)
            if new_content != content:
                print(f"Fixing {file}")
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                    
print("Done fixing remaining imports.")
