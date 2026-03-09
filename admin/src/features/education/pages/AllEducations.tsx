import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchEducations, deleteEducation } from "../educationSlice";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Trash2, Pencil, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CardHeader, CardTitle } from "@/shared/components/ui/card";

const AllEducations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { educations, loading } = useSelector((state: RootState) => state.educations);

  useEffect(() => {
    dispatch(fetchEducations());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      dispatch(deleteEducation(id)).then(() => toast.success("Deleted"));
    }
  };

  return (
    <div className="p-6">
      <CardHeader className="flex flex-row items-center justify-between px-0">
        <CardTitle className="text-2xl font-bold">All Educations</CardTitle>
        <Button onClick={() => navigate("/education/add")}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
      </CardHeader>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Degree & Field</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading education history...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : educations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No education entries found. Add your first one!
                </TableCell>
              </TableRow>
            ) : educations.map((item: any) => (
              <TableRow key={item._id} className="group hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="h-10 w-10 rounded-md border bg-muted p-1 flex items-center justify-center overflow-hidden">
                    {item.logo ? (
                      <img src={item.logo} alt={item.institution} className="h-full w-full object-contain" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground opacity-50" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{item.institution}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{item.degree}</span>
                    <span className="text-xs text-muted-foreground">{item.fieldOfStudy || "No field specified"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {item.startDate ? new Date(item.startDate).getFullYear() : "N/A"}
                    <span>-</span>
                    {item.endDate ? new Date(item.endDate).getFullYear() : "Present"}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/education/${item._id}/edit`)}>
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

export default AllEducations;
