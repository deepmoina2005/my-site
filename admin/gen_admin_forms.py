import os
from pathlib import Path

ADMIN_DIR = Path("v:/My Website/admin/src")

entities = {
    "education": ["institution", "degree", "description"],
    "service": ["name", "description"],
    "certificate": ["title", "issuer", "link"]
}

entity_plurals = {
    "education": "educations",
    "service": "services",
    "certificate": "certificates"
}

def generate_form(entity, fields, plural):
    name_cap = entity.capitalize()
    fields_json = ", ".join([f'{f}: ""' for f in fields])
    
    input_fields = ""
    for f in fields:
        if f == "description":
            input_fields += f"""
            <div>
              <label className="text-sm font-medium">{f.capitalize()}</label>
              <Textarea value={{formData.{f}}} onChange={{(e) => setFormData({{ ...formData, {f}: e.target.value }})}} />
            </div>"""
        else:
            input_fields += f"""
            <div>
              <label className="text-sm font-medium">{f.capitalize()}</label>
              <Input value={{formData.{f}}} onChange={{(e) => setFormData({{ ...formData, {f}: e.target.value }})}} />
            </div>"""

    content = f"""
import React, {{ useState, useEffect }} from "react";
import {{ useDispatch }} from "react-redux";
import {{ useNavigate, useParams }} from "react-router-dom";
import {{ add{name_cap}, update{name_cap} }} from "../{entity}Slice";
import {{ AppDispatch }} from "@/redux/store";
import {{ Button }} from "@/shared/components/ui/button";
import {{ Input }} from "@/shared/components/ui/input";
import {{ Textarea }} from "@/shared/components/ui/textarea";
import {{ Card, CardContent, CardHeader, CardTitle }} from "@/shared/components/ui/card";
import toast from "react-hot-toast";
import axios from "axios";

const Add{name_cap} = () => {{
  const {{ id }} = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({{ {fields_json} }});
  const [loading, setLoading] = useState(false);

  useEffect(() => {{
    if (id) {{
       setLoading(true);
       axios.get(`http://localhost:4000/api/{plural}/${{id}}`).then(res => {{
         setFormData(res.data.entity || res.data);
         setLoading(false);
       }});
    }}
  }}, [id]);

  const handleSubmit = (e: React.FormEvent) => {{
    e.preventDefault();
    if (id) {{
      dispatch(update{name_cap}({{ id, data: formData }})).then(() => {{
        toast.success("Updated");
        navigate("/{plural}/all");
      }});
    }} else {{
      dispatch(add{name_cap}(formData)).then(() => {{
        toast.success("Created");
        navigate("/{plural}/all");
      }});
    }}
  }};

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{{id ? "Edit" : "Add"}} {name_cap}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={{handleSubmit}} className="space-y-4">
            {input_fields}
            <Button type="submit" className="w-full">{{id ? "Update" : "Create"}}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}};

export default Add{name_cap};
"""
    return content

for entity, fields in entities.items():
    plural = entity_plurals[entity]
    name_cap = entity.capitalize()
    
    content = generate_form(entity, fields, plural)
    
    (ADMIN_DIR / "features" / entity / "pages").mkdir(parents=True, exist_ok=True)
    
    with open(ADMIN_DIR / "features" / entity / "pages" / f"Add{name_cap}.tsx", "w", encoding="utf-8") as f:
        f.write(content)
        
    with open(ADMIN_DIR / "features" / entity / "pages" / f"Edit{name_cap}.tsx", "w", encoding="utf-8") as f:
        f.write(content.replace(f"const Add{name_cap}", f"const Edit{name_cap}").replace(f"export default Add{name_cap}", f"export default Edit{name_cap}"))

print("Generated Admin Add/Edit pages.")
