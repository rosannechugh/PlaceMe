import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Calendar, IndianRupee, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [drives, setDrives] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);

  const handleUpload = async () => {
  if (!file) {
    alert("Select a file");
    return;
  }

  if (file.type !== "application/pdf") {
    alert("Only PDF allowed");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Max size is 2MB");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch("https://placeme-nalv.onrender.com/upload-resume", {
    method: "POST",
    credentials: "include",
    body: formData
  });

  const data = await res.json();
  alert(data.message || data.error);
};
  
  useEffect(() => {
    // 🔹 Fetch drives
    fetch("https://placeme-nalv.onrender.com/drives", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("DRIVES:", data); // 🔥 DEBUG
        if (Array.isArray(data)) {
          setDrives(data);
        } else {
          console.error("Invalid drives data", data);
          setDrives([]);
        }
      })
      .catch(err => {
        console.error("Drives error:", err);
        setDrives([]);
      });

    // 🔹 Fetch applied drives
    fetch("https://placeme-nalv.onrender.com/applications", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("APPLICATIONS:", data); // 🔥 DEBUG
        if (Array.isArray(data)) {
          const ids = data.map((a: any) => a.drive_id); // ✅ FIXED
          setAppliedIds(ids);
        }
      })
      .catch(err => console.error("Applications error:", err));
  }, []);

  const handleApply = (drive_id: number) => {
    fetch("https://placeme-nalv.onrender.com/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ drive_id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success",
            description: data.message
          });

          setAppliedIds(prev => [...prev, drive_id]);
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive"
        });
      });
  };

  // 🔥 SAFETY CHECK
  if (!Array.isArray(drives)) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mb-6 p-4 border rounded-lg">
  <h2 className="text-lg font-semibold mb-2">Upload Resume</h2>

  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
  />

  <Button className="mt-2" onClick={handleUpload}>
    Upload Resume
  </Button>
</div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">
          Available Placement Drives
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drives.map((drive) => {
            const applied = appliedIds.includes(drive.id);

            return (
              <Card key={drive.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>
                      {drive.company_name || "Company"}
                    </CardTitle>
                    <Badge>{drive.title || "Role"}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex gap-2 text-sm">
                    <IndianRupee className="h-4 w-4" />
                    {drive.package || "Not specified"}
                  </div>

                  <div className="flex gap-2 text-sm">
                    <GraduationCap className="h-4 w-4" />
                    CGPA: {drive.min_cgpa || "N/A"} |{" "}
                    {drive.eligible_branch || "All"}
                  </div>

                  <div className="flex gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {drive.drive_date || "No date"}
                  </div>

                  <Button
                    className="w-full"
                    disabled={applied}
                    onClick={() => handleApply(drive.id)}
                  >
                    {applied ? "Applied ✓" : "Apply Now"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {drives.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No placement drives available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}