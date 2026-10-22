export type UserRole =
  | "Student"
  | "Registrar"
  | "Library"
  | "Accounting"
  | "Guidance Office"
  | "MIS"
  | "Student Affairs";

export type DepartmentName =
  | "Library"
  | "Accounting"
  | "Guidance Office"
  | "MIS"
  | "Student Affairs";

export type ClearanceStatus = "Pending" | "Approved" | "On Hold";
export type RequestOverallStatus =
  | "Pending"
  | "In Clearance"
  | "Ready for Pickup"
  | "Completed"
  | "Cancelled";

export interface UserSession {
  role: UserRole;
  identifier: string;
  name: string;
}

export interface StudentProfile {
  studentId: string;
  firstName: string;
  lastName: string;
  course: string;
  yearLevel: string;
  contactNumber: string;
  email: string;
}

export interface DepartmentClearanceItem {
  id: string;
  department: DepartmentName;
  status: ClearanceStatus;
  remarks: string;
  approverId?: string;
  timestamp?: string;
}

export interface DocumentRequest {
  id: string;
  studentId: string;
  studentName: string;
  documentType:
    | "Transcript of Records (TOR)"
    | "Certificate of Good Moral"
    | "Registration Form / Cert of Enrollment"
    | "Diploma Reissue";
  submittedAt: string;
  status: RequestOverallStatus;
  clearanceItems: DepartmentClearanceItem[];
  pickupDate?: string;
  pickupTimeSlot?: string;
}
