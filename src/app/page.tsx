"use client";

import SkipLink from "@/components/layout/SkipLink";
import Nav from "@/components/layout/Nav";
import HeroSection from "@/components/sections/HeroSection";
import OfficesSection from "@/components/sections/OfficesSection";
import JourneySection from "@/components/sections/JourneySection";
import RideSection from "@/components/sections/RideSection";
import DocsSection from "@/components/sections/DocsSection";
import HolidaysSection from "@/components/sections/HolidaysSection";
import EventsSection from "@/components/sections/EventsSection";
import CorporateSection from "@/components/sections/CorporateSection";
import StrengthSection from "@/components/sections/StrengthSection";
import EnquireSection from "@/components/sections/EnquireSection";
import Footer from "@/components/layout/Footer";
import GuideAside from "@/components/ui/GuideAside";
import { useSiteAnimations } from "@/hooks/useSiteAnimations";

export default function Home() {
  useSiteAnimations();

  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <HeroSection />
        <OfficesSection />
        <JourneySection />
        <RideSection />
        <DocsSection />
        <HolidaysSection />
        <EventsSection />
        <CorporateSection />
        <StrengthSection />
        <EnquireSection />
      </main>
      <Footer />
      <GuideAside />
    </>
  );
}
