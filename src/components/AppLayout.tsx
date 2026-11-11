import React, { useState, useEffect } from "react";
import type { UserSession, DocumentRequest, DepartmentName } from "../types";
import { authService } from "../services/auth_service";
import { requestService } from "../services/request_service";
import { scheduleService } from "../services/schedule_service";
import { NavBar } from "./NavBar";
import { ProfileModal } from "./ProfileModal";
import { StudentDashboard } from "../pages/StudentDashboard";
import { DepartmentClearancePage } from "../pages/DepartmentClearancePage";
import { RegistrarDashboard } from "../pages/RegistrarDashboard";
import { SchedulingPage } from "../pages/SchedulingPage";
import { AccountManagementPage } from "../pages/AccountManagementPage";

interface Props {
  session: UserSession;
  onSignOut: () => void;
}

export const AppLayout: React.FC<Props> = ({ session, onSignOut }) => {
  const isAdmin = session.role === "Admin";
  const [profileOpen, setProfileOpen] = useState(false);
  const [requests, setRequests] = useState<DocumentRequest[]>([]);

  const getDefaultTab = () => {
    if (session.role === "Admin") return "account-management";
    if (session.role === "Student") return "student-requests";
    if (session.role === "Registrar") return "registrar-audit";
    return "department-clearance";
  };

  const [activeTab, setActiveTab] = useState<string>(getDefaultTab());

  const loadRequests = async () => {
    try {
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (err: any) {
      console.error("Error loading requests:", err.message);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [session]);

  const handleLogout = async () => {
    await authService.signOut();
    onSignOut();
  };

  // For Admin viewing Department Clearance, default department role to "Library"
  const departmentSession: UserSession = isAdmin
    ? { ...session, role: "Library" as any }
    : session;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <NavBar
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setProfileOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Admin Management */}
        {isAdmin && activeTab === "account-management" && (
          <AccountManagementPage />
        )}

        {/* Student View (Students + Admin) */}
        {(session.role === "Student" || isAdmin) && activeTab === "student-requests" && (
          <StudentDashboard
            requests={requests}
            onCreateRequest={async (doc) => {
              await requestService.createRequest(doc);
              await loadRequests();
            }}
            onCancelRequest={async (id) => {
              await requestService.cancelRequest(id);
              await loadRequests();
            }}
            onUpdateRequest={async (id, doc) => {
              await requestService.updateRequestDocType(id, doc);
              await loadRequests();
            }}
            onDeleteRequest={async (id) => {
              await requestService.deleteRequest(id);
              await loadRequests();
            }}
          />
        )}

        {/* Registrar View (Registrar + Admin) */}
        {(session.role === "Registrar" || isAdmin) && activeTab === "registrar-audit" && (
          <RegistrarDashboard requests={requests} />
        )}

        {/* Department Officers View (Departments + Admin) */}
        {session.role !== "Student" && session.role !== "Registrar" && activeTab === "department-clearance" && (
          <DepartmentClearancePage
            session={departmentSession}
            requests={requests}
            onUpdateStatus={async (id, dept, status, remarks) => {
              await requestService.updateDepartmentStatus(id, dept as DepartmentName, status, remarks);
              await loadRequests();
            }}
          />
        )}

        {/* Scheduling Subsystem (Accessible across all authenticated roles) */}
        {activeTab === "scheduling" && (
          <SchedulingPage
            session={session}
            requests={requests}
            onReschedule={async (id, date, slot) => {
              await scheduleService.reschedulePickup(id, date, slot);
              await loadRequests();
            }}
            onCloseCollection={async (id) => {
              await scheduleService.closeCollection(id);
              await loadRequests();
            }}
          />
        )}
      </main>

      <footer className="bg-white border-t py-4 text-center text-xs text-slate-500">
        Unified Clearance Information System
      </footer>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={{
          studentId: session.username,
          firstName: session.name.split(" ")[0] || "",
          lastName: session.name.split(" ").slice(1).join(" ") || "",
          course: session.course || "BS in Computer Science",
          yearLevel: session.yearLevel || "4th Year",
          contactNumber: session.contactNumber || "+63 900 000 0000",
          email: session.email,
          description: session.description || "",
        }}
        onSave={() => setProfileOpen(false)}
      />
    </div>
  );
};

export default AppLayout;