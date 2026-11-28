"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const FilterByCategory = ({ categories }: { categories: string[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("filter_by");
    } else {
      params.set("filter_by", value);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-50">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All</SelectItem>

        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterByCategory;
