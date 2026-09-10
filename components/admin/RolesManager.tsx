"use client";

import React, { useState } from "react";
import {
  AdminAccountConfig,
  AdminRole,
  getRegisteredAdminAccounts,
  saveAdminAccount,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
} from "@/lib/admin-auth";
import { useToast } from "@/context/ToastContext";
import { ShieldCheck, Plus, UserCheck, ShieldAlert, Key, Mail, User, Check, X, Sparkles } from "lucide-react";

interface RolesManagerProps {
  currentRole: AdminRole;
}

export default function RolesManager({ currentRole }: RolesManagerProps) {
  const { showSuccess, showError, showWarning } = useToast();
  const [adminAccounts, setAdminAccounts] = useState<AdminAccountConfig[]>(getRegisteredAdminAccounts());
  const [isAdding, setIsAdding] = useState(false);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);

  // Form states for creating new admin staff
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("operations");
  const [newPassword, setNewPassword] = useState("SafariAdmin123#");
  const [newDepartment, setNewDepartment] = useState("Park Operations");

  const isSuperAdmin = currentRole === "super_admin";

  const handleCreateAdminAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      showError("Permission Denied", "Only Super Admin users can register new admin staff accounts.");
      return;
    }

    if (!newEmail.trim() || !newName.trim() || !newPassword.trim()) {
      showWarning("Validation Error", "Please complete all required fields.");
      return;
    }

    const res = saveAdminAccount({
      email: newEmail.trim().toLowerCase(),
      name: newName.trim(),
      role: newRole,
      password: newPassword.trim(),
      department: newDepartment.trim() || "Wildking Administration",
    });

    if (res.success) {
      showSuccess("Admin Account Created!", `"${newName}" registered as ${ROLE_LABELS[newRole]}.`);
      setAdminAccounts(getRegisteredAdminAccounts());
      setIsAdding(false);
      setNewEmail("");
      setNewName("");
    } else {
      showError("Creation Failed", res.error || "Could not save admin account.");
    }
  };

  const handleUpdateAccountRole = (account: AdminAccountConfig, targetRole: AdminRole) => {
    if (!isSuperAdmin) {
      showError("Permission Denied", "Only Super Admin users can modify admin staff roles.");
      return;
    }

    const updated = { ...account, role: targetRole };
    const res = saveAdminAccount(updated);

    if (res.success) {
      showSuccess("Role Updated", `"${account.name}" assigned role: ${ROLE_LABELS[targetRole]}`);
      setAdminAccounts(getRegisteredAdminAccounts());
      setEditingEmail(null);
    } else {
      showError("Update Error", "Could not update role.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Role Level Card */}
      <div className="bg-slate-900/90 border border-amber-500/40 p-6 rounded-3xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
            </div>
            <h2 className="text-2xl font-black text-white font-serif uppercase tracking-tight">
              Admin Roles & Security Management
            </h2>
            <p className="text-xs text-slate-300 font-light leading-relaxed max-w-2xl">
              Manage system permissions, restrict access to financial & package controls, and provision staff admin credentials across departments.
            </p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 cursor-pointer shrink-0 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Staff Admin Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Accounts List */}
      <div className="bg-slate-900/90 border border-emerald-800/40 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-emerald-800/40 bg-emerald-950/60 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Active Admin Staff Accounts ({adminAccounts.length})</span>
          </h3>
          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            Current Session: {ROLE_LABELS[currentRole]}
          </span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {adminAccounts.map((acc) => {
            const isEditingThis = editingEmail === acc.email;
            return (
              <div key={acc.email} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 font-black text-base flex items-center justify-center shadow-md shrink-0">
                    {acc.name ? acc.name.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{acc.name}</h4>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {acc.department || "Administration"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5">{acc.email}</p>
                  </div>
                </div>

                {/* Role Selector / Display */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {isEditingThis && isSuperAdmin ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={acc.role}
                        onChange={(e) => handleUpdateAccountRole(acc, e.target.value as AdminRole)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-400 text-amber-300 text-xs font-bold focus:outline-none"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="operations">Operations Manager</option>
                        <option value="support">Customer Support</option>
                        <option value="content_manager">Content Manager</option>
                      </select>
                      <button
                        onClick={() => setEditingEmail(null)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                        acc.role === "super_admin"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : acc.role === "operations"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : acc.role === "support"
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      }`}>
                        {ROLE_LABELS[acc.role]}
                      </span>

                      {isSuperAdmin && (
                        <button
                          onClick={() => setEditingEmail(acc.email)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Change Role
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Access Matrix Reference Table */}
      <div className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Role Access Control Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-950/60 text-emerald-300 font-bold uppercase tracking-wider border-b border-emerald-800/40">
                <th className="py-2.5 px-3">Role Tier</th>
                <th className="py-2.5 px-3">Allowed Sections</th>
                <th className="py-2.5 px-3">Restricted Sections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                <tr key={r}>
                  <td className="py-2.5 px-3 font-bold text-white">{ROLE_LABELS[r]}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-400 font-medium">
                      {ROLE_PERMISSIONS[r].join(", ")}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-rose-400 font-medium">
                    {r === "super_admin"
                      ? "None (Full Access)"
                      : ["overview", "bookings", "inquiries", "packages", "parks", "fleet", "reviews", "customers", "roles"]
                          .filter((t) => !ROLE_PERMISSIONS[r].includes(t))
                          .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Admin Staff Account Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0b1320] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-black uppercase text-sm font-serif">
                <UserCheck className="w-5 h-5 text-amber-400" />
                <span>Add New Admin Staff Account</span>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider">Full Staff Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider">Email Address (Username)</label>
                <input
                  type="email"
                  required
                  placeholder="staff@wildking-safari.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider">Department / Unit</label>
                <input
                  type="text"
                  placeholder="e.g. Yala Logistics Desk"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider">Assigned Role Tier</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="operations">Operations Manager (Bookings & Fleet)</option>
                  <option value="support">Customer Support (Bookings, Reviews & Customers)</option>
                  <option value="content_manager">Content Manager (Packages, Parks & Reviews)</option>
                  <option value="super_admin">Super Admin (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase tracking-wider">Initial Security Password</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="btn-golden-glow w-full py-3 rounded-xl font-black uppercase text-xs tracking-wider text-slate-950 shadow-xl mt-2"
              >
                Create Staff Admin Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
