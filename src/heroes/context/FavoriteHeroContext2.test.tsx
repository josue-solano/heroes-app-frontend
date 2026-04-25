import { use } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "./FavoriteHeroContext";
import type { Hero } from "../types/hero.interface";

const mockHero = {
  id: "1",
  name: "Bruce Wayne",
  slug: "bruce-wayne",
  alias: "Batman",
  powers: [
    "Artes marciales",
    "Habilidades de detective",
    "Tecnología avanzada",
    "Sigilo",
    "Genio táctico",
  ],
  description:
    "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
  strength: 6,
  intelligence: 10,
  speed: 6,
  durability: 7,
  team: "Liga de la Justicia",
  image: "2.jpeg",
  firstAppearance: "1939",
  status: "Active",
  category: "Hero",
  universe: "DC",
} as Hero;

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const TestComponent = () => {
  const { favoriteCount, favorites, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoriteCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>

      <button
        data-testid="toggle-favorite"
        onClick={() => toggleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>
      <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

const renderContextTest = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>,
  );
};

describe("FavoriteHeroContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should initialize with default values", () => {
    renderContextTest();

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
  });

  test("should add hero to favorites when toggleFavorite is called with new Hero", () => {
    renderContextTest();

    const button = screen.getByTestId("toggle-favorite");

    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("favorite-list").children.length).toBe(1);

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favorites",
      JSON.stringify([mockHero]),
    );
  });

  test("should remove hero from favorites when toggleFavorite is called twice with a Hero", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

    localStorage.setItem("favorites", JSON.stringify([mockHero]));

    renderContextTest();

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("favorite-list").children.length).toBe(1);
    expect(localStorage.getItem("favorites")).toContain(mockHero.name);
    expect(screen.getByTestId("hero-1").textContent).toBe(mockHero.name);

    const button = screen.getByTestId("toggle-favorite");

    localStorageMock.getItem.mockReturnValue("");

    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
    expect(localStorage.getItem("favorites")).not.toContain(mockHero.name);
    expect(screen.queryByTestId("hero-1")).toBeNull();

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith("favorites", "[]");
  });
});
