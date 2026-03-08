import os
import re
from pathlib import Path

BASE_DIR = Path("v:/My Website/admin/src/features")
entities = ["category", "certificate", "education", "service"]
plurals = {
    "category": "categories",
    "certificate": "certificates",
    "education": "educations",
    "service": "services"
}

for entity in entities:
    plural = plurals[entity]
    feat_dir = BASE_DIR / entity / "pages"
    if not feat_dir.exists():
        continue
        
    for filename in os.listdir(feat_dir):
        if not filename.endswith(".tsx"):
            continue
            
        file_path = feat_dir / filename
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # 1. Fix Redux imports
        content = content.replace(
            'import { useDispatch, useSelector } from "react-redux";',
            'import { useDispatch, useSelector } from "react-redux";\\nimport type { AppDispatch, RootState } from "@/redux/store";'
        )
        
        # 2. Fix dispatch typing
        content = content.replace(
            'const dispatch = useDispatch();',
            'const dispatch = useDispatch<AppDispatch>();'
        )
        
        # 3. Fix selector and state
        content = content.replace('PLURAL_NAME', plural)
        content = content.replace('ENTITY_NAME', entity.capitalize())
        
        # 4. Fix specific AllCategorys typo
        if filename == "AllCategorys.tsx":
            content = content.replace("AllCategorys", "AllCategories")
            new_path = feat_dir / "AllCategories.tsx"
            with open(new_path, "w", encoding="utf-8") as f:
                f.write(content)
            os.remove(file_path)
        else:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)

print("Standardized all Admin CRUD files.")
