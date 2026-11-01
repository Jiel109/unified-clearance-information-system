import type { StudentProfile, DocumentRequest, DepartmentName, ClearanceStatus, UserRole, UserSession } from '../types';

export const initialStudentProfile: StudentProfile = {
  studentId: '2000368966',
  firstName: 'Arleij Jan',
  lastName: 'Lopez',
  course: 'BS in Computer Science',
  yearLevel: '4th Year',
  contactNumber: '+63 967 676 7676',
  email: 'lopez.368966@caloocan.sti.edu.ph',
};

const initialChecklist = (baseRemarks = 'Pending assessment'): DocumentRequest['clearanceItems'] => [
  { id: 'c1', department: 'Library', status: 'Pending', remarks: baseRemarks },
  { id: 'c2', department: 'Accounting', status: 'Pending', remarks: baseRemarks },
  { id: 'c3', department: 'Guidance Office', status: 'Approved', remarks: 'No pending infractions', approverId: 'GUID-01', timestamp: '2026-10-18 10:30' },
  { id: 'c4', department: 'MIS', status: 'Approved', remarks: 'Student portal cleared', approverId: 'MIS-03', timestamp: '2026-10-18 11:15' },
  { id: 'c5', department: 'Student Affairs', status: 'Pending', remarks: 'Community service check' }
];

export const initialRequests: DocumentRequest[] = [
  {
    id: 'REQ-2026-001',
    studentId: '2000368966',
    studentName: 'Arleij Jan Lopez',
    documentType: 'Transcript of Records (TOR)',
    submittedAt: '2026-10-18 09:20 AM',
    status: 'In Clearance',
    clearanceItems: initialChecklist(),
    pickupDate: '2026-10-25',
    pickupTimeSlot: '01:00 PM - 02:00 PM'
  },
  {
    id: 'REQ-2026-002',
    studentId: '2000368966',
    studentName: 'Arleij Jan Lopez',
    documentType: 'Certificate of Good Moral',
    submittedAt: '2026-10-19 02:15 PM',
    status: 'Ready for Pickup',
    clearanceItems: [
      { id: 'c1', department: 'Library', status: 'Approved', remarks: 'All books returned', approverId: 'LIB-02', timestamp: '2026-10-20 09:00' },
      { id: 'c2', department: 'Accounting', status: 'Approved', remarks: 'Account balanced', approverId: 'ACC-01', timestamp: '2026-10-20 09:30' },
      { id: 'c3', department: 'Guidance Office', status: 'Approved', remarks: 'No records', approverId: 'GUID-01', timestamp: '2026-10-20 10:00' },
      { id: 'c4', department: 'MIS', status: 'Approved', remarks: 'Email active', approverId: 'MIS-01', timestamp: '2026-10-20 10:30' },
      { id: 'c5', department: 'Student Affairs', status: 'Approved', remarks: 'Cleared', approverId: 'OSA-01', timestamp: '2026-10-20 11:00' }
    ],
    pickupDate: '2026-10-22',
    pickupTimeSlot: '10:00 AM - 11:00 AM'
  }
];

const REQUESTS_KEY = 'ucis.requests';
const PROFILES_KEY = 'ucis.profiles';

const loadStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveStored = (key: string, value: unknown): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

const stamp = () => new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

class MockDataService {
  private requests: DocumentRequest[] = loadStored<DocumentRequest[]>(REQUESTS_KEY, [...initialRequests]);
  private profiles: StudentProfile[] = loadStored<StudentProfile[]>(PROFILES_KEY, [{ ...initialStudentProfile }]);
  private currentStudentId: string = this.profiles[0]?.studentId ?? initialStudentProfile.studentId;
  private session: UserSession | null = null;

  private persist(): void {
    saveStored(REQUESTS_KEY, this.requests);
    saveStored(PROFILES_KEY, this.profiles);
  }

  getSession(): UserSession | null {
    return this.session;
  }

  login(role: UserRole, identifier: string): UserSession {
    if (role === 'Student') {
      const match = this.profiles.find(
        p => p.email.toLowerCase() === identifier.trim().toLowerCase() || p.studentId === identifier.trim()
      );
      this.currentStudentId = (match ?? this.profiles[0]).studentId;
    }

    const profile = this.getProfile();
    let name = 'Authorized User';
    if (role === 'Student') name = `${profile.firstName} ${profile.lastName}`;
    if (role === 'Registrar') name = 'Mr. Juan Dela Cruz (Registrar Staff)';
    if (role === 'Library') name = 'Mr. John Doe (Librarian)';
    if (role === 'Accounting') name = 'Ms. Jane Doe (Accounting Staff)';
    if (role === 'Guidance Office') name = 'Mr. John Santos (Counselor)';
    if (role === 'MIS') name = 'Nr. John Lopez (MIS Admin)';
    if (role === 'Student Affairs') name = 'Mr. Juan Lopez (OSA Head)';

    this.session = { role, identifier, name };
    return this.session;
  }

  logout(): void {
    this.session = null;
  }

  getProfile(): StudentProfile {
    const current = this.profiles.find(p => p.studentId === this.currentStudentId) ?? this.profiles[0];
    return { ...current };
  }

  updateProfile(updated: StudentProfile): void {
    this.profiles = this.profiles.map(p => (p.studentId === updated.studentId ? { ...updated } : p));
    this.persist();
  }

  getProfiles(): StudentProfile[] {
    return this.profiles.map(p => ({ ...p }));
  }

  createProfile(newProfile: StudentProfile): string | null {
    const duplicate = this.profiles.some(
      p =>
        p.studentId === newProfile.studentId ||
        p.email.toLowerCase() === newProfile.email.toLowerCase()
    );
    if (duplicate) return 'A student with this Student ID or email already exists.';
    this.profiles = [{ ...newProfile }, ...this.profiles];
    this.persist();
    return null;
  }

  updateProfileRecord(originalStudentId: string, updated: StudentProfile): string | null {
    const duplicate = this.profiles.some(
      p =>
        p.studentId !== originalStudentId &&
        (p.studentId === updated.studentId || p.email.toLowerCase() === updated.email.toLowerCase())
    );
    if (duplicate) return 'Another student already uses this Student ID or email.';
    this.profiles = this.profiles.map(p => (p.studentId === originalStudentId ? { ...updated } : p));
    const fullName = `${updated.firstName} ${updated.lastName}`;
    this.requests = this.requests.map(req =>
      req.studentId === originalStudentId
        ? { ...req, studentId: updated.studentId, studentName: fullName }
        : req
    );
    if (this.currentStudentId === originalStudentId) this.currentStudentId = updated.studentId;
    this.persist();
    return null;
  }

  deleteProfile(studentId: string): string | null {
    if (this.profiles.length <= 1) return 'At least one student record must remain.';
    this.profiles = this.profiles.filter(p => p.studentId !== studentId);
    this.requests = this.requests.filter(req => req.studentId !== studentId);
    if (this.currentStudentId === studentId) this.currentStudentId = this.profiles[0].studentId;
    this.persist();
    return null;
  }

  getRequests(): DocumentRequest[] {
    return [...this.requests];
  }

  createRequest(docType: DocumentRequest['documentType']): DocumentRequest {
    const profile = this.getProfile();
    const newReq: DocumentRequest = {
      id: `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      studentId: profile.studentId,
      studentName: `${profile.firstName} ${profile.lastName}`,
      documentType: docType,
      submittedAt: stamp(),
      status: 'In Clearance',
      clearanceItems: initialChecklist()
    };
    this.requests.unshift(newReq);
    this.persist();
    return newReq;
  }

  updateRequest(requestId: string, docType: DocumentRequest['documentType']): void {
    this.requests = this.requests.map(req =>
      req.id === requestId && (req.status === 'Pending' || req.status === 'In Clearance')
        ? { ...req, documentType: docType }
        : req
    );
    this.persist();
  }

  deleteRequest(requestId: string): void {
    this.requests = this.requests.filter(req => req.id !== requestId);
    this.persist();
  }

  cancelRequest(requestId: string): void {
    this.requests = this.requests.map(req =>
      req.id === requestId ? { ...req, status: 'Cancelled' as const } : req
    );
    this.persist();
  }

  updateDepartmentStatus(
    requestId: string,
    department: DepartmentName,
    status: ClearanceStatus,
    remarks: string,
    approverId: string
  ): void {
    this.requests = this.requests.map(req => {
      if (req.id !== requestId) return req;
      const updatedChecklist = req.clearanceItems.map(item => {
        if (item.department !== department) return item;
        return {
          ...item,
          status,
          remarks,
          approverId,
          timestamp: stamp()
        };
      });

      const allApproved = updatedChecklist.every(c => c.status === 'Approved');
      const anyHold = updatedChecklist.some(c => c.status === 'On Hold');

      let newStatus: DocumentRequest['status'] = req.status;
      if (allApproved) newStatus = 'Ready for Pickup';
      else if (anyHold) newStatus = 'In Clearance';

      return {
        ...req,
        clearanceItems: updatedChecklist,
        status: newStatus
      };
    });
    this.persist();
  }

  reschedulePickup(requestId: string, date: string, timeSlot: string): void {
    this.requests = this.requests.map(req =>
      req.id === requestId ? { ...req, pickupDate: date, pickupTimeSlot: timeSlot } : req
    );
    this.persist();
  }

  closeCollection(requestId: string): void {
    this.requests = this.requests.map(req =>
      req.id === requestId ? { ...req, status: 'Completed' as const } : req
    );
    this.persist();
  }
}

export const mockDataService = new MockDataService();
