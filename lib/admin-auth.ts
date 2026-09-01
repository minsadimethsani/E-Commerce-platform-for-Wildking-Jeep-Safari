// Default Admin Credentials as requested by the user
export const DEFAULT_ADMIN_CREDENTIALS = {
  email: "mmethsani@gmail.com",
  password: "Methsani123#",
  name: "Methsani Admin",
  role: "super_admin",
};

const AUTH_STORAGE_KEY = "wildking_admin_session";

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

export function loginAdmin(emailInput: string, passwordInput: string): { success: boolean; error?: string; user?: AdminUser } {
  const trimmedEmail = emailInput.trim().toLowerCase();
  
  if (trimmedEmail === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase() && passwordInput === DEFAULT_ADMIN_CREDENTIALS.password) {
    const user: AdminUser = {
      email: DEFAULT_ADMIN_CREDENTIALS.email,
      name: DEFAULT_ADMIN_CREDENTIALS.name,
      role: DEFAULT_ADMIN_CREDENTIALS.role,
      loginTime: new Date().toISOString(),
    };
    
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    
    return { success: true, user };
  }

  return { success: false, error: "Invalid username/email or password." };
}

export function getAdminSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as AdminUser;
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
