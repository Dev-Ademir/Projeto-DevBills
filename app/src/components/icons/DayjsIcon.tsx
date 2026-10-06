import type { SVGProps } from "react";

export const DayjsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="24" height="24" rx="4" fill="#FF5F5F" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="10"
      fontWeight="bold"
      fill="#FFFFFF"
      fontFamily="Arial, sans-serif"
    >
      D
    </text>
  </svg>
);