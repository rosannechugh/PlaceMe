import { createContext, useContext, useState, ReactNode } from "react";

export interface Company {
  id: string;
  name: string;
  role: string;
  package: string;
}

export interface Drive {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  package: string;
  minCGPA: number;
  eligibleBranch: string;
  date: string;
}

export interface Application {
  id: string;
  studentName: string;
  studentEmail: string;
  driveId: string;
  companyName: string;
  role: string;
  status: "Applied" | "Selected" | "Rejected";
}

export interface User {
  name: string;
  email: string;
  password: string;
  cgpa: number;
  branch: string;
  role: "student" | "admin";
}

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  companies: Company[];
  addCompany: (c: Company) => void;
  drives: Drive[];
  addDrive: (d: Drive) => void;
  applications: Application[];
  addApplication: (a: Application) => void;
  updateApplicationStatus: (id: string, status: Application["status"]) => void;
  users: User[];
  addUser: (u: User) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const sampleCompanies: Company[] = [
  { id: "1", name: "Google", role: "SDE Intern", package: "₹45 LPA" },
  { id: "2", name: "Microsoft", role: "SDE-1", package: "₹38 LPA" },
  { id: "3", name: "Amazon", role: "SDE Intern", package: "₹32 LPA" },
];

const sampleDrives: Drive[] = [
  { id: "1", companyId: "1", companyName: "Google", role: "SDE Intern", package: "₹45 LPA", minCGPA: 8.0, eligibleBranch: "CSE", date: "2026-04-15" },
  { id: "2", companyId: "2", companyName: "Microsoft", role: "SDE-1", package: "₹38 LPA", minCGPA: 7.5, eligibleBranch: "All", date: "2026-04-20" },
  { id: "3", companyId: "3", companyName: "Amazon", role: "SDE Intern", package: "₹32 LPA", minCGPA: 7.0, eligibleBranch: "CSE", date: "2026-05-01" },
];

const sampleUsers: User[] = [
  { name: "Admin", email: "admin@college.edu", password: "admin123", cgpa: 0, branch: "", role: "admin" },
  { name: "John Doe", email: "john@student.edu", password: "pass123", cgpa: 8.5, branch: "CSE", role: "student" },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>(sampleCompanies);
  const [drives, setDrives] = useState<Drive[]>(sampleDrives);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>(sampleUsers);

  const addCompany = (c: Company) => setCompanies((prev) => [...prev, c]);
  const addDrive = (d: Drive) => setDrives((prev) => [...prev, d]);
  const addApplication = (a: Application) => setApplications((prev) => [...prev, a]);
  const addUser = (u: User) => setUsers((prev) => [...prev, u]);
  const updateApplicationStatus = (id: string, status: Application["status"]) =>
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  return (
    <AppContext.Provider
      value={{ user, setUser, companies, addCompany, drives, addDrive, applications, addApplication, updateApplicationStatus, users, addUser }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
