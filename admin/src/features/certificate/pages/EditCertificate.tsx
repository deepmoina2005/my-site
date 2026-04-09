import React, { useState, useEffect } from "react";
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
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/shared/utils/axiosInstance";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const EditCertificate = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { skills: allSkills } = useSelector((state: RootState) => state.skills);

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
    media: []
  });
  const [loading, setLoading] = useState(false);
  const [newMedia, setNewMedia] = useState("");

  useEffect(() => {
    dispatch(getSkills());
    if (id) {
      setLoading(true);
      axiosInstance.get(`/certificates/${id}`).then(res => {
        setFormData(res.data.entity || res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (id) {
      dispatch(updateCertificate({ id, data: dataToSend })).then(() => {
        toast.success("Updated");
        navigate("/certificates/all");
      });
    } else {
      dispatch(addCertificate(dataToSend)).then(() => {
        toast.success("Created");
        navigate("/certificates/all");
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

  const handleAddMedia = () => {
    if (newMedia && !formData.media.includes(newMedia)) {
      setFormData({ ...formData, media: [...formData.media, newMedia] });
      setNewMedia("");
    }
  };

  const handleRemoveMedia = (url: string) => {
    setFormData({ ...formData, media: formData.media.filter((m: string) => m !== url) });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{id ? "Edit" : "Add"} License or Certification</CardTitle>
          <p className="text-sm text-slate-500">* Indicates required</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
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
              <p className="text-xs text-slate-400 mt-1">Associate at least 1 skill to this license or certification. It’ll also appear in your Skills section.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Media</label>
              <div className="space-y-2 mb-2">
                {formData.media.map((m: string) => (
                  <div key={m} className="flex items-center gap-2 p-2 bg-slate-50 border rounded-lg overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                    <span className="flex-1">{m}</span>
                    <X className="h-4 w-4 cursor-pointer text-red-500" onClick={() => handleRemoveMedia(m)} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add media URL like image, doc" value={newMedia} onChange={(e) => setNewMedia(e.target.value)} />
                <Button type="button" onClick={handleAddMedia} variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            <Button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800">{id ? "Update" : "Create"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCertificate;
