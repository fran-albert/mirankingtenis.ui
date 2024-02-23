import { InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { FaSearch } from "react-icons/fa";

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

const Search = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 items-center rounded-md border border-input bg-gray-200 pl-3 text-sm ring-offset-background",
          className
        )}
      >
        <FaSearch size={18} />
        <input
          {...props}
          type="text"
          ref={ref}
          className="w-full p-2 placeholder:text-muted-foreground bg-gray-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    );
  }
);

Search.displayName = "Search";

export { Search };
