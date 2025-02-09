"use client";

import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import debounce from "lodash/debounce";
import { pb } from "@/lib/pocketbase";

interface Brand {
  id: string;
  name: string;
}

interface BodyType {
  id: string;
  name: string;
  value: string;
}

export interface FilterValues {
  brand?: string;
  bodyType?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: string;
}

interface CarFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (filters: FilterValues) => void;
}

const PRICE_RANGES = Object.freeze([
  { label: "< Rp 100 Juta", value: "100000000" },
  { label: "< Rp 200 Juta", value: "200000000" },
  { label: "< Rp 500 Juta", value: "500000000" },
  { label: "< Rp 1 Milyar", value: "1000000000" },
]);

const TRANSMISSION_OPTIONS = Object.freeze([
  { label: "Automatic", value: "AT" },
  { label: "Manual", value: "MT" },
]);

const TransmissionSelect = memo(
  ({
    value,
    onChange,
  }: {
    value: string | undefined;
    onChange: (value: string) => void;
  }) => (
    <Select value={value ?? "all"} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Transmission" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Transmissions</SelectItem>
        {TRANSMISSION_OPTIONS.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
);
TransmissionSelect.displayName = "TransmissionSelect";

const PriceSelect = memo(
  ({
    value,
    onChange,
  }: {
    value: string | undefined;
    onChange: (value: string) => void;
  }) => (
    <Select value={value ?? "all"} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Price Range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Any Price</SelectItem>
        {PRICE_RANGES.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
);
PriceSelect.displayName = "PriceSelect";

export function CarFilters({ onSearch, onFilterChange }: CarFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [brands, setBrands] = useState<Map<string, Brand>>(new Map());
  const [bodyTypes, setBodyTypes] = useState<Map<string, BodyType>>(new Map());

  const fetchData = useCallback(async () => {
    try {
      const [brandsResponse, bodyTypesResponse] = await Promise.all([
        pb.collection("brand").getFullList<Brand>({
          $autoCancel: false,
          $cancelKey: "brands",
        }),
        pb.collection("body_type").getFullList<BodyType>({
          $autoCancel: false,
          $cancelKey: "body-types",
        }),
      ]);

      setBrands(new Map(brandsResponse.map((brand) => [brand.id, brand])));
      setBodyTypes(new Map(bodyTypesResponse.map((type) => [type.id, type])));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearch(value), 300),
    [onSearch]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleFilterChange = useCallback(
    (key: keyof FilterValues, value: string | null) => {
      const newFilters = {
        ...filters,
        [key]: value === "all" ? undefined : value || undefined,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({});
    onSearch("");
    onFilterChange({});
  }, [onSearch, onFilterChange]);

  const hasActiveFilters = useMemo(
    () => searchQuery || Object.values(filters).some(Boolean),
    [searchQuery, filters]
  );

  const brandsArray = useMemo(() => Array.from(brands.values()), [brands]);

  const bodyTypesArray = useMemo(
    () => Array.from(bodyTypes.values()),
    [bodyTypes]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cars..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={isFiltersVisible ? "secondary" : "outline"}
          size="icon"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        )}
      </div>

      {isFiltersVisible && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select
            value={filters.brand ?? "all"}
            onValueChange={(value) => handleFilterChange("brand", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brandsArray.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.bodyType ?? "all"}
            onValueChange={(value) => handleFilterChange("bodyType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Body Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {bodyTypesArray.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <TransmissionSelect
            value={filters.transmission}
            onChange={(value) => handleFilterChange("transmission", value)}
          />

          <PriceSelect
            value={filters.minPrice?.toString()}
            onChange={(value) => handleFilterChange("minPrice", value)}
          />
        </div>
      )}
    </div>
  );
}
