import type {Metadata} from "next";

import {Inter} from "next/font/google";

import "./globals.css";
import React from "react";

import QueryProviders from "./react-query-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Route Planner"
};

export default function RootLayout({children}: {children: React.JSX.Element}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
