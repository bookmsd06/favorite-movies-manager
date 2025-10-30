import { Film, Tv } from "lucide-react";
import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8 text-center">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      <Film className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
      <span>{title}</span>
      <Tv className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
    </h1>
    {subtitle && (
      <p className="text-purple-200 text-sm sm:text-base lg:text-lg">{subtitle}</p>
    )}
  </div>
);
