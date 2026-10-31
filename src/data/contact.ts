import { officeItems } from "./offices";

export interface ContactInfo {
  phone: {
    display: string;
    dial: string;
    telLink: string;
  };
  whatsapp: {
    number: string;
    link: string;
    label: string;
  };
  email: {
    address: string;
    mailtoLink: string;
  };
  website: {
    url: string;
    display: string;
  };
  address: {
    city: string;
    full: string;
  };
  offices: string[];
}

// Extracted from the five marquee offices in offices.tsx (Chennai, Dubai, Bangkok, Brunei, Trichy)
export const CONTACT_OFFICES: string[] = officeItems
  .map((item) => item.title)
  .filter((title): title is string => Boolean(title));

export const CONTACT_DETAILS: ContactInfo = {
  phone: {
    display: "+91 8608925574",
    dial: "+918608925574",
    telLink: "tel:+918608925574",
  },
  whatsapp: {
    number: "918608925574",
    link: "https://wa.me/918608925574",
    label: "Message on WhatsApp",
  },
  email: {
    address: "booking@sahitravels.com",
    mailtoLink: "mailto:booking@sahitravels.com",
  },
  website: {
    url: "https://www.sahitravels.com",
    display: "www.sahitravels.com",
  },
  address: {
    city: "Chennai",
    full: "3, 2nd Cross Street, 2nd Main Road, Navarathna Garden, Defence Colony, Ekkatuthangal, Chennai - 600032",
  },
  offices: CONTACT_OFFICES,
};

