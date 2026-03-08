import os
from pathlib import Path

BASE_DIR = Path("v:/My Website/admin/src/features")
entities = {
    "education": ["institution", "degree", "description"],
    "service": ["name", "description"],
    "certificate": ["title", "issuer", "link"],
    "category": ["name", "description"]
}
plurals = {
    "education": "educations",
    "service": "services",
    "certificate": "certificates",
    "category": "categories"
}

list_template = """
import {{ useEffect }} from "react";
import {{ useDispatch, useSelector }} from "react-redux";
import type {{ AppDispatch, RootState }} from "@/redux/store";
import {{ fetch{Name}s, delete{Name} }} from "../{entity}Slice";
import {{ Button }} from "@/shared/components/ui/button";
import {{ Table, TableBody, TableCell, TableHead, TableHeader, TableRow }} from "@/shared/components/ui/table";
import {{ Trash2, Pencil, Plus }} from "lucide-react";
import toast from "react-hot-toast";
import {{ useNavigate }} from "react-router-dom";
import {{ CardContent, CardHeader, CardTitle }} from "@/shared/components/ui/card";

const All{Name}s = () => {{
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {{ {plural}, loading }} = useSelector((state: RootState) => state.{plural});

  useEffect(() => {{
    dispatch(fetch{Name}s());
  }}, [dispatch]);

  const handleDelete = (id: string) => {{
    if (confirm("Are you sure?")) {{
      dispatch(delete{Name}(id)).then(() => toast.success("Deleted"));
    }}
  }};

  return (
    <div className="p-6">
      <CardHeader className="flex flex-row items-center justify-between px-0">
        <CardTitle className="text-2xl font-bold">All {Name}s</CardTitle>
        <Button onClick={() => navigate("/{route_prefix}/add")}><Plus className="mr-2 h-4 w-4" /> Add {Name}</Button>
      </CardHeader>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name/Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {{loading ? (
              <TableRow><TableCell colSpan={2} className="text-center">Loading...</TableCell></TableRow>
            ) : {plural}.map((item: any) => (
              <TableRow key={{item._id}}>
                <TableCell className="font-medium">{{item.title || item.name || item.institution || item.degree}}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/{route_prefix}/${{item._id}}/edit`)}}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}};

export default All{Name}s;
"""

form_template = """
import React, {{ useState, useEffect }} from "react";
import {{ useDispatch }} from "react-redux";
import type {{ AppDispatch }} from "@/redux/store";
import {{ useNavigate, useParams }} from "react-router-dom";
import {{ add{Name}, update{Name} }} from "../{entity}Slice";
import {{ Button }} from "@/shared/components/ui/button";
import {{ Input }} from "@/shared/components/ui/input";
import {{ Textarea }} from "@/shared/components/ui/textarea";
import {{ Card, CardContent, CardHeader, CardTitle }} from "@/shared/components/ui/card";
import toast from "react-hot-toast";
import axios from "axios";

const {Action}{Name} = () => {{
  const {{ id }} = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({{ {fields_init} }});
  const [loading, setLoading] = useState(false);

  useEffect(() => {{
    if (id) {{
       setLoading(true);
       axios.get(`http://localhost:4000/api/{plural_route}/${{id}}`).then(res => {{
         setFormData(res.data.entity || res.data);
         setLoading(false);
       }}).catch(() => setLoading(false));
    }}
  }}, [id]);

  const handleSubmit = (e: React.FormEvent) => {{
    e.preventDefault();
    if (id) {{
      dispatch(update{Name}({{ id, data: formData }})).then(() => {{
        toast.success("Updated");
        navigate("/{route_prefix}/all");
      }});
    }} else {{
      dispatch(add{Name}(formData)).then(() => {{
        toast.success("Created");
        navigate("/{route_prefix}/all");
      }});
    }}
  }};

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{{id ? "Edit" : "Add"}} {Name}</CardTitle>
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

export default {Action}{Name};
"""

for entity, fields in entities.items():
    Name = entity.capitalize()
    plural = plurals[entity]
    # Route prefix logic (some are plural in App.tsx, some singular)
    route_prefix = entity if entity != "certificate" else "certificates"
    # Wait, App.tsx uses: education/all, certificates/all, services/all, categories/all?
    # Actually: education/all, certificates/all, services/all
    if entity == "education": route_prefix = "education"
    elif entity == "service": route_prefix = "services"
    elif entity == "certificate": route_prefix = "certificates"
    elif entity == "category": route_prefix = "categories"

    feat_dir = BASE_DIR / entity / "pages"
    feat_dir.mkdir(parents=True, exist_ok=True)
    
    # List Page
    list_content = list_template.format(Name=Name, entity=entity, plural=plural, route_prefix=route_prefix)
    with open(feat_dir / f"All{Name}s.tsx", "w", encoding="utf-8") as f:
        f.write(list_content)
    
    # Add/Edit Pages
    fields_init = ", ".join([f'{f}: ""' for f in fields])
    input_fields = ""
    for f in fields:
        if f == "description":
            input_fields += f'            <div><label className="text-sm font-medium">{f.capitalize()}</label><Textarea value={{formData.{f}}} onChange={{(e) => setFormData({{ ...formData, {f}: e.target.value }})}} /></div>\\n'
        else:
            input_fields += f'            <div><label className="text-sm font-medium">{f.capitalize()}</label><Input value={{formData.{f}}} onChange={{(e) => setFormData({{ ...formData, {f}: e.target.value }})}} /></div>\\n'
    
    add_content = form_template.format(Action="Add", Name=Name, entity=entity, plural_route=plural, route_prefix=route_prefix, fields_init=fields_init, input_fields=input_fields)
    with open(feat_dir / f"Add{Name}.tsx", "w", encoding="utf-8") as f:
        f.write(add_content)
        
    edit_content = form_template.format(Action="Edit", Name=Name, entity=entity, plural_route=plural, route_prefix=route_prefix, fields_init=fields_init, input_fields=input_fields)
    with open(feat_dir / f"Edit{Name}.tsx", "w", encoding="utf-8") as f:
        f.write(edit_content)

print("Generated all Admin pages correctly.")
