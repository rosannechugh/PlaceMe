import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const branches = [
  "CSE Core",
  "CSE - AI",
  "CSE - Data Science",
  "CSE - Cybersecurity",
  "IT",
  "ECM",
  "ECE",
  "ECE - VLSI"
];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cgpa: "",
    branch: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.cgpa || !form.branch) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    const cgpa = parseFloat(form.cgpa);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      toast({
        title: "Error",
        description: "CGPA must be between 0 and 10",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          cgpa: cgpa,
          branch: form.branch
        })
      });

      const data = await res.json();

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Registration successful! Please login."
        });

        navigate("/login");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Server not responding",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Student Registration
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@student.edu"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>CGPA</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="8.5"
                value={form.cgpa}
                onChange={(e) =>
                  setForm({ ...form, cgpa: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select
                onValueChange={(v) =>
                  setForm({ ...form, branch: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}