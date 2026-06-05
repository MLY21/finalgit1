"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SectionNavigationProps {
  sections: {
    id: string;
    label: string;
  }[];
}

export function SectionNavigation({ sections }: SectionNavigationProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <nav
      className="sticky top-0 z-10 border-b-2 border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95"
      aria-label="Section navigation"
    >
      <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4 scrollbar-hide sm:px-5">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "whitespace-nowrap rounded-xl border-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600",
              activeSection === section.id
                ? "border-zinc-900 bg-zinc-100 text-zinc-900 shadow-sm dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-100"
                : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
