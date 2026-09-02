"use client";

import React, { useState } from "react";
import { InquiryDoc } from "@/lib/types/firestore";
import { MessageSquare } from "lucide-react";

interface InquiriesManagerProps {
  inquiries: InquiryDoc[];
  onUpdateStatus: (inquiryId: string, status: InquiryDoc["status"]) => Promise<void>;
}

export default function InquiriesManager({ inquiries, onUpdateStatus }: InquiriesManagerProps) {
  const [filter, setFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter((inq) => filter === "all" || inq.status === filter);

  const handleStatusChange = async (inquiryId: string, status: InquiryDoc["status"]) => {
    setUpdatingId(inquiryId);
    try {
      await onUpdateStatus(inquiryId, status);
    } catch (err) {
      alert("Failed to update inquiry status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/40">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" /> Guest Inquiries & Custom Safari Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">Review contact form submissions and customize wildlife itineraries.</p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-teal-300 focus:outline-none focus:border-amber-400 font-semibold"
        >
          <option value="all">All Inquiries ({inquiries.length})</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Inquiries Grid */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 italic text-sm">
          No inquiries found matching selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInquiries.map((inq, idx) => (
            <div
              key={inq.id || idx}
              className="bg-slate-900/90 border border-emerald-800/40 p-5 rounded-2xl shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{inq.name}</h3>
                    <p className="text-xs text-emerald-300 font-semibold">{inq.email}</p>
                    {inq.phone && <p className="text-[11px] text-slate-400">{inq.phone}</p>}
                  </div>

                  {inq.id && (
                    <select
                      disabled={updatingId === inq.id}
                      value={inq.status || "new"}
                      onChange={(e) => handleStatusChange(inq.id!, e.target.value as InquiryDoc["status"])}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full uppercase focus:outline-none border ${
                        inq.status === "new"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : inq.status === "in_progress"
                          ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      <option value="new" className="bg-slate-900 text-amber-300">NEW</option>
                      <option value="in_progress" className="bg-slate-900 text-teal-300">IN PROGRESS</option>
                      <option value="closed" className="bg-slate-900 text-slate-400">CLOSED</option>
                    </select>
                  )}
                </div>

                {inq.preferredPark && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Preferred Park: {inq.preferredPark}
                    </span>
                  </div>
                )}

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                  <p className="italic">"{inq.message}"</p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800/60">
                <span>Submitted to Wildking Desk</span>
                <a
                  href={`mailto:${inq.email}?subject=RE: Wildking Jeep Safari Inquiry`}
                  className="px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 rounded font-semibold transition-colors"
                >
                  Reply via Email →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
