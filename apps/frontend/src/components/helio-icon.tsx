import React from "react";

interface HelioIconProps {
  className?: string;
}

export const HelioIcon: React.FC<HelioIconProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      {/* Sol com rosto estilizado "marrento" */}
      <circle cx="12" cy="12" r="5" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
      />
      {/* Óculos de sol estilizado */}
      <path
        d="M10 10.5c-.2 0-.5.3-.5.5s.3.5.5.5M14 10.5c.2 0 .5.3.5.5s-.3.5-.5.5"
        fill="currentColor"
      />
      {/* Sorriso confiante */}
      <path
        d="M9 13.5c1 1 5 1 6 0"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};
