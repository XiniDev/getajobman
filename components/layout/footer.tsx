"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full mt-32 pt-8 pb-8 text-center text-sm text-muted-foreground">
      <p>
        © {year ? year : ""} Get A Job Man. Built for the grind.
      </p>
    </footer>
  );
}