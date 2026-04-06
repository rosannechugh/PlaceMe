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
import { ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function ViewApplications() {
  const [applications, setApplications] = useState<any[]>([]);

  // 🔹 Fetch applications
  const fetchApplications = () => {
    fetch("https://placeme-nalv.onrender.com/all-applications", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // 🔹 Update status
  const updateStatus = (id: number, status: string) => {
    fetch("https://placeme-nalv.onrender.com/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, status })
    })
      .then(res => res.json())
      .then(() => fetchApplications()); // 🔥 refresh table
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          All Applications
        </h1>

        {applications.length > 0 ? (
          <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resume</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {applications.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.student_name}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell className="font-medium">
                      {a.company_name}
                    </TableCell>
                    <TableCell>{a.title}</TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <Badge
                        variant={
                          a.status === "Selected"
                            ? "default"
                            : a.status === "Rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {a.status || "Applied"}
                      </Badge>
                    </TableCell>

                    {/* 🔥 Action Dropdown */}
                    <TableCell>
                      <Select
                        defaultValue={a.status || "Applied"}
                        onValueChange={(value) =>
                          updateStatus(a.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Applied">Applied</SelectItem>
                          <SelectItem value="Selected">Selected</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
  {a.resume ? (
    <a
      href={`https://placeme-nalv.onrender.com/resume/${a.resume}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 underline"
    >
      View
    </a>
  ) : (
    "No Resume"
  )}
</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No applications yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}