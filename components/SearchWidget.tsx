'use client';

import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock, Search, Sparkles } from 'lucide-react';
import { getTomorrowDateString } from '../lib/validation';

import { useToast } from '../context/ToastContext';

interface SearchWidgetProps {
  onSearch: (filter: { park: string; date: string; timeSlot: string; guests: number }) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  const { showInfo } = useToast();
  const [selectedPark, setSelectedPark] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState('all');
  const [guestCount, setGuestCount] = useState(2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parkLabel = selectedPark === 'all' ? 'All Parks' : selectedPark.toUpperCase();
    showInfo('Searching Safari Permits', `Filtering 4x4 safaris for ${parkLabel} (${guestCount} Guests)`);
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
            min={getTomorrowDateString()}
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
          <div className="flex flex-col gap-1 w-full">
            <select
              value={guestCount <= 6 ? guestCount : 'custom'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'custom') {
                  if (guestCount <= 6) setGuestCount(7);
                } else {
                  setGuestCount(Number(val));
                }
              }}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer [&>option]:bg-[#4a4b2f] [&>option]:text-white"
            >
              <option value={1}>1 Guest (Solo)</option>
              <option value={2}>2 Guests (Couple)</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests (Family)</option>
              <option value={5}>5 Guests</option>
              <option value={6}>6 Guests (1 Full Jeep)</option>
              <option value="custom">More than 6 guests...</option>
            </select>
            <input
              type="number"
              min={1}
              max={99}
              value={guestCount || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setGuestCount(isNaN(val) || val < 1 ? 1 : val);
              }}
              className="w-full bg-black/20 border border-white/20 rounded px-2 py-0.5 text-[11px] font-bold text-amber-300 focus:outline-none focus:border-amber-400"
              placeholder="Or type guest count"
            />
          </div>
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
