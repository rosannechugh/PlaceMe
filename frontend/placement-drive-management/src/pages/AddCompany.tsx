import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AddCompany() {
  const [form, setForm] = useState({ name: "" });
  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // 🔥 prevent reload

    const res = await fetch("http://localhost:5000/add-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.name   // ✅ FIXED
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
        description: data.message
      });
      setForm({ name: "" }); // reset input
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Add Company</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  placeholder="e.g. Google"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <Button type="submit" className="w-full">
                Add Company
              </Button>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}