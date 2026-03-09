import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { addService, updateService } from "../serviceSlice";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Plus, X, Link as LinkIcon,
  ArrowLeft, Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { fetchCategories } from "@/features/category/categorySlice";

const AddService = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { categories } = useSelector((state: RootState) => state.categories);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<any>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    status: "Active",
    technologies: [],
    tags: [],
    features: [{ title: "", description: "" }],
    links: {
      demo: "",
      github: "",
      documentation: ""
    }
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newTech, setNewTech] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    dispatch(fetchCategories("service"));
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosInstance.get(`/services/${id}`).then(res => {
        const data = res.data.entity || res.data;
        setFormData({
          title: data.title || "",
          shortDescription: data.shortDescription || "",
          fullDescription: data.fullDescription || "",
          category: data.category || "",
          status: data.status || "Active",
          technologies: data.technologies || [],
          tags: data.tags || [],
          features: data.features?.length > 0 ? data.features : [{ title: "", description: "" }],
          links: data.links || { demo: "", github: "", documentation: "" }
        });
        if (data.image) setImagePreview(data.image);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();

    // Append fields
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === "object") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) data.append("image", imageFile);

    if (id) {
      dispatch(updateService({ id, data })).then((res: any) => {
        setSubmitting(false);
        if (!res.error) {
          toast.success("Service Updated");
          navigate("/services/all");
        } else {
          toast.error(res.payload || "Update Failed");
        }
      });
    } else {
      dispatch(addService(data)).then((res: any) => {
        setSubmitting(false);
        if (!res.error) {
          toast.success("Service Created");
          navigate("/services/all");
        } else {
          toast.error(res.payload || "Creation Failed");
        }
      });
    }
  };

  // Helper functions for dynamic fields
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: "", description: "" }]
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [{ title: "", description: "" }] });
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  const addTech = () => {
    if (newTech && !formData.technologies.includes(newTech)) {
      setFormData({ ...formData, technologies: [...formData.technologies, newTech] });
      setNewTech("");
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Back Button */}
      <div className="md:col-span-2">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Service Title */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Service Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="h-12"
            placeholder="Ex: Professional Web Development"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </CardContent>
      </Card>

      {/* Row 1: Category | Status */}
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(val) => setFormData({ ...formData, category: val })} value={formData.category}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(val) => setFormData({ ...formData, status: val })} value={formData.status}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active (Visible)</SelectItem>
              <SelectItem value="Draft">Draft (Hidden)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Row 2: Short Description */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Short Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            className="h-12"
            placeholder="Catchy tagline for the service"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Row 3: Banner Image */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Banner Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" />
          {imagePreview && (
            <img src={imagePreview} alt="Banner Preview" className="w-full h-40 object-cover rounded-md border" />
          )}
        </CardContent>
      </Card>

      {/* Row 4: Technologies | Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              className="h-12"
              placeholder="React, Next.js, etc."
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
            />
            <Button type="button" onClick={addTech} className="h-12">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((t: string) => (
              <Badge key={t} variant="secondary" className="px-3 py-1 cursor-pointer" onClick={() => setFormData({ ...formData, technologies: formData.technologies.filter((x: string) => x !== t) })}>
                {t} <X size={12} className="ml-1" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              className="h-12"
              placeholder="web, mobile, ui"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} className="h-12">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((t: string) => (
              <Badge key={t} variant="outline" className="px-3 py-1 cursor-pointer" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((x: string) => x !== t) })}>
                {t} <X size={12} className="ml-1" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 4: Pricing removed */}


      {/* Row 6: Demo Link | Github Link */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              className="h-12 pl-10"
              placeholder="https://demo.com"
              value={formData.links.demo}
              onChange={(e) => setFormData({ ...formData, links: { ...formData.links, demo: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Github Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              className="h-12 pl-10"
              placeholder="https://github.com/..."
              value={formData.links.github}
              onChange={(e) => setFormData({ ...formData, links: { ...formData.links, github: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Documentation Link (spanning 2 columns) */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Documentation Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              className="h-12 pl-10"
              placeholder="https://docs.com/..."
              value={formData.links.documentation}
              onChange={(e) => setFormData({ ...formData, links: { ...formData.links, documentation: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Row 7: Full Description */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Full Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your service in detail..."
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>

      {/* Row 8: Features */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Features</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={addFeature} className="gap-2">
            <Plus size={16} /> Add Feature
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.features.map((feature: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start border p-4 rounded-xl">
              <div className="md:col-span-4">
                <Input placeholder="Feature Title" value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} />
              </div>
              <div className="md:col-span-6">
                <Input placeholder="Description" value={feature.description} onChange={(e) => updateFeature(index, "description", e.target.value)} />
              </div>
              <div className="md:col-span-1">
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="text-red-500 hover:bg-red-50">
                  <X size={18} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        className="w-full md:col-span-2 h-14 text-lg font-bold"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {id ? "Updating..." : "Creating..."}</>
        ) : (
          id ? "Save Service" : "Create Service"
        )}
      </Button>
    </div>
  );
};

export default AddService;
