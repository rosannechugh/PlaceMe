import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateDrive() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [title, setTitle] = useState("");
  const [pkg, setPkg] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [date, setDate] = useState("");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const branches = [
    "All",
    "CSE Core",
    "CSE - AI",
    "CSE - Data Science",
    "CSE - Cybersecurity",
    "IT",
    "ECM",
    "ECE",
    "ECE - VLSI"
  ];

  // 🔥 Fetch companies
  useEffect(() => {
    fetch("https://placeme-nalv.onrender.com/companies")
      .then(res => res.json())
      .then(data => setCompanies(data));
  }, []);

  const handleSubmit = async () => {
    const res = await fetch("https://placeme-nalv.onrender.com/create-drive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        company_id: Number(companyId),
        title: title,
        package: pkg,
        min_cgpa: Number(cgpa),
        eligible_branch: selectedBranches.join(", "), // ✅ FIXED
        drive_date: date
      })
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold">Create Drive</h2>

        {/* Company */}
        <select
          className="w-full border p-2 rounded"
          onChange={(e) => setCompanyId(e.target.value)}
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Role */}
        <Input
          placeholder="Role (e.g. Software Engineer)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Package */}
        <Input
          placeholder="Package (e.g. 12 LPA)"
          value={pkg}
          onChange={(e) => setPkg(e.target.value)}
        />

        {/* 🔥 MULTISELECT BRANCH */}
        <div>
          <p className="font-medium mb-2">Eligible Branches</p>

          <div className="grid grid-cols-2 gap-2">
            {branches.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBranches.includes(b)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBranches([...selectedBranches, b]);
                    } else {
                      setSelectedBranches(
                        selectedBranches.filter((x) => x !== b)
                      );
                    }
                  }}
                />
                {b}
              </label>
            ))}
          </div>
        </div>

        {/* CGPA */}
        <Input
          placeholder="Minimum CGPA"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
        />

        {/* Date */}
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Button onClick={handleSubmit}>Create Drive</Button>
      </div>
    </div>
  );
}