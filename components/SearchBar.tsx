"use client";

import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const { setSearch } = useSearch();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearch(query);
      router.push("/"); 
    }
  };

  return (
    <input
      type="text"
      placeholder="Tìm sản phẩm..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
