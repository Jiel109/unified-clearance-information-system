import { supabase } from "./auth_service";
import type { CreateUserPayload, UpdateUserPayload, UserRole } from "../types";

export interface ProfileRecord {
  id: string;
  username: string;
  identifier: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  department: string | null;
  contact_number: string | null;
  year_level: string | null;
  course: string | null;
  email?: string;
  created_at: string;
  updated_at: string;
}

export const adminService = {
  // Fetch User Directory
  async getAllUsers(): Promise<ProfileRecord[]> {
    const { data, error } = await supabase.rpc("admin_get_all_users");

    if (error) {
      throw new Error(`Failed to fetch user directory: ${error.message}`);
    }

    return (data as ProfileRecord[]) || [];
  },

  // Create New User
  async createUser(payload: CreateUserPayload): Promise<void> {
    const { error } = await supabase.rpc("admin_create_user", {
      p_username: payload.username.trim(),
      p_email: payload.email.trim(),
      p_password: payload.password || "DefaultPassword123",
      p_first_name: payload.firstName.trim(),
      p_last_name: payload.lastName.trim(),
      p_role: payload.role,
      p_department: payload.department || null,
      p_contact_number: payload.contactNumber || null,
      p_course: payload.course || null,
      p_year_level: payload.yearLevel || null,
    });

    if (error) {
      throw new Error(error.message || "Failed to create account.");
    }
  },

  // Update User
  async updateUser(userId: string, updates: UpdateUserPayload): Promise<void> {
    const { error } = await supabase.rpc("admin_update_user", {
      p_target_user_id: userId,
      p_username: updates.username ? updates.username.trim() : null,
      p_email: updates.email ? updates.email.trim() : null,
      p_password:
        updates.password && updates.password.length > 0
          ? updates.password
          : null,
      p_first_name: updates.firstName ? updates.firstName.trim() : null,
      p_last_name: updates.lastName ? updates.lastName.trim() : null,
      p_role: updates.role || null,
      p_department: updates.department || null,
      p_contact_number: updates.contactNumber || null,
      p_course: updates.course || null,
      p_year_level: updates.yearLevel || null,
    });

    if (error) {
      throw new Error(error.message || "Failed to update account.");
    }
  },

  // Delete User
  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase.rpc("admin_delete_user", {
      p_target_user_id: userId,
    });

    if (error) {
      throw new Error(error.message || "Failed to delete account.");
    }
  },
};
