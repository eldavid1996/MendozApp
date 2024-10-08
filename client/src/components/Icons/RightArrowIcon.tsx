import { SVGProps } from "react";

export const RightArrowIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {" "}
      <circle
        cx="12"
        cy="12"
        r="10"
      /> <polyline points="12 16 16 12 12 8" />{" "}
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
};
