import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CalendarPlus, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [companies, setCompanies] = useState(0);
  const [drives, setDrives] = useState(0);
  const [applications, setApplications] = useState(0);

  useEffect(() => {
    // 🔹 Companies
    fetch("https://placeme-nalv.onrender.com/companies")
      .then(res => res.json())
      .then(data => setCompanies(data.length));

    // 🔹 Drives
    fetch("https://placeme-nalv.onrender.com/drives")
      .then(res => res.json())
      .then(data => setDrives(data.length));

    // 🔹 Applications
    fetch("https://placeme-nalv.onrender.com/all-applications")
      .then(res => res.json())
      .then(data => setApplications(data.length));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-bold">{companies}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <CalendarPlus className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Drives</p>
                <p className="text-2xl font-bold">{drives}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <ClipboardList className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{applications}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}