import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = location.pathname.startsWith("/admin");

  const logout = async () => {
    await fetch("https://placeme-nalv.onrender.com/logout", {
      method: "POST",
      credentials: "include"
    });

    navigate("/"); // ✅ FIXED (not /login)
  };

  const studentLinks = [
    { to: "/dashboard", label: "Home" },
    { to: "/applications", label: "My Applications" },
  ];

  const adminLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/add-company", label: "Add Company" },
    { to: "/admin/create-drive", label: "Create Drive" },
    { to: "/admin/view-applications", label: "View Applications" },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
        >
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold text-lg">PlaceMe</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-md hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}

          <Button variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2"
            >
              {l.label}
            </Link>
          ))}

          <button onClick={logout} className="block w-full text-left py-2">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

