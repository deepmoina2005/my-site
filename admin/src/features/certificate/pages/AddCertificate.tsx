import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { addCertificate, updateCertificate } from "../certificateSlice";
import { getSkills } from "@/features/skill/skillSlice";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Plus, X, Upload, Image as ImageIcon, FileText } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AddCertificate = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { skills: allSkills } = useSelector((state: RootState) => state.skills);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<any>({
    title: "",
    issuer: "",
    issueMonth: "",
    issueYear: "",
    expirationMonth: "",
    expirationYear: "",
    credentialId: "",
    link: "",
    skills: [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<string[]>([]);
  const [existingImage, setExistingImage] = useState<string>("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getSkills());
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:4000/api/certificates/${id}`).then(res => {
        const data = res.data.entity || res.data;
        setFormData({
          title: data.title || "",
          issuer: data.issuer || "",
          issueMonth: data.issueMonth || "",
          issueYear: data.issueYear || "",
          expirationMonth: data.expirationMonth || "",
          expirationYear: data.expirationYear || "",
          credentialId: data.credentialId || "",
          link: data.link || "",
          skills: data.skills || [],
        });
        setExistingImage(data.image || "");
        setExistingMedia(data.media || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, dispatch]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Append text fields
    Object.keys(formData).forEach(key => {
      if (key === "skills") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    // Append files
    if (imageFile) {
      data.append("image", imageFile);
    }
    mediaFiles.forEach(file => {
      data.append("media", file);
    });

    if (id) {
      dispatch(updateCertificate({ id, data })).then((res: any) => {
        if (!res.error) {
          toast.success("Updated");
          navigate("/certificates/all");
        } else {
          toast.error(res.payload || "Failed to update");
        }
      });
    } else {
      dispatch(addCertificate(data)).then((res: any) => {
        if (!res.error) {
          toast.success("Created");
          navigate("/certificates/all");
        } else {
          toast.error(res.payload || "Failed to create");
        }
      });
    }
  };

  const handleAddSkill = (skillName: string) => {
    if (!formData.skills.includes(skillName)) {
      setFormData({ ...formData, skills: [...formData.skills, skillName] });
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s: string) => s !== skillName) });
  };

  const handleRemoveMedia = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingMedia(prev => prev.filter((_, i) => i !== index));
    } else {
      setMediaFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{id ? "Edit" : "Add"} License or Certification</CardTitle>
          <p className="text-sm text-slate-500">* Indicates required</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column: Image Upload */}
              <div className="space-y-4">
                <label className="text-sm font-semibold block">Certificate Image</label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="aspect-[4/3] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden relative group"
                >
                  {imagePreview || existingImage ? (
                    <>
                      <img src={imagePreview || existingImage} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="text-white h-8 w-8" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-slate-300 mb-2" />
                      <p className="text-xs text-slate-400">Click to upload image</p>
                    </>
                  )}
                </div>
                <input type="file" ref={imageInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>

              {/* Middle/Right Columns: Text Inputs */}
              <div className="md:col-span-2 space-y-6">
                <div className="grid md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Name*</label>
                    <Input placeholder="Ex: Microsoft certified network associate" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Issuing organization*</label>
                    <Input placeholder="Ex: Microsoft" value={formData.issuer} onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Issue date</label>
                    <div className="flex gap-2">
                      <Select onValueChange={(val) => setFormData({ ...formData, issueMonth: val })} value={formData.issueMonth}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Year" value={formData.issueYear} onChange={(e) => setFormData({ ...formData, issueYear: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Expiration date</label>
                    <div className="flex gap-2">
                      <Select onValueChange={(val) => setFormData({ ...formData, expirationMonth: val })} value={formData.expirationMonth}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Year" value={formData.expirationYear} onChange={(e) => setFormData({ ...formData, expirationYear: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Credential ID</label>
                    <Input value={formData.credentialId} onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })} maxLength={80} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Credential URL</label>
                    <Input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((s: string) => (
                  <Badge key={s} variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {s} <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSkill(s)} />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={handleAddSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Add skill" />
                </SelectTrigger>
                <SelectContent>
                  {allSkills.map(s => <SelectItem key={s._id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400">Associate at least 1 skill to this license or certification.</p>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold">Media (Images, Certificates, Docs)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {existingMedia.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-slate-50">
                    <img src={url} alt="Media" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveMedia(i, true)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {mediaFiles.map((file, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-blue-50">
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-[10px] text-blue-600">
                      <FileText className="h-6 w-6 mb-1" />
                      <span className="truncate w-full">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveMedia(i, false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => mediaInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <Plus className="h-6 w-6 text-slate-300" />
                  <span className="text-[10px] text-slate-400">Add Media</span>
                </div>
              </div>
              <input type="file" ref={mediaInputRef} onChange={handleMediaChange} className="hidden" multiple />
            </div>

            <Button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 h-12 text-lg">
              {id ? "Update Certificate" : "Add Certificate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCertificate;
