import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchCategories, deleteCategory, addCategory, updateCategory } from "../categorySlice";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Trash2, Pencil, Plus, Loader2, ListFilter, AlertCircle, Search, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import toast from "react-hot-toast";

const MODULES = ["blog", "project", "book", "note", "service", "product", "skill"];

interface CategoryListProps {
    title?: string;
    description?: string;
}

const CategoryList: React.FC<CategoryListProps> = ({
    title = "Categories Management",
    description = "Manage categories across all modules of your portfolio."
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, loading, error } = useSelector((state: RootState) => state.categories);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState<string>("all");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", module: "", description: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await dispatch(deleteCategory(id)).unwrap();
                toast.success("Category deleted successfully");
            } catch (err: any) {
                toast.error(err || "Failed to delete category");
            }
        }
    };

    const handleOpenModal = (category?: any) => {
        if (category) {
            setIsEditing(true);
            setEditId(category._id);
            setFormData({ name: category.name, module: category.module, description: category.description || "" });
        } else {
            setIsEditing(false);
            setEditId(null);
            setFormData({ name: "", module: "", description: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "", module: "", description: "" });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.module) {
            toast.error("Name and module are required");
            return;
        }

        setSubmitting(true);
        try {
            if (isEditing && editId) {
                await dispatch(updateCategory({ id: editId, data: formData })).unwrap();
                toast.success("Category updated successfully");
            } else {
                await dispatch(addCategory(formData)).unwrap();
                toast.success("Category added successfully");
            }
            dispatch(fetchCategories()); // Refresh list
            handleCloseModal();
        } catch (err: any) {
            toast.error(err || "Failed to process category");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCategories = categories.filter((cat: any) => {
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = selectedModule === "all" || cat.module === selectedModule;
        return matchesSearch && matchesModule;
    });

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/25"
                >
                    <Plus className="mr-2 h-5 w-5" /> Add Category
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="w-full md:w-64">
                    <Select value={selectedModule} onValueChange={setSelectedModule}>
                        <SelectTrigger className="h-11 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl">
                            <Filter className="mr-2 h-4 w-4 text-slate-400" />
                            <SelectValue placeholder="Filter by Module" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Modules</SelectItem>
                            {MODULES.map(mod => (
                                <SelectItem key={mod} value={mod} className="capitalize">{mod}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/50 backdrop-blur-xl dark:bg-slate-900/50 overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 text-purple-600">
                        <ListFilter className="h-5 w-5" />
                        <CardTitle className="text-lg font-semibold">Categories List</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                <TableHead className="py-4 pl-6">Category Name</TableHead>
                                <TableHead className="py-4">Target Module</TableHead>
                                <TableHead className="py-4 whitespace-nowrap">Created Date</TableHead>
                                <TableHead className="text-right py-4 pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                                            <span className="text-sm font-medium text-slate-500">Loading categories...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle className="h-10 w-10 text-slate-300" />
                                            <p className="font-medium">No categories found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((item: any) => (
                                    <TableRow key={item._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800 transition-colors">
                                        <TableCell className="font-bold py-4 pl-6 text-slate-900 dark:text-white">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 capitalize font-semibold border-none">
                                                {item.module}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-slate-500 whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right py-4 pr-6 space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm transition-all"
                                                onClick={() => handleOpenModal(item)}
                                            >
                                                <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-600 shadow-sm transition-all"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {isEditing ? "Edit Category" : "Add New Category"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">

                        {/* Category Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Category Name</label>
                            <Input
                                placeholder="Example: Technology, Design..."
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="h-11 rounded-xl w-full"
                                required
                            />
                        </div>

                        {/* Target Module */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Target Module</label>

                            <Select
                                value={formData.module}
                                onValueChange={(val) =>
                                    setFormData({ ...formData, module: val })
                                }
                            >
                                <SelectTrigger className="h-11 rounded-xl w-full">
                                    <SelectValue placeholder="Select Module" />
                                </SelectTrigger>

                                <SelectContent>
                                    {MODULES.map((mod) => (
                                        <SelectItem
                                            key={mod}
                                            value={mod}
                                            className="capitalize"
                                        >
                                            {mod}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">
                                Description (Optional)
                            </label>
                            <Input
                                placeholder="Short description..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="h-11 rounded-xl w-full"
                            />
                        </div>

                        {/* Buttons */}
                        <DialogFooter className="pt-4 flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseModal}
                                className="h-11 rounded-xl flex-1"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-purple-600 hover:bg-purple-700 h-11 rounded-xl flex-1"
                            >
                                {submitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isEditing ? (
                                    "Update Category"
                                ) : (
                                    "Save Category"
                                )}
                            </Button>
                        </DialogFooter>

                    </form>
                </DialogContent>
            </Dialog>

            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}
        </div>
    );
};

export default CategoryList;
