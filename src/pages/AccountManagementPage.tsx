import React, { useState, useEffect } from "react";
import type { UserRole, CreateUserPayload, UpdateUserPayload } from "../types";
import { adminService, type ProfileRecord } from "../services/admin_service";
import {
  UserPlus,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Trash2,
  Edit2,
  Search,
  X,
} from "lucide-react";

const AVAILABLE_ROLES: UserRole[] = [
  "Student",
  "Registrar",
  "Library",
  "Accounting",
  "Guidance Office",
  "MIS",
  "Student Affairs",
  "Admin",
];

export const AccountManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ProfileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<ProfileRecord | null>(null);
  const [editFormData, setEditFormData] = useState<UpdateUserPayload>({});
  const [updating, setUpdating] = useState(false);

  // Create Form State
  const [createFormData, setCreateFormData] = useState<CreateUserPayload>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "Student",
    course: "",
    yearLevel: "1st Year",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await adminService.createUser(createFormData);
      setSuccessMsg(`User ${createFormData.username} created successfully.`);
      setCreateFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "Student",
        course: "",
        yearLevel: "1st Year",
      });
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (user: ProfileRecord) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      course: user.course || "",
      yearLevel: user.year_level || "1st Year",
      contactNumber: user.contact_number || "",
      password: "",
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUpdating(true);
    setErrorMsg(null);

    try {
      await adminService.updateUser(editingUser.id, editFormData);
      setSuccessMsg(`Account for ${editFormData.username} updated.`);
      setEditingUser(null);
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update user.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (user: ProfileRecord) => {
    const confirmation = window.confirm(
      `Delete account "${user.username}"? This permanently purges authentication records and profiles.`,
    );
    if (!confirmation) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await adminService.deleteUser(user.id);
      setSuccessMsg(`Account ${user.username} has been removed.`);
      await loadUsers();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.username?.toLowerCase().includes(q) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002d62] flex items-center gap-2">
            <ShieldAlert className="text-[#fec810]" />
            Account Management
          </h2>
          <p className="text-sm text-slate-500">
            Create and manage user records.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg w-full md:w-72">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search username, name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs outline-none w-full text-slate-700"
          />
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2 animate-in fade-in">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2 border-b pb-2">
            <UserPlus size={16} className="text-[#002d62]" />
            Create New Account
          </h3>

          <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-600 uppercase">Role</label>
              <select
                aria-label="Role"
                value={createFormData.role}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    role: e.target.value as UserRole,
                  })
                }
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm font-semibold text-[#002d62] focus:ring-2 focus:ring-[#002d62] outline-none cursor-pointer"
              >
                {AVAILABLE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 uppercase">
                Username (ID)
              </label>
              <input
                type="text"
                placeholder={
                  createFormData.role === "Student"
                    ? "e.g. 2000368966"
                    : createFormData.role === "Admin"
                      ? "e.g. ADMIN-001"
                      : createFormData.role === "Registrar"
                        ? "e.g. REG-01"
                        : createFormData.role === "Library"
                          ? "e.g. LIB-01"
                          : createFormData.role === "Accounting"
                            ? "e.g. ACC-01"
                            : createFormData.role === "Guidance Office"
                              ? "e.g. GUID-01"
                              : createFormData.role === "MIS"
                                ? "e.g. MIS-01"
                                : createFormData.role === "Student Affairs"
                                  ? "e.g. OSA-01"
                                  : "e.g. 2000368966"
                }
                value={createFormData.username}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    username: e.target.value,
                  })
                }
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 uppercase">
                Institutional Email
              </label>
              <input
                type="email"
                placeholder="user@caloocan.sti.edu.ph"
                value={createFormData.email}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    email: e.target.value,
                  })
                }
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 uppercase">
                Initial Password
              </label>
              <input
                type="password"
                placeholder="Enter initial password"
                value={createFormData.password}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    password: e.target.value,
                  })
                }
                className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-600 uppercase">
                  First Name
                </label>
                <input
                  type="text"
                  value={createFormData.firstName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 uppercase">
                  Last Name
                </label>
                <input
                  type="text"
                  value={createFormData.lastName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                  required
                />
              </div>
            </div>

            {createFormData.role === "Student" && (
              <div className="grid grid-cols-2 gap-2 pt-1 border-t">
                <div>
                  <label className="font-bold text-slate-600 uppercase">
                    Course
                  </label>
                  <input
                    type="text"
                    placeholder="BS in Computer Science"
                    value={createFormData.course}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        course: e.target.value,
                      })
                    }
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 uppercase">
                    Year Level
                  </label>
                  <select
                    aria-label="Year Level"
                    value={createFormData.yearLevel}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        yearLevel: e.target.value,
                      })
                    }
                    className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 py-2.5 bg-[#002d62] hover:bg-[#001f44] text-[#fec810] font-bold rounded-lg text-sm transition flex items-center justify-center gap-2 shadow"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : null}
              <span>Create Account</span>
            </button>
          </form>
        </div>

        {/* Directory Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">
              Registered Accounts ({filteredUsers.length})
            </h3>
          </div>

          <div className="overflow-x-auto flex-1">
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#002d62]" />
                <span className="text-xs">Fetching accounts...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No accounts match the query.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#002d62] text-white uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Username (ID)</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-[#002d62]">
                        {u.username}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {u.first_name} {u.last_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-[#002d62] border border-blue-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {u.course
                          ? `${u.course} (${u.year_level})`
                          : u.department || "—"}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(u)}
                          className="inline-flex items-center gap-1 text-[#002d62] hover:bg-blue-50 font-bold px-2 py-1 rounded border border-blue-200 transition"
                          title="Edit Account"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>
                        {u.role !== "Admin" && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="inline-flex items-center gap-1 text-rose-600 hover:bg-rose-50 font-bold px-2 py-1 rounded border border-rose-200 transition"
                            title="Delete Account"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002d62] text-white px-6 py-4 flex justify-between items-center border-b-2 border-[#fec810]">
              <div>
                <h3 className="font-bold text-base">
                  Edit Account: {editingUser.username}
                </h3>
                <p className="text-xs text-yellow-300">{editingUser.email}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-yellow-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateUser}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs"
            >
              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">
                  Username (ID)
                </label>
                <input
                  type="text"
                  value={editFormData.username || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      username: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-[#002d62]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 uppercase mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">
                  Assigned Role
                </label>
                <select
                  aria-label="Assigned Role"
                  value={editFormData.role || editingUser.role}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full p-2 border rounded-lg text-sm font-semibold text-[#002d62] outline-none focus:ring-2 focus:ring-[#002d62]"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {(editFormData.role === "Student" ||
                editingUser.role === "Student") && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">
                      Course
                    </label>
                    <input
                      type="text"
                      value={editFormData.course || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          course: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 uppercase mb-1">
                      Year Level
                    </label>
                    <select
                      aria-label="Year Level"
                      value={editFormData.yearLevel || "1st Year"}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          yearLevel: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-600 uppercase mb-1">
                  Reset Password{" "}
                  <span className="font-normal lowercase text-slate-400">
                    (leave blank to keep current)
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password..."
                  value={editFormData.password || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      password: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#002d62]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-[#002d62] text-[#fec810] font-bold rounded-lg hover:bg-[#001f44] transition flex items-center gap-2 shadow"
                >
                  {updating ? (
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  ) : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
