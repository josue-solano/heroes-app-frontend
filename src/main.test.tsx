import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroesApp } from "./HeroesApp";

describe("main", () => {
  test("Should return true", () => {
    render(<HeroesApp />);

    const title = screen
      .getAllByRole("heading")
      .find((h) => h.innerHTML === "Universo de Super Héroes");

    expect(title).toBeDefined();
  });
});
