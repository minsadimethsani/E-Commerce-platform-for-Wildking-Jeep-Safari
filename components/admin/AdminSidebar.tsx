"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAdmin, getAdminSession, hasPermission, ROLE_LABELS } from "@/lib/admin-auth";
import {
  BarChart3,
  Calendar,
  MessageSquare,
  Compass,
  Trees,
  Truck,
  Star,
  Users,
  ShieldCheck,
  Globe,
  LogOut,
} from "lucide-react";

export type AdminTab = "overview" | "bookings" | "inquiries" | "packages" | "parks" | "fleet" | "reviews" | "customers" | "roles";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingBookingsCount?: number;
  newInquiriesCount?: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingBookingsCount = 0,
  newInquiriesCount = 0,
}: AdminSidebarProps) {
  const router = useRouter();
  const session = getAdminSession();
  const userRole = session?.role || "super_admin";

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  const allNavItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview", label: "Overview Stats", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "bookings", label: "Safari Bookings", icon: <Calendar className="w-4 h-4" />, badge: pendingBookingsCount },
    { id: "inquiries", label: "Customer Inquiries", icon: <MessageSquare className="w-4 h-4" />, badge: newInquiriesCount },
    { id: "customers", label: "Customer Accounts", icon: <Users className="w-4 h-4" /> },
    { id: "packages", label: "Safari Packages", icon: <Compass className="w-4 h-4" /> },
    { id: "parks", label: "Safari Parks", icon: <Trees className="w-4 h-4" /> },
    { id: "fleet", label: "Jeep Fleet", icon: <Truck className="w-4 h-4" /> },
    { id: "reviews", label: "Customer Reviews", icon: <Star className="w-4 h-4" /> },
    { id: "roles", label: "Roles & Access", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  // Filter navigation tabs based on logged-in user's role permissions
  const navItems = allNavItems.filter((item) => hasPermission(userRole, item.id));

  return (
    <aside className="w-full md:w-64 md:min-w-[16rem] md:max-w-[16rem] shrink-0 bg-emerald-950/90 text-white border-r border-emerald-800/40 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] md:min-h-screen font-sans">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-emerald-800/50">
          <div className="bg-amber-500 text-slate-950 font-bold p-2.5 rounded-xl text-xl leading-none shrink-0">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0 truncate">
            <h2 className="font-extrabold tracking-wide text-amber-400 text-lg uppercase truncate">Wildking</h2>
            <p className="text-xs text-emerald-300/80 font-medium truncate">Admin Control Panel</p>
          </div>
        </div>

        {/* Role Badge Indicator */}
        <div className="mb-4 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{ROLE_LABELS[userRole] || "Super Admin"}</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full h-11 flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold"
                    : "text-emerald-100/90 hover:bg-emerald-900/60 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 truncate">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-bold shrink-0 ml-2 ${
                      isActive ? "bg-slate-950 text-amber-400" : "bg-amber-500 text-slate-950"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Live Site Link */}
      <div className="pt-6 border-t border-emerald-800/40 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/80 text-emerald-200 text-xs font-semibold border border-emerald-700/50 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>View Live Website</span>
        </Link>

        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
              {session?.name ? session.name[0] : "A"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-emerald-100 truncate">{session?.name || "Admin"}</p>
              <p className="text-[10px] text-emerald-400/80 truncate">{session?.email || "mmethsani@gmail.com"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
