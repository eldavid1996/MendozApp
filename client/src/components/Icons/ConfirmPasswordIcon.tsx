import { SVGProps } from "react";

export const ConfirmPasswordIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="h-8 w-8 text-gray-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {" "}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
};
