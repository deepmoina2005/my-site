import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { addCategory, updateCategory } from "../categorySlice";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import toast from "react-hot-toast";
import axiosInstance from "@/shared/utils/axiosInstance";

const EditCategory = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosInstance.get(`/categories/${id}`).then(res => {
        setFormData(res.data.entity || res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      dispatch(updateCategory({ id, data: formData })).then(() => {
        toast.success("Updated");
        navigate("/categories/all");
      });
    } else {
      dispatch(addCategory(formData)).then(() => {
        toast.success("Created");
        navigate("/categories/all");
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit" : "Add"} Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="text-sm font-medium">Name</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Description</label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>

            <Button type="submit" className="w-full text-white">{id ? "Update" : "Create"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
