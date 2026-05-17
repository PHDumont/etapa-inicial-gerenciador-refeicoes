import { useEffect, useId, useRef, useState } from "react";
import {
  ensureFoodId,
  searchFoods,
  type FoodSearchResult,
} from "../utils/foodSearch";
import "./FoodSearchInput.css";

interface FoodSearchInputProps {
  foodId: string;
  foodName: string;
  onSelect: (foodId: string, foodName: string) => void;
  label?: string;
  placeholder?: string;
}

export function FoodSearchInput({
  foodId,
  foodName,
  onSelect,
  label = "Food",
  placeholder = "Search food by name...",
}: FoodSearchInputProps) {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skipSearchRef = useRef(false);
  const [query, setQuery] = useState(foodName);
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasSelection = Boolean(foodId && foodName.trim());

  useEffect(() => {
    if (foodId && foodName) {
      setQuery(foodName);
    }
  }, [foodId, foodName]);

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }

    const term = query.trim();

    if (hasSelection && term === foodName.trim()) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    if (term.length < 2) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const foods = await searchFoods(term);
        setResults(foods);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, hasSelection, foodName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (food: FoodSearchResult) => {
    setIsSaving(true);
    try {
      const id = await ensureFoodId(food);
      skipSearchRef.current = true;
      onSelect(id, food.name);
      setQuery(food.name);
      setResults([]);
      setIsOpen(false);
    } catch {
      alert("Could not save the selected food. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      onSelect("", "");
      return;
    }

    if (hasSelection && value.trim() !== foodName.trim()) {
      onSelect("", "");
    }
  };

  return (
    <div className="food-search" ref={wrapperRef}>
      {label && <label htmlFor={listId}>{label}</label>}
      <input
        id={listId}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        placeholder={placeholder}
        value={query}
        disabled={isSaving}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (hasSelection) return;
          if (results.length > 0) setIsOpen(true);
        }}
      />
      {hasSelection && (
        <span className="food-search-status food-search-selected">
          Selected: {foodName}
        </span>
      )}
      {(isLoading || isSaving) && (
        <span className="food-search-status">
          {isSaving ? "Saving..." : "Searching..."}
        </span>
      )}
      {isOpen && results.length > 0 && (
        <ul className="food-search-results" role="listbox">
          {results.map((food, index) => (
            <li key={food._id ?? `${food.name}-${index}`}>
              <button
                type="button"
                role="option"
                className="food-search-option"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(food)}
              >
                <span className="food-search-option-name">{food.name}</span>
                <span className="food-search-option-meta">
                  {food.category} · {food.kcalPer100g} kcal/100g
                  {food.source === "open-food-facts" && " · Open Food Facts"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {isOpen &&
        !isLoading &&
        !hasSelection &&
        query.trim().length >= 2 &&
        results.length === 0 && (
          <p className="food-search-empty">No foods found.</p>
        )}
    </div>
  );
}
