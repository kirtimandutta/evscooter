import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ variant = "primary", className, type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm tracking-wide transition duration-300 disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "bg-[#00FF66] font-bold text-black hover:shadow-[0_0_25px_#00FF66]",
        variant === "secondary" &&
          "border border-[#00FF66]/35 bg-black/40 font-medium text-white backdrop-blur-xl hover:border-[#00FF66] hover:shadow-[0_0_20px_rgba(0,255,102,0.25)]",
        variant === "ghost" && "px-3 text-[#A1A1AA] hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
