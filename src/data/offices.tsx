import React from "react";

export interface OfficeItem {
  node: React.ReactNode;
  title?: string;
  ariaLabel?: string;
}

export const officeItems: OfficeItem[] = [
  {
    node: <span className="office-loop__name office-loop__name--serif">Chennai</span>,
    title: "Chennai",
  },
  {
    node: <span className="office-loop__dot" aria-hidden="true" />,
  },
  {
    node: <span className="office-loop__name">Dubai</span>,
    title: "Dubai",
  },
  {
    node: <span className="office-loop__dot" aria-hidden="true" />,
  },
  {
    node: <span className="office-loop__name office-loop__name--serif">Bangkok</span>,
    title: "Bangkok",
  },
  {
    node: <span className="office-loop__dot" aria-hidden="true" />,
  },
  {
    node: <span className="office-loop__name">Brunei</span>,
    title: "Brunei",
  },
  {
    node: <span className="office-loop__dot" aria-hidden="true" />,
  },
  {
    node: <span className="office-loop__name office-loop__name--serif">Trichy</span>,
    title: "Trichy",
  },
  {
    node: <span className="office-loop__dot" aria-hidden="true" />,
  },
];

