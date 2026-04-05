import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function ApplicationStatus() {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/applications", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">
          My Applications
        </h1>

        {applications.length > 0 ? (
          <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {applications.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.company_name}
                    </TableCell>

                    <TableCell>
                      {a.title}
                    </TableCell>

                    <TableCell>
                      <Badge variant={
                        a.status === "Selected"
                          ? "default"
                          : a.status === "Rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      >
                        {a.status}
                       
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>You haven't applied to any drives yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}