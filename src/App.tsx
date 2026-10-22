import React, { useState } from 'react';
import type { UserRole, UserSession, StudentProfile, DocumentRequest, DepartmentName, ClearanceStatus } from './types';
import { mockDataService } from './services/mockDataService';
import { LoginPage } from './pages/LoginPage';
import { NavBar } from './components/NavBar';
import { ProfileModal } from './components/ProfileModal';
import { StudentDashboard } from './pages/StudentDashboard';
import { DepartmentClearancePage } from './pages/DepartmentClearancePage';
import { RegistrarDashboard } from './pages/RegistrarDashboard';
import { SchedulingPage } from './pages/SchedulingPage';

export const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(mockDataService.getSession());
  const [activeTab, setActiveTab] = useState<string>('student-requests');
  const [profile, setProfile] = useState<StudentProfile>(mockDataService.getProfile());
  const [requests, setRequests] = useState<DocumentRequest[]>(mockDataService.getRequests());
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const handleLogin = (role: UserRole, identifier: string) => {
    const userSession = mockDataService.login(role, identifier);
    setSession(userSession);
    if (role === 'Student') setActiveTab('student-requests');
    else if (role === 'Registrar') setActiveTab('registrar-audit');
    else setActiveTab('department-clearance');
  };

  const handleLogout = () => {
    mockDataService.logout();
    setSession(null);
  };

  const handleCreateRequest = (docType: DocumentRequest['documentType']) => {
    mockDataService.createRequest(docType);
    setRequests(mockDataService.getRequests());
  };

  const handleCancelRequest = (id: string) => {
    mockDataService.cancelRequest(id);
    setRequests(mockDataService.getRequests());
  };

  const handleUpdateDepartmentStatus = (
    requestId: string,
    dept: DepartmentName,
    status: ClearanceStatus,
    remarks: string,
    approverId: string
  ) => {
    mockDataService.updateDepartmentStatus(requestId, dept, status, remarks, approverId);
    setRequests(mockDataService.getRequests());
  };

  const handleReschedule = (id: string, date: string, slot: string) => {
    mockDataService.reschedulePickup(id, date, slot);
    setRequests(mockDataService.getRequests());
  };

  const handleCloseCollection = (id: string) => {
    mockDataService.closeCollection(id);
    setRequests(mockDataService.getRequests());
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    mockDataService.updateProfile(updated);
    setProfile(mockDataService.getProfile());
  };

  if (!session) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <NavBar
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {session.role === 'Student' && activeTab === 'student-requests' && (
          <StudentDashboard
            requests={requests}
            onCreateRequest={handleCreateRequest}
            onCancelRequest={handleCancelRequest}
          />
        )}

        {session.role === 'Registrar' && activeTab === 'registrar-audit' && (
          <RegistrarDashboard requests={requests} />
        )}

        {session.role !== 'Student' && session.role !== 'Registrar' && activeTab === 'department-clearance' && (
          <DepartmentClearancePage
            session={session}
            requests={requests}
            onUpdateStatus={handleUpdateDepartmentStatus}
          />
        )}

        {activeTab === 'scheduling' && (
          <SchedulingPage
            session={session}
            requests={requests}
            onReschedule={handleReschedule}
            onCloseCollection={handleCloseCollection}
          />
        )}
      </main>

      <footer className="bg-white border-t py-4 text-center text-xs text-slate-500">
        Unified Clearance Information System &bull; Prototype
      </footer>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default App;