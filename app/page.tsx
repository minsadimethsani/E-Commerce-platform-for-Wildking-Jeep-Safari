'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeaturedPackages } from '../components/FeaturedPackages';
import { FleetShowcase } from '../components/FleetShowcase';
import { WhyUs } from '../components/WhyUs';
import { Destinations } from '../components/Destinations';
import { Testimonials } from '../components/Testimonials';
import { BookingModal } from '../components/BookingModal';
import { AccountModal, UserProfile } from '../components/AccountModal';
import { Footer } from '../components/Footer';
import { SafariPackage, SAFARI_PACKAGES } from '../data/packages';

export default function Home() {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'LKR'>('USD');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<SafariPackage | null>(null);
  const [activeParkFilter, setActiveParkFilter] = useState('all');

  const handleOpenBookingWithPackage = (pkg: SafariPackage) => {
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    // Default to Signature Sunset Safari package
    const sunsetPkg = SAFARI_PACKAGES.find(p => p.id === 'sunset-safari-signature') || SAFARI_PACKAGES[0];
    setSelectedPackage(sunsetPkg);
    setIsBookingOpen(true);
  };

  const handleHeroBookingWithDetails = (details: {
    packageName: string;
    startDate: string;
    duration: string;
    guests: number;
    totalPrice: number;
  }) => {
    const sunsetPkg = SAFARI_PACKAGES.find(p => p.id === 'sunset-safari-signature') || SAFARI_PACKAGES[0];
    setSelectedPackage(sunsetPkg);
    setIsBookingOpen(true);
  };

  const handleSearchFilter = (filter: { park: string; date: string; timeSlot: string; guests: number }) => {
    if (filter.park !== 'all') {
      setActiveParkFilter(filter.park);
    }
    const elem = document.getElementById('safaris');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectParkFromDestinations = (parkId: string) => {
    window.location.href = `/parks/${parkId}`;
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#050b14] text-white">
      {/* Navigation Header */}
      <Navbar
        currency={currency}
        onCurrencyChange={(curr) => setCurrency(curr)}
        onOpenBooking={handleOpenGeneralBooking}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Hero Banner with Two-Column Layout & Translucent Dark Frosted-Glass Card */}
      <Hero
        onSearch={handleSearchFilter}
        onOpenBookingWithDetails={handleHeroBookingWithDetails}
        onOpenBooking={handleOpenGeneralBooking}
      />

      {/* Featured Safari Packages Grid */}
      <FeaturedPackages
        currency={currency}
        onSelectPackage={handleOpenBookingWithPackage}
        activeFilterPark={activeParkFilter}
      />

      {/* 4x4 Custom Fleet Showcase */}
      <FleetShowcase />

      {/* Why Choose Wildking */}
      <WhyUs />

      {/* National Parks Destinations Explorer */}
      <Destinations onSelectPark={handleSelectParkFromDestinations} />

      {/* Verified Guest Reviews & Sightings */}
      <Testimonials />

      {/* Footer */}
      <Footer />

      {/* Quick Booking Modal Dialog */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedPackage={selectedPackage}
        currency={currency}
      />

      {/* User Account Authentication & Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
        }}
        onLogout={() => {
          setUser(null);
        }}
        onOpenBooking={() => {
          handleOpenGeneralBooking();
        }}
      />
    </main>
  );
}

