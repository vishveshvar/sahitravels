"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { FLEET } from "@/data/fleet";

interface VehicleBookingContextType {
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  isFromShowcase: boolean;
  setIsFromShowcase: (val: boolean) => void;
  bookVehicleFromShowcase: (vehicleId: string) => void;
  wizardResetTrigger: number;
}

const VehicleBookingContext = createContext<VehicleBookingContextType | undefined>(undefined);

export function VehicleBookingProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(FLEET[0]?.id || "swift");
  const [isFromShowcase, setIsFromShowcase] = useState<boolean>(false);
  const [wizardResetTrigger, setWizardResetTrigger] = useState<number>(0);

  const bookVehicleFromShowcase = useCallback((vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setIsFromShowcase(true);
    setWizardResetTrigger((prev) => prev + 1);

    // Smooth-scroll to the enquiry section
    const enquireEl = document.getElementById("enquire");
    if (enquireEl) {
      enquireEl.scrollIntoView({ behavior: "smooth" });
    }

    // Move focus to the wizard's heading
    const focusHeading = () => {
      const wizardHeading = document.getElementById("wizard-heading");
      if (wizardHeading) {
        wizardHeading.focus();
      }
    };

    // Immediate attempt + delayed attempt after scroll
    requestAnimationFrame(focusHeading);
    setTimeout(focusHeading, 200);
    setTimeout(focusHeading, 600);
  }, []);

  return (
    <VehicleBookingContext.Provider
      value={{
        selectedVehicleId,
        setSelectedVehicleId,
        isFromShowcase,
        setIsFromShowcase,
        bookVehicleFromShowcase,
        wizardResetTrigger,
      }}
    >
      {children}
    </VehicleBookingContext.Provider>
  );
}

export function useVehicleBooking() {
  const ctx = useContext(VehicleBookingContext);
  if (!ctx) {
    throw new Error("useVehicleBooking must be used within a VehicleBookingProvider");
  }
  return ctx;
}
