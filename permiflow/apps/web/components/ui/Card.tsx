"use client";

import { ReactNode } from "react";
import clsx from "classnames";

type CardProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export const Card = ({
  title,
  subtitle,
  children,
  className,
  actions,
}: CardProps) => (
  <section
    className={clsx(
      "glass p-6 transition hover:-translate-y-0.5 hover:border-slate-500/40",
      className,
    )}
  >
    {(title || subtitle || actions) && (
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-400">{subtitle}</p>
          )}
        </div>
        {actions}
      </header>
    )}
    {children}
  </section>
);
