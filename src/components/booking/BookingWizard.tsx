"use client";

import React, { useState, useEffect, useRef, useId, useMemo } from "react";
import Image from "next/image";
import { FLEET } from "@/data/fleet";
import { CONTACT_DETAILS } from "@/data/contact";
import { useVehicleBooking } from "@/context/VehicleBookingContext";
import { playStamp } from "@/hooks/useSiteAnimations";

export interface PlaceSelection {
  id?: string;
  name: string;
  region?: string;
  country?: string;
  countryCode: string;
  lat?: number;
  lng?: number;
  isFreeText?: boolean;
}

export type EstimateResult =
  | {
      type: "calculated";
      total: number;
      billableKm: number;
      distanceCharge: number;
      driverBatta: number;
      nightAllowance: number;
      days: number;
      nights: number;
      distanceText?: string;
      indicative?: boolean;
    }
  | {
      type: "team-to-confirm" | "local" | "error";
      message?: string;
      indicative?: boolean;
    };

export const TIME_SLOTS = [
  "4–6 AM",
  "6–9 AM",
  "9 AM–12 PM",
  "12–3 PM",
  "3–6 PM",
  "6–9 PM",
  "9 PM–12 AM",
  "12–4 AM",
] as const;

export const NIGHT_SLOTS = ["6–9 PM", "9 PM–12 AM", "12–4 AM"];

export function isNightSlot(slot: string): boolean {
  if (!slot) return false;
  const norm = slot.replace("–", "-").trim();
  return NIGHT_SLOTS.some((ns) => ns.replace("–", "-") === norm);
}

const COUNTRY_DIAL_CODES = [
  { code: "+91", country: "India (IN)" },
  { code: "+971", country: "UAE (AE)" },
  { code: "+66", country: "Thailand (TH)" },
  { code: "+673", country: "Brunei (BN)" },
  { code: "+65", country: "Singapore (SG)" },
  { code: "+60", country: "Malaysia (MY)" },
  { code: "+44", country: "UK (GB)" },
  { code: "+1", country: "USA / Canada (US/CA)" },
  { code: "+966", country: "Saudi Arabia (SA)" },
  { code: "+974", country: "Qatar (QA)" },
  { code: "+968", country: "Oman (OM)" },
  { code: "+973", country: "Bahrain (BH)" },
  { code: "+965", country: "Kuwait (KW)" },
  { code: "+61", country: "Australia (AU)" },
  { code: "+49", country: "Germany (DE)" },
  { code: "+33", country: "France (FR)" },
];

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-").map(Number);
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${day} ${months[date.getMonth()]} ${year}`;
  } catch {
    return dateStr;
  }
}

export default function BookingWizard() {
  const compId = useId();
  const {
    selectedVehicleId,
    setSelectedVehicleId,
    isFromShowcase,
    setIsFromShowcase,
    wizardResetTrigger,
  } = useVehicleBooking();

  // Screen index: 0 = Journey, 1 = Schedule, 2 = Vehicle, 3 = Contact, 4 = Notes & Review
  const [screenIndex, setScreenIndex] = useState<number>(0);
  const [confirmedScreens, setConfirmedScreens] = useState<Set<number>>(new Set());
  const [isStamping, setIsStamping] = useState<boolean>(false);

  // Field values
  const [tripType, setTripType] = useState<"One way" | "Round trip">("One way");
  const [fromPlace, setFromPlace] = useState<PlaceSelection | null>(null);
  const [fromQuery, setFromQuery] = useState<string>("");
  const [toPlace, setToPlace] = useState<PlaceSelection | null>(null);
  const [toQuery, setToQuery] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");

  const [travelDate, setTravelDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("9 AM–12 PM");
  const [passengers, setPassengers] = useState<number>(1);

  const [name, setName] = useState<string>("");
  const [countryDialCode, setCountryDialCode] = useState<string>("+91");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [notes, setNotes] = useState<string>("");

  // Validation errors map for the current screen
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Server estimate state
  const [estimateData, setEstimateData] = useState<EstimateResult | null>(null);
  const [isEstimating, setIsEstimating] = useState<boolean>(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Today ISO string (set in microtask on client mount)
  const [todayStr, setTodayStr] = useState<string>("");
  useEffect(() => {
    queueMicrotask(() => {
      setTodayStr(new Date().toISOString().split("T")[0]);
    });
  }, []);

  // DOM Refs
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stampElRef = useRef<HTMLDivElement>(null);
  const successStampRef = useRef<HTMLDivElement>(null);

  // Field Input Refs for focusing the first invalid field
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const returnDateInputRef = useRef<HTMLInputElement>(null);
  const travelDateInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLTextAreaElement>(null);

  // Reset to screen 1 when booked from showcase
  const [prevResetTrigger, setPrevResetTrigger] = useState(wizardResetTrigger);
  if (wizardResetTrigger !== prevResetTrigger) {
    setPrevResetTrigger(wizardResetTrigger);
    setScreenIndex(0);
    setIsSuccess(false);
    setSubmitError(null);
    setErrors({});
  }

  // Move focus to heading when screenIndex changes
  useEffect(() => {
    headingRef.current?.focus();
  }, [screenIndex]);

  // Selected Vehicle Object
  const currentVehicle = useMemo(() => {
    return FLEET.find((v) => v.id === selectedVehicleId) || FLEET[0];
  }, [selectedVehicleId]);

  // Fetch estimate from server when reaching Screen 5 (Notes & Review)
  useEffect(() => {
    if (screenIndex !== 4) return;

    let isMounted = true;
    queueMicrotask(() => {
      if (isMounted) setIsEstimating(true);
    });

    const payload = {
      tripType,
      from: fromPlace || (fromQuery.trim() ? { name: fromQuery.trim(), countryCode: "IN" } : null),
      to: toPlace || (toQuery.trim() ? { name: toQuery.trim(), countryCode: "IN" } : null),
      travelDate,
      returnDate: tripType === "Round trip" ? returnDate : undefined,
      timeSlot,
      vehicleId: currentVehicle.id,
      vehicleCategory: currentVehicle.name,
    };

    fetch("/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data: EstimateResult) => {
        if (isMounted) {
          setEstimateData(data);
          setIsEstimating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEstimateData({
            type: "team-to-confirm",
            message: "Our team will calculate the exact fare for this route and contact you.",
          });
          setIsEstimating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [screenIndex, tripType, fromPlace, fromQuery, toPlace, toQuery, travelDate, returnDate, timeSlot, currentVehicle]);

  // Validate the active screen
  const validateCurrentScreen = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (screenIndex === 0) {
      // Screen 1: Journey
      if (!fromPlace && !fromQuery.trim()) {
        newErrors.from = "Please enter your departure location.";
      }
      if (!toPlace && !toQuery.trim()) {
        newErrors.to = "Please enter your destination.";
      }
      if (tripType === "Round trip") {
        if (!returnDate) {
          newErrors.returnDate = "Please choose a return date.";
        } else if (todayStr && returnDate < todayStr) {
          newErrors.returnDate = "Return date must be today or later.";
        } else if (travelDate && returnDate < travelDate) {
          newErrors.returnDate = "Return date must be on or after travel date.";
        }
      }

      setErrors(newErrors);
      if (newErrors.from) {
        fromInputRef.current?.focus();
        return false;
      }
      if (newErrors.to) {
        toInputRef.current?.focus();
        return false;
      }
      if (newErrors.returnDate) {
        returnDateInputRef.current?.focus();
        return false;
      }

      if (!fromPlace && fromQuery.trim()) {
        setFromPlace({ name: fromQuery.trim(), countryCode: "IN", isFreeText: true });
      }
      if (!toPlace && toQuery.trim()) {
        setToPlace({ name: toQuery.trim(), countryCode: "IN", isFreeText: true });
      }
      return true;
    }

    if (screenIndex === 1) {
      // Screen 2: Schedule
      if (!travelDate) {
        newErrors.travelDate = "Please choose a travel date.";
      } else if (todayStr && travelDate < todayStr) {
        newErrors.travelDate = "Travel date must be today or later.";
      }
      if (tripType === "Round trip" && returnDate && travelDate && returnDate < travelDate) {
        newErrors.travelDate = "Travel date must be on or before return date.";
      }
      if (!timeSlot) {
        newErrors.timeSlot = "Please select a pickup time slot.";
      }
      if (isNaN(passengers) || passengers < 1 || passengers > 60) {
        newErrors.passengers = "Passengers must be between 1 and 60.";
      }

      setErrors(newErrors);
      if (newErrors.travelDate) {
        travelDateInputRef.current?.focus();
        return false;
      }
      return Object.keys(newErrors).length === 0;
    }

    if (screenIndex === 2) {
      // Screen 3: Vehicle
      if (!currentVehicle) {
        newErrors.vehicle = "Please select a vehicle.";
        setErrors(newErrors);
        return false;
      }
      setErrors({});
      return true;
    }

    if (screenIndex === 3) {
      // Screen 4: Contact
      const trimmedName = name.trim();
      if (!trimmedName) {
        newErrors.name = "Please enter your full name.";
      } else if (trimmedName.length < 2 || trimmedName.length > 60) {
        newErrors.name = "Full name must be between 2 and 60 characters.";
      }

      const cleanNumber = mobileNumber.replace(/\D/g, "");
      if (!cleanNumber) {
        newErrors.mobile = "Please enter your mobile number.";
      } else if (countryDialCode === "+91") {
        if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
          newErrors.mobile = "For +91, please enter a valid 10-digit number starting with 6, 7, 8, or 9.";
        }
      } else {
        if (cleanNumber.length < 6 || cleanNumber.length > 15) {
          newErrors.mobile = "Please enter a valid mobile number between 6 and 15 digits.";
        }
      }

      const trimmedEmail = email.trim();
      if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        newErrors.email = "Please enter a valid email address or leave blank.";
      }

      setErrors(newErrors);
      if (newErrors.name) {
        nameInputRef.current?.focus();
        return false;
      }
      if (newErrors.mobile) {
        mobileInputRef.current?.focus();
        return false;
      }
      if (newErrors.email) {
        emailInputRef.current?.focus();
        return false;
      }
      return true;
    }

    if (screenIndex === 4) {
      // Screen 5: Notes & Review
      if (notes.length > 500) {
        newErrors.notes = "Notes cannot exceed 500 characters.";
        setErrors(newErrors);
        notesInputRef.current?.focus();
        return false;
      }
      setErrors({});
      return true;
    }

    return true;
  };

  // Advance screen with Stamp animation
  const handleNext = () => {
    if (!validateCurrentScreen()) return;

    const currentScreen = screenIndex;
    const isAlreadyConfirmed = confirmedScreens.has(currentScreen);

    const proceed = () => {
      setConfirmedScreens((prev) => new Set(prev).add(currentScreen));
      setErrors({});
      if (screenIndex < 4) {
        setScreenIndex((prev) => prev + 1);
      }
    };

    const stampEl = stampElRef.current;
    if (stampEl && !isAlreadyConfirmed) {
      setIsStamping(true);
      playStamp(stampEl, {
        rotation: -3,
        duration: 0.12,
        onComplete: () => {
          setIsStamping(false);
          proceed();
        },
      });
    } else {
      proceed();
    }
  };

  const handleBack = () => {
    if (screenIndex > 0) {
      setErrors({});
      setScreenIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    setErrors({});
    handleNext();
  };

  const handleJumpToScreen = (targetScreen: number) => {
    setErrors({});
    // Remove the target screen from confirmedScreens so confirming it again replays its stamp
    setConfirmedScreens((prev) => {
      const next = new Set(prev);
      next.delete(targetScreen);
      return next;
    });
    setScreenIndex(targetScreen);
  };

  // Submit Final Enquiry
  const handleSubmit = async () => {
    // Ensure prior screens are valid
    if (!fromPlace && !fromQuery.trim()) {
      handleJumpToScreen(0);
      return;
    }
    if (!toPlace && !toQuery.trim()) {
      handleJumpToScreen(0);
      return;
    }
    if (!travelDate) {
      handleJumpToScreen(1);
      return;
    }
    if (tripType === "Round trip" && !returnDate) {
      handleJumpToScreen(0);
      return;
    }
    if (!name.trim()) {
      handleJumpToScreen(3);
      return;
    }
    if (!mobileNumber.trim()) {
      handleJumpToScreen(3);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const ref = `SAHI-${Date.now().toString(36).substring(2, 8).toUpperCase()}`;

    const fromDisp = fromPlace?.name || fromQuery.trim();
    const fromReg = fromPlace?.region ? `, ${fromPlace.region}` : "";
    const toDisp = toPlace?.name || toQuery.trim();
    const toReg = toPlace?.region ? `, ${toPlace.region}` : "";

    const lines = [
      `*Sahi Travels Journey Request* [${ref}]`,
      `Trip: ${tripType}`,
      `From: ${fromDisp}${fromReg}`,
      `To: ${toDisp}${toReg}`,
      `Travel Date: ${travelDate}${tripType === "Round trip" && returnDate ? ` to ${returnDate}` : ""}`,
      `Time Slot: ${timeSlot}`,
      `Vehicle: ${currentVehicle.name} (${currentVehicle.seats})`,
      `Passengers: ${passengers}`,
      `Name: ${name.trim()}`,
      `Mobile: ${countryDialCode} ${mobileNumber.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : "",
      notes.trim() ? `Notes: ${notes.trim()}` : "",
      estimateData?.type === "calculated"
        ? `Indicative Estimate: ₹${estimateData.total.toLocaleString("en-IN")}`
        : "Estimate: Team to confirm",
    ].filter(Boolean);

    try {
      await new Promise((r) => setTimeout(r, 400));

      const whatsappNumber = CONTACT_DETAILS.whatsapp.number;
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
        "_blank",
        "noopener"
      );

      setReferenceId(ref);
      setIsSuccess(true);

      setTimeout(() => {
        if (successStampRef.current) {
          playStamp(successStampRef.current, { rotation: -4 });
        }
      }, 100);

      if (typeof window !== "undefined") {
        (window as unknown as { __guide?: { react: (a: string, b: string) => void } }).__guide?.react(
          "cheer",
          "Thank you! Our team will contact you soon."
        );
      }
    } catch {
      setSubmitError("We could not send your enquiry. Please try again or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetWizard = () => {
    setScreenIndex(0);
    setConfirmedScreens(new Set());
    setTripType("One way");
    setFromPlace(null);
    setFromQuery("");
    setToPlace(null);
    setToQuery("");
    setReturnDate("");
    setTravelDate("");
    setTimeSlot("9 AM–12 PM");
    setPassengers(1);
    setName("");
    setMobileNumber("");
    setEmail("");
    setNotes("");
    setIsSuccess(false);
    setSubmitError(null);
    setReferenceId("");
    setIsFromShowcase(false);
    setErrors({});
  };

  // Keyboard Enter handler for single-line inputs
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  // ==========================================
  // SUCCESS CARD
  // ==========================================
  if (isSuccess) {
    return (
      <div className="wizard-card booking-card" role="region" aria-label="Booking confirmed">
        <div className="wizard-success">
          <div ref={successStampRef} className="wizard-success-stamp" aria-hidden="true">
            <svg viewBox="0 0 110 44" width="110" height="44">
              <rect x="2" y="2" width="106" height="40" rx="8" fill="none" stroke="#C75A3A" strokeWidth="2.2" />
              <rect x="5" y="5" width="100" height="34" rx="5" fill="none" stroke="#C75A3A" strokeWidth="0.8" strokeDasharray="4 2" />
              <text x="55" y="16" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8" fontWeight="600" letterSpacing="1.2" fill="#C75A3A">SAHI TRAVELS</text>
              <text x="55" y="31" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="700" fontSize="11" letterSpacing="1.4" fill="#C75A3A">RECEIVED · OK</text>
            </svg>
          </div>

          <h3 className="wizard-success__heading">Thank you.</h3>
          <p className="wizard-success__body">Our team will contact you soon.</p>
          {referenceId && (
            <p className="wizard-success__ref mono">
              Reference: {referenceId}
            </p>
          )}

          <button
            type="button"
            className="btn btn--outline wizard-success__reset-btn"
            onClick={handleResetWizard}
          >
            Make another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-card booking-card" role="region" aria-label="Trip booking wizard">
      {/* Top Header: Progress row + Confirmed summary lines */}
      <div className="wizard-header">
        {/* Row 1: Dedicated row for progress label & 5 marks with 16px bottom spacing */}
        <div className="wizard-progress-row">
          <span className="wizard-screen-label mono" aria-live="polite">
            Screen {screenIndex + 1} of 5
          </span>
          <div className="wizard-marks" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((idx) => {
              const isFilled = confirmedScreens.has(idx);
              const isCurrent = idx === screenIndex;
              return (
                <span
                  key={idx}
                  className={`wizard-mark ${isFilled ? "is-filled" : ""} ${isCurrent ? "is-current" : ""}`}
                />
              );
            })}
          </div>
        </div>

        {/* Row 2: Confirmed summary lines (one per confirmed screen above active screen) */}
        {confirmedScreens.size > 0 && (
          <div className="wizard-summary-stack" aria-label="Confirmed details">
            {confirmedScreens.has(0) && screenIndex !== 0 && (
              <div className="wizard-summary-line">
                <span className="wizard-summary-badge mono">Journey</span>
                <span className="wizard-summary-text">
                  {tripType === "Round trip"
                    ? `Round trip · ${fromPlace?.name || fromQuery} → ${toPlace?.name || toQuery}${returnDate ? ` · Return ${formatDateDisplay(returnDate)}` : ""}`
                    : `One way · ${fromPlace?.name || fromQuery} → ${toPlace?.name || toQuery}`}
                </span>
                <button
                  type="button"
                  className="wizard-summary-edit-btn"
                  onClick={() => handleJumpToScreen(0)}
                  title="Edit Journey"
                >
                  Edit
                </button>
              </div>
            )}

            {confirmedScreens.has(1) && screenIndex !== 1 && (
              <div className="wizard-summary-line">
                <span className="wizard-summary-badge mono">Schedule</span>
                <span className="wizard-summary-text">
                  {formatDateDisplay(travelDate)} · {timeSlot} · {passengers} {passengers === 1 ? "passenger" : "passengers"}
                </span>
                <button
                  type="button"
                  className="wizard-summary-edit-btn"
                  onClick={() => handleJumpToScreen(1)}
                  title="Edit Schedule"
                >
                  Edit
                </button>
              </div>
            )}

            {confirmedScreens.has(2) && screenIndex !== 2 && (
              <div className="wizard-summary-line">
                <span className="wizard-summary-badge mono">Vehicle</span>
                <span className="wizard-summary-text">
                  {currentVehicle.name} ({currentVehicle.seats})
                </span>
                <button
                  type="button"
                  className="wizard-summary-edit-btn"
                  onClick={() => handleJumpToScreen(2)}
                  title="Edit Vehicle"
                >
                  Edit
                </button>
              </div>
            )}

            {confirmedScreens.has(3) && screenIndex !== 3 && (
              <div className="wizard-summary-line">
                <span className="wizard-summary-badge mono">Contact</span>
                <span className="wizard-summary-text">
                  {name} · {countryDialCode} {mobileNumber}{email.trim() ? ` · ${email.trim()}` : ""}
                </span>
                <button
                  type="button"
                  className="wizard-summary-edit-btn"
                  onClick={() => handleJumpToScreen(3)}
                  title="Edit Contact"
                >
                  Edit
                </button>
              </div>
            )}

            {confirmedScreens.has(4) && screenIndex !== 4 && (
              <div className="wizard-summary-line">
                <span className="wizard-summary-badge mono">Notes</span>
                <span className="wizard-summary-text">
                  {notes.trim() ? "Notes added" : "No notes"}
                </span>
                <button
                  type="button"
                  className="wizard-summary-edit-btn"
                  onClick={() => handleJumpToScreen(4)}
                  title="Edit Notes"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Step Body */}
      <div className="wizard-body">
        {/* Stamp Overlay positioned in clear zone top-right */}
        <div
          ref={stampElRef}
          className={`wizard-stamp-overlay ${isStamping ? "is-active" : ""}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 110 44" width="110" height="44">
            <rect x="2" y="2" width="106" height="40" rx="8" fill="none" stroke="#C75A3A" strokeWidth="2.2" />
            <rect x="5" y="5" width="100" height="34" rx="5" fill="none" stroke="#C75A3A" strokeWidth="0.8" strokeDasharray="4 2" />
            <text x="55" y="16" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8" fontWeight="600" letterSpacing="1.2" fill="#C75A3A">SAHI TRAVELS</text>
            <text x="55" y="31" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="700" fontSize="11.5" letterSpacing="1.4" fill="#C75A3A">CONFIRMED</text>
          </svg>
        </div>

        {/* SCREEN 1: JOURNEY */}
        {screenIndex === 0 && (
          <div className="wizard-screen">
            <div className="wizard-screen__head">
              <span className="wizard-screen__eyebrow mono">Screen 1 of 5</span>
              <h3 ref={headingRef} id="wizard-heading" className="wizard-screen__title" tabIndex={-1}>
                Plan your journey
              </h3>
            </div>

            <div className="wizard-form-fields">
              {/* Field: Trip Type */}
              <div className="wizard-field">
                <label className="wizard-field-label">Trip type</label>
                <div className="wizard-radio-options" role="radiogroup" aria-label="Trip type">
                  <label className={`wizard-radio-card ${tripType === "One way" ? "is-selected" : ""}`}>
                    <input
                      type="radio"
                      name="tripType"
                      value="One way"
                      checked={tripType === "One way"}
                      onChange={() => {
                        setTripType("One way");
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.returnDate;
                          return n;
                        });
                      }}
                      className="sr-only"
                    />
                    <span className="wizard-radio-card__title">One way</span>
                    <span className="wizard-radio-card__sub">Drop-off at your destination</span>
                  </label>

                  <label className={`wizard-radio-card ${tripType === "Round trip" ? "is-selected" : ""}`}>
                    <input
                      type="radio"
                      name="tripType"
                      value="Round trip"
                      checked={tripType === "Round trip"}
                      onChange={() => setTripType("Round trip")}
                      className="sr-only"
                    />
                    <span className="wizard-radio-card__title">Round trip</span>
                    <span className="wizard-radio-card__sub">Same vehicle & driver on return</span>
                  </label>
                </div>
              </div>

              {/* Field: From */}
              <div className="wizard-field">
                <label htmlFor={`${compId}-from`} className="wizard-field-label">
                  Departing from
                </label>
                <LocationSearchBox
                  inputId={`${compId}-from`}
                  placeholder="City, airport, area, or destination worldwide"
                  initialQuery={fromQuery || fromPlace?.name || ""}
                  onSelect={(p) => {
                    setFromPlace(p);
                    setFromQuery(p.name);
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.from;
                      return n;
                    });
                  }}
                  onQueryChange={(q) => {
                    setFromQuery(q);
                    if (fromPlace && fromPlace.name !== q) {
                      setFromPlace(null);
                    }
                    if (errors.from) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.from;
                        return n;
                      });
                    }
                  }}
                  onEnterPress={handleNext}
                  inputRef={fromInputRef}
                  isInvalid={Boolean(errors.from)}
                />
                {errors.from && (
                  <p className="wizard-field-error" role="alert">
                    {errors.from}
                  </p>
                )}
              </div>

              {/* Field: To */}
              <div className="wizard-field">
                <label htmlFor={`${compId}-to`} className="wizard-field-label">
                  Going to
                </label>
                <LocationSearchBox
                  inputId={`${compId}-to`}
                  placeholder="City, airport, area, or destination worldwide"
                  initialQuery={toQuery || toPlace?.name || ""}
                  onSelect={(p) => {
                    setToPlace(p);
                    setToQuery(p.name);
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.to;
                      return n;
                    });
                  }}
                  onQueryChange={(q) => {
                    setToQuery(q);
                    if (toPlace && toPlace.name !== q) {
                      setToPlace(null);
                    }
                    if (errors.to) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.to;
                        return n;
                      });
                    }
                  }}
                  onEnterPress={handleNext}
                  inputRef={toInputRef}
                  isInvalid={Boolean(errors.to)}
                />
                {errors.to && (
                  <p className="wizard-field-error" role="alert">
                    {errors.to}
                  </p>
                )}
              </div>

              {/* Field: Return date (shown directly under To when Round trip) */}
              {tripType === "Round trip" && (
                <div className="wizard-field">
                  <label htmlFor={`${compId}-return-date`} className="wizard-field-label">
                    Return date
                  </label>
                  <input
                    ref={returnDateInputRef}
                    id={`${compId}-return-date`}
                    type="date"
                    min={travelDate || todayStr}
                    value={returnDate}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      if (errors.returnDate) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.returnDate;
                          return n;
                        });
                      }
                    }}
                    onKeyDown={handleInputKeyDown}
                    className={`bf-field__input ${errors.returnDate ? "is-invalid" : ""}`}
                  />
                  {errors.returnDate && (
                    <p className="wizard-field-error" role="alert">
                      {errors.returnDate}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 2: SCHEDULE */}
        {screenIndex === 1 && (
          <div className="wizard-screen">
            <div className="wizard-screen__head">
              <span className="wizard-screen__eyebrow mono">Screen 2 of 5</span>
              <h3 ref={headingRef} id="wizard-heading" className="wizard-screen__title" tabIndex={-1}>
                When would you like to travel?
              </h3>
            </div>

            <div className="wizard-form-fields">
              {/* Field: Travel date */}
              <div className="wizard-field">
                <label htmlFor={`${compId}-travel-date`} className="wizard-field-label">
                  Travel date
                </label>
                <input
                  ref={travelDateInputRef}
                  id={`${compId}-travel-date`}
                  type="date"
                  min={todayStr}
                  value={travelDate}
                  onChange={(e) => {
                    setTravelDate(e.target.value);
                    if (errors.travelDate) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.travelDate;
                        return n;
                      });
                    }
                  }}
                  onKeyDown={handleInputKeyDown}
                  className={`bf-field__input ${errors.travelDate ? "is-invalid" : ""}`}
                />
                {errors.travelDate && (
                  <p className="wizard-field-error" role="alert">
                    {errors.travelDate}
                  </p>
                )}
              </div>

              {/* Field: Pickup Time Slot */}
              <div className="wizard-field">
                <label className="wizard-field-label">Pickup time slot</label>
                <div className="bf-slots-grid" role="radiogroup" aria-label="Pickup time slots">
                  {TIME_SLOTS.map((slot) => {
                    const isNight = isNightSlot(slot);
                    const isSelected = timeSlot === slot;
                    return (
                      <label key={slot} className={`slot-chip ${isSelected ? "is-selected" : ""}`}>
                        <input
                          type="radio"
                          name="timeSlot"
                          value={slot}
                          checked={isSelected}
                          onChange={() => {
                            setTimeSlot(slot);
                            if (errors.timeSlot) {
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.timeSlot;
                                return n;
                              });
                            }
                          }}
                          className="sr-only"
                        />
                        <span>{slot}</span>
                        {isNight && <span className="slot-chip__badge">Night</span>}
                      </label>
                    );
                  })}
                </div>
                {errors.timeSlot && (
                  <p className="wizard-field-error" role="alert">
                    {errors.timeSlot}
                  </p>
                )}
              </div>

              {/* Field: Passengers */}
              <div className="wizard-field">
                <label htmlFor={`${compId}-passengers`} className="wizard-field-label">
                  Number of passengers
                </label>
                <div className="wizard-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setPassengers((prev) => Math.max(1, prev - 1))}
                    aria-label="Decrease passenger count"
                  >
                    −
                  </button>
                  <input
                    id={`${compId}-passengers`}
                    type="number"
                    min={1}
                    max={60}
                    value={passengers}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setPassengers(isNaN(val) ? 1 : Math.min(60, Math.max(1, val)));
                    }}
                    onKeyDown={handleInputKeyDown}
                    className="stepper-input mono"
                    aria-label="Passenger count"
                  />
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setPassengers((prev) => Math.min(60, prev + 1))}
                    aria-label="Increase passenger count"
                  >
                    +
                  </button>
                </div>
                <p className="wizard-hint">Comfortable capacity from 1 to 60 travellers.</p>
                {errors.passengers && (
                  <p className="wizard-field-error" role="alert">
                    {errors.passengers}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: VEHICLE */}
        {screenIndex === 2 && (
          <div className="wizard-screen">
            <div className="wizard-screen__head">
              <span className="wizard-screen__eyebrow mono">Screen 3 of 5</span>
              <h3 ref={headingRef} id="wizard-heading" className="wizard-screen__title" tabIndex={-1}>
                Select your vehicle
              </h3>
            </div>

            {isFromShowcase && (
              <div className="wizard-preselected-badge">
                ★ Selected from our fleet
              </div>
            )}

            <WizardVehicleCarousel
              selectedId={selectedVehicleId}
              onSelectVehicle={(id) => {
                setSelectedVehicleId(id);
                setErrors({});
              }}
            />
          </div>
        )}

        {/* SCREEN 4: CONTACT */}
        {screenIndex === 3 && (
          <div className="wizard-screen">
            <div className="wizard-screen__head">
              <span className="wizard-screen__eyebrow mono">Screen 4 of 5</span>
              <h3 ref={headingRef} id="wizard-heading" className="wizard-screen__title" tabIndex={-1}>
                Contact details
              </h3>
            </div>

            <div className="wizard-form-fields">
              {/* Field: Full Name */}
              <div className="wizard-field">
                <label htmlFor={`${compId}-name`} className="wizard-field-label">
                  Full name
                </label>
                <input
                  ref={nameInputRef}
                  id={`${compId}-name`}
                  type="text"
                  autoComplete="name"
                  value={name}
                  placeholder="e.g. Rahul Sharma"
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.name;
                        return n;
                      });
                    }
                  }}
                  onKeyDown={handleInputKeyDown}
                  className={`bf-field__input ${errors.name ? "is-invalid" : ""}`}
                />
                {errors.name && (
                  <p className="wizard-field-error" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Field: Mobile */}
              <div className="wizard-field">
                <label htmlFor={`${compId}-mobile`} className="wizard-field-label">
                  Mobile number
                </label>
                <div className="wizard-phone-row">
                  <select
                    value={countryDialCode}
                    onChange={(e) => setCountryDialCode(e.target.value)}
                    className="wizard-dial-select mono"
                    aria-label="Country calling code"
                  >
                    {COUNTRY_DIAL_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} ({item.country})
                      </option>
                    ))}
                  </select>
                  <input
                    ref={mobileInputRef}
                    id={`${compId}-mobile`}
                    type="tel"
                    autoComplete="tel"
                    inputMode="numeric"
                    value={mobileNumber}
                    placeholder={
                      countryDialCode === "+91"
                        ? "10-digit number (e.g. 9876543210)"
                        : "Mobile number"
                    }
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      if (errors.mobile) {
                        setErrors((prev) => {
                          const n = { ...prev };
                          delete n.mobile;
                          return n;
                        });
                      }
                    }}
                    onKeyDown={handleInputKeyDown}
                    className={`bf-field__input wizard-phone-input ${errors.mobile ? "is-invalid" : ""}`}
                  />
                </div>
                {errors.mobile && (
                  <p className="wizard-field-error" role="alert">
                    {errors.mobile}
                  </p>
                )}
              </div>

              {/* Field: Email (Optional) */}
              <div className="wizard-field">
                <label htmlFor={`${compId}-email`} className="wizard-field-label">
                  Email (optional)
                </label>
                <input
                  ref={emailInputRef}
                  id={`${compId}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.email;
                        return n;
                      });
                    }
                  }}
                  onKeyDown={handleInputKeyDown}
                  className={`bf-field__input ${errors.email ? "is-invalid" : ""}`}
                />
                {errors.email && (
                  <p className="wizard-field-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 5: NOTES & REVIEW */}
        {screenIndex === 4 && (
          <div className="wizard-screen">
            <div className="wizard-screen__head">
              <span className="wizard-screen__eyebrow mono">Screen 5 of 5</span>
              <h3 ref={headingRef} id="wizard-heading" className="wizard-screen__title" tabIndex={-1}>
                Notes & review
              </h3>
            </div>

            <div className="wizard-form-fields">
              {/* Field: Notes */}
              <div className="wizard-field">
                <label htmlFor={`${compId}-notes`} className="wizard-field-label">
                  Additional notes (optional)
                </label>
                <textarea
                  ref={notesInputRef}
                  id={`${compId}-notes`}
                  rows={3}
                  maxLength={500}
                  value={notes}
                  placeholder="Luggage requirements, child seats, flight number, pickup landmark…"
                  onChange={(e) => setNotes(e.target.value)}
                  className="bf-field__textarea"
                />
                <div className="wizard-counter mono">
                  {500 - notes.length} characters left
                </div>
                {errors.notes && (
                  <p className="wizard-field-error" role="alert">
                    {errors.notes}
                  </p>
                )}
              </div>

              {/* Review summary grid */}
              <div className="wizard-review-grid" aria-label="Summary of details">
                <div className="wizard-review-row">
                  <span className="review-label">Journey:</span>
                  <span className="review-val">
                    {tripType === "Round trip"
                      ? `Round trip · ${fromPlace?.name || fromQuery} → ${toPlace?.name || toQuery}${returnDate ? ` (Return ${formatDateDisplay(returnDate)})` : ""}`
                      : `One way · ${fromPlace?.name || fromQuery} → ${toPlace?.name || toQuery}`}
                  </span>
                  <button type="button" onClick={() => handleJumpToScreen(0)} className="review-edit-btn">Edit</button>
                </div>

                <div className="wizard-review-row">
                  <span className="review-label">Schedule:</span>
                  <span className="review-val">
                    {formatDateDisplay(travelDate)} · {timeSlot} · {passengers} pax
                  </span>
                  <button type="button" onClick={() => handleJumpToScreen(1)} className="review-edit-btn">Edit</button>
                </div>

                <div className="wizard-review-row">
                  <span className="review-label">Vehicle:</span>
                  <span className="review-val">{currentVehicle.name} ({currentVehicle.seats})</span>
                  <button type="button" onClick={() => handleJumpToScreen(2)} className="review-edit-btn">Edit</button>
                </div>

                <div className="wizard-review-row">
                  <span className="review-label">Contact:</span>
                  <span className="review-val">{name} · {countryDialCode} {mobileNumber}</span>
                  <button type="button" onClick={() => handleJumpToScreen(3)} className="review-edit-btn">Edit</button>
                </div>

                {email.trim() && (
                  <div className="wizard-review-row">
                    <span className="review-label">Email:</span>
                    <span className="review-val">{email}</span>
                    <button type="button" onClick={() => handleJumpToScreen(3)} className="review-edit-btn">Edit</button>
                  </div>
                )}
              </div>

              {/* Indicative Estimate Card */}
              <div className="wizard-estimate-card">
                {isEstimating ? (
                  <p className="wizard-estimate-loading mono">Calculating indicative estimate…</p>
                ) : estimateData?.type === "calculated" ? (
                  <>
                    <div className="bf-estimate-card__header">
                      <h4 className="bf-estimate-card__title">Indicative estimate</h4>
                      <div className="bf-estimate-card__total-wrap">
                        <span className="bf-estimate-card__total">
                          ₹{estimateData.total.toLocaleString("en-IN")}
                        </span>
                        <span className="bf-estimate-card__approx">approximately</span>
                      </div>
                    </div>

                    {estimateData.distanceText && (
                      <p className="wizard-estimate-distance mono">
                        {estimateData.distanceText}
                      </p>
                    )}

                    <div className="bf-estimate-card__breakdown">
                      <div className="bf-estimate-card__row">
                        <span className="bf-estimate-card__row-label">
                          Distance charge ({estimateData.billableKm} km)
                        </span>
                        <span>₹{estimateData.distanceCharge.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="bf-estimate-card__row">
                        <span className="bf-estimate-card__row-label">
                          Driver batta ({estimateData.days} {estimateData.days === 1 ? "day" : "days"})
                        </span>
                        <span>₹{estimateData.driverBatta.toLocaleString("en-IN")}</span>
                      </div>
                      {estimateData.nightAllowance > 0 && (
                        <div className="bf-estimate-card__row">
                          <span className="bf-estimate-card__row-label">
                            Night allowance ({estimateData.nights} {estimateData.nights === 1 ? "night" : "nights"})
                          </span>
                          <span>₹{estimateData.nightAllowance.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>

                    <p className="bf-estimate-card__disclaimer">
                      Excludes toll gates, parking, state permit taxes and GST. Final price is confirmed by our team.
                    </p>
                  </>
                ) : estimateData?.message ? (
                  <>
                    <h4 className="bf-estimate-card__title">Trip fare</h4>
                    <p className="bf-estimate-card__message">{estimateData.message}</p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="wizard-footer">
        {screenIndex > 0 ? (
          <button
            type="button"
            className="btn btn--outline wizard-back-btn"
            onClick={handleBack}
            disabled={isSubmitting || isStamping}
          >
            ← Back
          </button>
        ) : <div />}

        <div className="wizard-footer-right">
          {screenIndex === 3 && (
            <button
              type="button"
              className="btn btn--ghost wizard-skip-btn"
              onClick={handleSkip}
              disabled={isSubmitting || isStamping}
            >
              Skip email
            </button>
          )}

          {screenIndex === 4 ? (
            <button
              type="button"
              className="btn btn--navy wizard-next-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Submit enquiry →"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--navy wizard-next-btn"
              onClick={handleNext}
              disabled={isStamping}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {submitError && (
        <p className="wizard-submit-error" role="alert">
          {submitError}
        </p>
      )}
    </div>
  );
}

// =========================================================================
// SUBCOMPONENT: Worldwide Location Search Combobox
// =========================================================================
function LocationSearchBox({
  inputId,
  placeholder,
  initialQuery,
  onSelect,
  onQueryChange,
  onEnterPress,
  inputRef,
  isInvalid,
}: {
  inputId: string;
  placeholder: string;
  initialQuery: string;
  onSelect: (p: PlaceSelection) => void;
  onQueryChange: (q: string) => void;
  onEnterPress: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isInvalid?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
  if (initialQuery !== prevInitialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
  }

  const [results, setResults] = useState<PlaceSelection[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const cacheRef = useRef<Map<string, PlaceSelection[]>>(new Map());
  const abortCtrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      return;
    }

    if (cacheRef.current.has(q.toLowerCase())) {
      const cached = cacheRef.current.get(q.toLowerCase())!;
      queueMicrotask(() => {
        setResults(cached);
        setIsOpen(true);
      });
      return;
    }

    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort();
    }
    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;

    const timer = setTimeout(() => {
      fetch(`/api/places?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((res) => res.json())
        .then((data: PlaceSelection[]) => {
          cacheRef.current.set(q.toLowerCase(), data);
          setResults(data);
          setIsOpen(true);
          setActiveIndex(-1);
        })
        .catch(() => {});
    }, 250);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  const handleSelect = (place: PlaceSelection) => {
    setQuery(place.name);
    setIsOpen(false);
    onSelect(place);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen && results.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
      } else if (results.length > 0) {
        setActiveIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === "Enter") {
      if (isOpen && activeIndex >= 0 && activeIndex < results.length) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      } else {
        onEnterPress();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div className="bf-combobox">
      <input
        ref={inputRef as React.Ref<HTMLInputElement>}
        id={inputId}
        type="text"
        className={`bf-field__input ${isInvalid ? "is-invalid" : ""}`}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          onQueryChange(val);
          if (val.trim().length < 2) {
            setResults([]);
            setIsOpen(false);
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={`${inputId}-listbox`}
        aria-activedescendant={activeIndex >= 0 ? `${inputId}-opt-${activeIndex}` : undefined}
        autoComplete="off"
      />

      {isOpen && (
        <ul id={`${inputId}-listbox`} role="listbox" className="bf-combobox__listbox">
          {results.length > 0 ? (
            results.map((p, idx) => (
              <li
                key={p.id || `${p.name}-${idx}`}
                id={`${inputId}-opt-${idx}`}
                role="option"
                aria-selected={idx === activeIndex}
                className={`bf-combobox__option ${idx === activeIndex ? "is-active" : ""}`}
                onClick={() => handleSelect(p)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div className="bf-combobox__option-region">
                    {[p.region, p.country].filter(Boolean).join(", ")}
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 11, opacity: 0.6 }}>
                  {p.countryCode}
                </span>
              </li>
            ))
          ) : (
            <li className="bf-combobox__nomatch">
              <p style={{ margin: 0, color: "var(--color-muted-plum)" }}>
                No match. Try a nearby city or airport name.
              </p>
              <button
                type="button"
                className="btn btn--ghost"
                style={{ marginTop: 6, fontSize: 13, padding: "4px 8px" }}
                onClick={() =>
                  handleSelect({
                    name: query.trim(),
                    countryCode: "IN",
                    isFreeText: true,
                  })
                }
              >
                Use &quot;{query.trim()}&quot; as entered
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

// =========================================================================
// SUBCOMPONENT: Wizard Vehicle Carousel (One vehicle at a time)
// =========================================================================
function WizardVehicleCarousel({
  selectedId,
  onSelectVehicle,
}: {
  selectedId: string;
  onSelectVehicle: (id: string) => void;
}) {
  const currentIndex = FLEET.findIndex((v) => v.id === selectedId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const vehicle = FLEET[safeIndex];

  const handlePrev = () => {
    const nextIdx = (safeIndex - 1 + FLEET.length) % FLEET.length;
    onSelectVehicle(FLEET[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (safeIndex + 1) % FLEET.length;
    onSelectVehicle(FLEET[nextIdx].id);
  };

  return (
    <div className="wizard-vehicle-card">
      <div className="wizard-vehicle-header">
        <div className="wizard-vehicle-badge">
          <span className="showcase-card__category-chip">
            {vehicle.category.toUpperCase()}
          </span>
          <span className="mono" style={{ fontSize: 12, opacity: 0.8 }}>
            {vehicle.seats}
          </span>
        </div>

        <div className="wizard-vehicle-nav-btns">
          <button
            type="button"
            className="showcase-card__round-btn"
            onClick={handlePrev}
            aria-label="Previous vehicle"
          >
            ←
          </button>
          <button
            type="button"
            className="showcase-card__round-btn"
            onClick={handleNext}
            aria-label="Next vehicle"
          >
            →
          </button>
        </div>
      </div>

      <div className="wizard-vehicle-content">
        <div className="wizard-vehicle-img-wrap">
          <Image
            src={vehicle.image}
            alt={vehicle.alt}
            className="wizard-vehicle-img"
            width={400}
            height={267}
            unoptimized
          />
        </div>
        <div className="wizard-vehicle-meta">
          <h4 className="wizard-vehicle-title">{vehicle.name}</h4>
          <p className="wizard-vehicle-speech">
            &ldquo;{vehicle.speech}&rdquo;
          </p>
        </div>
      </div>

      {/* 12 Dot Indicators */}
      <div className="showcase-dots" role="tablist" aria-label="Vehicle options">
        {FLEET.map((v, idx) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={idx === safeIndex}
            aria-label={`Select ${v.name}`}
            className={`showcase-dot ${idx === safeIndex ? "is-active" : ""}`}
            onClick={() => onSelectVehicle(v.id)}
          />
        ))}
      </div>

      <button
        type="button"
        className="btn btn--navy wizard-vehicle-choose-btn"
        onClick={() => onSelectVehicle(vehicle.id)}
      >
        Choose this vehicle ({vehicle.name})
      </button>
    </div>
  );
}
