import os
from pathlib import Path

ADMIN_DIR = Path("v:/My Website/admin/src/features")

replacements = [
    ('import { useDispatch, useSelector } from "react-redux";', 'import { useDispatch, useSelector } from "react-redux";\\nimport type { AppDispatch, RootState } from "@/redux/store";'),
    ('const AllCategorys', 'const AllCategories'),
    ('export default AllCategorys', 'export default AllCategories'),
    ('from "../ENTITY_NAMESlice"', 'from "../REL_PATH"'), # Placeholder
    ('PLURAL_NAME', 'target_plural'), # Placeholder
    ('ENTITY_NAME', 'target_name') # Placeholder
]

entities = ["category", "certificate", "education", "service"]
entity_plurals = {
    "category": "categories",
    "certificate": "certificates",
    "education": "educations",
    "service": "services"
}

for entity in entities:
    plural = entity_plurals[entity]
    target_dir = ADMIN_DIR / entity / "pages"
    
    for filename in os.listdir(target_dir):
        if filename.endswith(".tsx"):
            file_path = target_dir / filename
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Specific fixes
            content = content.replace('import { useDispatch, useSelector } from "react-redux";', 
                                    'import { useDispatch, useSelector } from "react-redux";\\nimport type { AppDispatch, RootState } from "@/redux/store";')
            content = content.replace('const dispatch = useDispatch();', 'const dispatch = useDispatch<AppDispatch>();')
            content = content.replace('const { PLURAL_NAME, loading } = useSelector((state: RootState) => state.PLURAL_NAME);',
                                    f'const {{ {plural}, loading }} = useSelector((state: RootState) => state.{plural});')
            content = content.replace('PLURAL_NAME', plural)
            content = content.replace('ENTITY_NAME', entity.capitalize())
            
            # Handle the misspelled AllCategorys
            if filename == "AllCategorys.tsx":
                content = content.replace("AllCategorys", "AllCategories")
                os.remove(file_path)
                file_path = target_dir / "AllCategories.tsx"
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)

print("Fixed Admin TypeScript files.")
