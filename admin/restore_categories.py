import os
from pathlib import Path

CATEGORY_PAGES_DIR = Path("v:/My Website/admin/src/features/category/pages")

placeholders = [
    "NoteCategories", "BookCategories", "BlogCategories", 
    "SkillCategories", "ProjectCategories", "ProductCategories", 
    "ServiceCategories"
]

template = """
const REPLACE_NAME = () => {{
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">REPLACE_NAME (Placeholder)</h1>
      <p>Management for this category type is coming soon.</p>
    </div>
  );
}};

export default REPLACE_NAME;
"""

for p in placeholders:
    content = template.replace("REPLACE_NAME", p)
    filepath = CATEGORY_PAGES_DIR / f"{p}.tsx"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Restored Category placeholders.")
