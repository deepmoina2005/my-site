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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchREPLACE_NAMEs, deleteREPLACE_NAME } from "../REPLACE_ENTITYSlice";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Trash2, Pencil, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CardHeader, CardTitle } from "@/shared/components/ui/card";

const AllREPLACE_NAMEs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { REPLACE_PLURAL, loading } = useSelector((state: RootState) => state.REPLACE_PLURAL);

  useEffect(() => {
    dispatch(fetchREPLACE_NAMEs());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      dispatch(deleteREPLACE_NAME(id)).then(() => toast.success("Deleted"));
    }
  };

  return (
    <div className="p-6">
      <CardHeader className="flex flex-row items-center justify-between px-0">
        <CardTitle className="text-2xl font-bold">All REPLACE_NAMEs</CardTitle>
        <Button onClick={() => navigate("/REPLACE_ROUTE/add")}><Plus className="mr-2 h-4 w-4" /> Add REPLACE_NAME</Button>
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
            {loading ? (
              <TableRow><TableCell colSpan={2} className="text-center">Loading...</TableCell></TableRow>
            ) : REPLACE_PLURAL.map((item: any) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.title || item.name || item.institution || item.degree}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/REPLACE_ROUTE/${item._id}/edit`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllREPLACE_NAMEs;
"""

form_template = """
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { addREPLACE_NAME, updateREPLACE_NAME } from "../REPLACE_ENTITYSlice";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import toast from "react-hot-toast";
import axios from "axios";

const REPLACE_ACTIONREPLACE_NAME = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({ REPLACE_FIELDS_INIT });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
       setLoading(true);
       axios.get(`http://localhost:4000/api/REPLACE_API_ROUTE/${id}`).then(res => {
         setFormData(res.data.entity || res.data);
         setLoading(false);
       }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      dispatch(updateREPLACE_NAME({ id, data: formData })).then(() => {
        toast.success("Updated");
        navigate("/REPLACE_ROUTE/all");
      });
    } else {
      dispatch(addREPLACE_NAME(formData)).then(() => {
        toast.success("Created");
        navigate("/REPLACE_ROUTE/all");
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit" : "Add"} REPLACE_NAME</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            REPLACE_INPUT_FIELDS
            <Button type="submit" className="w-full">{id ? "Update" : "Create"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default REPLACE_ACTIONREPLACE_NAME;
"""

for entity, fields in entities.items():
    Name = entity.capitalize()
    plural = plurals[entity]
    route = entity if entity != "certificate" else "certificates"
    if entity == "service": route = "services"
    elif entity == "education": route = "education"
    elif entity == "category": route = "categories"

    feat_dir = BASE_DIR / entity / "pages"
    feat_dir.mkdir(parents=True, exist_ok=True)
    
    # List Page
    list_content = list_template.replace("REPLACE_NAME", Name).replace("REPLACE_ENTITY", entity).replace("REPLACE_PLURAL", plural).replace("REPLACE_ROUTE", route)
    with open(feat_dir / f"All{Name}s.tsx", "w", encoding="utf-8") as f:
        f.write(list_content)
    
    # Form initialization and fields
    fields_init = ", ".join([f'{f}: ""' for f in fields])
    input_fields = ""
    for f in fields:
        if f == "description":
            input_fields += f'            <div><label className="text-sm font-medium">{f.capitalize()}</label><Textarea value={{formData.{f}}} onChange={{(e) => setFormData({{ ...formData, {f}: e.target.value }})}} /></div>\\n'
        else:
            input_fields += f'            <div><label className="text-sm font-medium">{f.capitalize()}</label><Input value={{formData.{f}}} onChange={{(e) => setFormData({{ ...formData, {f}: e.target.value }})}} /></div>\\n'
    
    # Add Page
    add_content = form_template.replace("REPLACE_ACTION", "Add").replace("REPLACE_NAME", Name).replace("REPLACE_ENTITY", entity).replace("REPLACE_API_ROUTE", plural).replace("REPLACE_ROUTE", route).replace("REPLACE_FIELDS_INIT", fields_init).replace("REPLACE_INPUT_FIELDS", input_fields)
    with open(feat_dir / f"Add{Name}.tsx", "w", encoding="utf-8") as f:
        f.write(add_content)
        
    # Edit Page
    edit_content = form_template.replace("REPLACE_ACTION", "Edit").replace("REPLACE_NAME", Name).replace("REPLACE_ENTITY", entity).replace("REPLACE_API_ROUTE", plural).replace("REPLACE_ROUTE", route).replace("REPLACE_FIELDS_INIT", fields_init).replace("REPLACE_INPUT_FIELDS", input_fields)
    with open(feat_dir / f"Edit{Name}.tsx", "w", encoding="utf-8") as f:
        f.write(edit_content)

print("Generated Admin components successfully.")
