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
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
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
        onSelectPackage={handleOpenBookingWithPackage}
        activeFilterPark={activeParkFilter}
      />

      {/* 4x4 Custom Fleet Showcase */}
      <FleetShowcase onOpenBooking={handleOpenGeneralBooking} />

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
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* User Account Authentication & Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenBooking={() => {
          handleOpenGeneralBooking();
        }}
      />
    </main>
  );
}

