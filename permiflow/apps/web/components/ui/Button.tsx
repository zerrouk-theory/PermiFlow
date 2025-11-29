"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "classnames";

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  primary:
    "bg-[#1E3A8A] text-white hover:bg-[#2746a8] focus-visible:outline-[#F5D98C]",
  secondary:
    "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
  ghost:
    "bg-transparent text-slate-300 hover:text-white hover:bg-white/10 border border-white/20",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export const Button = ({
  className,
  variant = "primary",
  ...rest
}: Props) => (
  <button className={clsx(base, variants[variant], className)} {...rest} />
);
