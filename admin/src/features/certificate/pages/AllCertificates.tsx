import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchCertificates, deleteCertificate } from "../certificateSlice";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Trash2, Pencil, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CardHeader, CardTitle } from "@/shared/components/ui/card";

const AllCertificates = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { certificates, loading } = useSelector((state: RootState) => state.certificates);

  useEffect(() => {
    dispatch(fetchCertificates());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      dispatch(deleteCertificate(id)).then(() => toast.success("Deleted"));
    }
  };

  return (
    <div className="p-6">
      <CardHeader className="flex flex-row items-center justify-between px-0">
        <CardTitle className="text-2xl font-bold">All Certificates</CardTitle>
        <Button onClick={() => navigate("/certificates/add")}><Plus className="mr-2 h-4 w-4" /> Add Certificate</Button>
      </CardHeader>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name/Title</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>
            ) : (certificates || []).map((item: any) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.issuer}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/certificates/${item._id}/edit`)}>
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

export default AllCertificates;
