'use client';

import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock, Search, Sparkles } from 'lucide-react';

interface SearchWidgetProps {
  onSearch: (filter: { park: string; date: string; timeSlot: string; guests: number }) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  const [selectedPark, setSelectedPark] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('all');
  const [guestCount, setGuestCount] = useState(2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      park: selectedPark,
      date: selectedDate,
      timeSlot: selectedShift,
      guests: guestCount,
    });
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full bg-[#4a4b2f] backdrop-blur-xl border border-[#4a4b2f]/40 rounded-2xl md:rounded-full shadow-2xl p-3 md:p-3.5 flex flex-col md:flex-row items-center gap-3 transition-all hover:border-amber-400/50 text-[#f5f4ed]"
    >
      {/* Destination Park Select */}
      <div className="w-full md:w-1/4 px-4 py-2 border-b md:border-b-0 md:border-r border-[#f5f4ed]/20 flex items-center gap-3">
        <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            National Park
          </label>
          <select
            value={selectedPark}
            onChange={(e) => setSelectedPark(e.target.value)}
            className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer [&>option]:bg-[#4a4b2f] [&>option]:text-white"
          >
            <option value="all">All Safari Parks</option>
            <option value="yala">Yala National Park</option>
            <option value="udawalawe">Udawalawe Sanctuary</option>
            <option value="wilpattu">Wilpattu Lakes</option>
            <option value="minneriya">Minneriya Gathering</option>
          </select>
        </div>
      </div>

      {/* Date Select */}
      <div className="w-full md:w-1/4 px-4 py-2 border-b md:border-b-0 md:border-r border-[#f5f4ed]/20 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Expedition Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Time Shift Slot */}
      <div className="w-full md:w-1/4 px-4 py-2 border-b md:border-b-0 md:border-r border-[#f5f4ed]/20 flex items-center gap-3">
        <Clock className="w-5 h-5 text-amber-400 shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Safari Shift
          </label>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer [&>option]:bg-[#4a4b2f] [&>option]:text-white"
          >
            <option value="all">Any Shift</option>
            <option value="dawn">Dawn Patrol (5:30 AM)</option>
            <option value="dusk">Dusk Safari (2:30 PM)</option>
            <option value="fullday">Full-Day VIP Expedition</option>
          </select>
        </div>
      </div>

      {/* Guests Counter */}
      <div className="w-full md:w-1/5 px-4 py-2 flex items-center gap-3">
        <Users className="w-5 h-5 text-amber-400 shrink-0" />
        <div className="flex flex-col w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Guests
          </label>
          <select
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer [&>option]:bg-[#4a4b2f] [&>option]:text-white"
          >
            <option value={1}>1 Guest (Solo)</option>
            <option value={2}>2 Guests (Couple)</option>
            <option value={4}>4 Guests (Family)</option>
            <option value={6}>6 Guests (Full Private Jeep)</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto shrink-0 px-6 py-4 md:py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#4a4b2f] font-bold text-sm uppercase tracking-wider rounded-xl md:rounded-full flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
      >
        <Search className="w-4 h-4 stroke-[3]" />
        <span>Search Safaris</span>
      </button>
    </form>
  );
};
