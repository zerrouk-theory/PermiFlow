"use client";

import { ReactNode } from "react";
import clsx from "classnames";

type TableProps = {
  headers: string[];
  rows: ReactNode[][];
  dense?: boolean;
};

export const Table = ({ headers, rows, dense = false }: TableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-left text-sm text-slate-200">
      <thead>
        <tr className="text-xs uppercase tracking-wide text-slate-400">
          {headers.map((header) => (
            <th
              key={header}
              className={clsx("px-3 py-2 font-semibold", {
                "py-1.5": dense,
              })}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, index) => (
          <tr
            key={`row-${index}`}
            className="border-t border-white/5 last:border-b last:border-white/5"
          >
            {cells.map((cell, cellIndex) => (
              <td
                key={`cell-${index}-${cellIndex}`}
                className={clsx("px-3 py-2", {
                  "py-1.5": dense,
                })}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
