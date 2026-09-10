export type AdminRole = 'super_admin' | 'operations' | 'support' | 'content_manager';

export interface AdminAccountConfig {
  email: string;
  name: string;
  role: AdminRole;
  password: string;
  department?: string;
  createdAt?: string;
}

export interface AdminUserSession {
  email: string;
  name: string;
  role: AdminRole;
  department?: string;
  loginTime: string;
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin (Executive)",
  operations: "Operations Manager",
  support: "Customer Support & Concierge",
  content_manager: "Content & Logistics Manager",
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: "Full access to all operations, bookings, customer accounts, safari packages, fleet, and admin staff roles.",
  operations: "Access to bookings, fleet, park sanctuaries, customer inquiries, and daily expedition logistics.",
  support: "Access to guest bookings, inquiries, customer account profiles, and verified guest reviews.",
  content_manager: "Access to safari tour packages, park sanctuaries, jeep fleet specs, and customer reviews.",
};

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ["overview", "bookings", "inquiries", "packages", "parks", "fleet", "reviews", "customers", "roles"],
  operations: ["overview", "bookings", "inquiries", "parks", "fleet"],
  support: ["overview", "bookings", "inquiries", "reviews", "customers"],
  content_manager: ["overview", "packages", "parks", "fleet", "reviews"],
};

// Default Pre-Configured Demo Staff Accounts across all roles
export const DEFAULT_ADMIN_CREDENTIALS: AdminAccountConfig = {
  email: "mmethsani@gmail.com",
  password: "Methsani123#",
  name: "Methsani Admin",
  role: "super_admin",
  department: "Executive Board",
};

export const PRESET_STAFF_ACCOUNTS: AdminAccountConfig[] = [
  DEFAULT_ADMIN_CREDENTIALS,
  {
    email: "ops.manager@wildking-safari.com",
    password: "OpsPass123#",
    name: "Kavinda Perera",
    role: "operations",
    department: "4x4 Fleet & Permit Operations",
  },
  {
    email: "concierge.support@wildking-safari.com",
    password: "SupportPass123#",
    name: "Nipuni De Silva",
    role: "support",
    department: "VIP Naturalist Concierge",
  },
  {
    email: "content.lead@wildking-safari.com",
    password: "ContentPass123#",
    name: "Tariq Mahmood",
    role: "content_manager",
    department: "Wilderness Media & Itineraries",
  },
];

const AUTH_STORAGE_KEY = "wildking_admin_session";
const CUSTOM_ADMINS_STORAGE_KEY = "wildking_custom_admin_accounts";

export function getRegisteredAdminAccounts(): AdminAccountConfig[] {
  if (typeof window === "undefined") return PRESET_STAFF_ACCOUNTS;
  try {
    const customData = localStorage.getItem(CUSTOM_ADMINS_STORAGE_KEY);
    const customAccounts: AdminAccountConfig[] = customData ? JSON.parse(customData) : [];
    
    // Merge preset and custom accounts, avoiding duplicate email keys
    const map = new Map<string, AdminAccountConfig>();
    PRESET_STAFF_ACCOUNTS.forEach((a) => map.set(a.email.toLowerCase(), a));
    customAccounts.forEach((a) => map.set(a.email.toLowerCase(), a));
    
    return Array.from(map.values());
  } catch (err) {
    console.error("Error reading admin accounts:", err);
    return PRESET_STAFF_ACCOUNTS;
  }
}

export function saveAdminAccount(account: AdminAccountConfig): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "SSR environment" };
  try {
    const currentAccounts = getRegisteredAdminAccounts();
    const cleanEmail = account.email.trim().toLowerCase();
    
    const existingIdx = currentAccounts.findIndex((a) => a.email.toLowerCase() === cleanEmail);
    let updatedAccounts: AdminAccountConfig[];
    
    if (existingIdx >= 0) {
      updatedAccounts = [...currentAccounts];
      updatedAccounts[existingIdx] = { ...account, email: cleanEmail };
    } else {
      updatedAccounts = [{ ...account, email: cleanEmail, createdAt: new Date().toISOString() }, ...currentAccounts];
    }

    localStorage.setItem(CUSTOM_ADMINS_STORAGE_KEY, JSON.stringify(updatedAccounts));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save admin account" };
  }
}

export function loginAdmin(emailInput: string, passwordInput: string): { success: boolean; error?: string; user?: AdminUserSession } {
  const trimmedEmail = emailInput.trim().toLowerCase();
  const accounts = getRegisteredAdminAccounts();
  
  const foundAccount = accounts.find(
    (acc) => acc.email.toLowerCase() === trimmedEmail && acc.password === passwordInput
  );

  if (foundAccount) {
    const user: AdminUserSession = {
      email: foundAccount.email,
      name: foundAccount.name,
      role: foundAccount.role,
      department: foundAccount.department || "Executive Operations",
      loginTime: new Date().toISOString(),
    };
    
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    
    return { success: true, user };
  }

  return { success: false, error: "Invalid username/email or security password." };
}

export function getAdminSession(): AdminUserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as AdminUserSession;
  } catch (err) {
    console.error("Error reading admin session:", err);
    return null;
  }
}

export function logoutAdmin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function hasPermission(role: AdminRole | undefined, tab: string): boolean {
  if (!role) return false;
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(tab);
}
