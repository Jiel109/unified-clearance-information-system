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

class MockDataService {
  private requests: DocumentRequest[] = [...initialRequests];
  private profile: StudentProfile = { ...initialStudentProfile };
  private session: UserSession | null = null;

  getSession(): UserSession | null {
    return this.session;
  }

  login(role: UserRole, identifier: string): UserSession {
    let name = 'Authorized User';
    if (role === 'Student') name = `${this.profile.firstName} ${this.profile.lastName}`;
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
    return { ...this.profile };
  }

  updateProfile(updated: StudentProfile): void {
    this.profile = { ...updated };
  }

  getRequests(): DocumentRequest[] {
    return [...this.requests];
  }

  createRequest(docType: DocumentRequest['documentType']): DocumentRequest {
    const newReq: DocumentRequest = {
      id: `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      studentId: this.profile.studentId,
      studentName: `${this.profile.firstName} ${this.profile.lastName}`,
      documentType: docType,
      submittedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'In Clearance',
      clearanceItems: initialChecklist()
    };
    this.requests.unshift(newReq);
    return newReq;
  }

  cancelRequest(requestId: string): void {
    this.requests = this.requests.map(req =>
      req.id === requestId ? { ...req, status: 'Cancelled' as const } : req
    );
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
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
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
  }

  reschedulePickup(requestId: string, date: string, timeSlot: string): void {
    this.requests = this.requests.map(req =>
      req.id === requestId ? { ...req, pickupDate: date, pickupTimeSlot: timeSlot } : req
    );
  }

  closeCollection(requestId: string): void {
    this.requests = this.requests.map(req =>
      req.id === requestId ? { ...req, status: 'Completed' as const } : req
    );
  }
}

export const mockDataService = new MockDataService();