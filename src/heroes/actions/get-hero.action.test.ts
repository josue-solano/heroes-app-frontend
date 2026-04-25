import { describe, test, expect } from "vitest";
import { getHeroAction } from "./get-hero.action";
import type { Hero } from "../types/hero.interface";

const BASE_URL = import.meta.env.VITE_API_URL;

describe("getHeroAction", () => {
  test("should return hero data and return with complete image url", async () => {
    const heroSlug = "clark-kent";

    const response: Hero = await getHeroAction(heroSlug);

    expect(response).toBeDefined();
    expect(response.image).toContain(`${BASE_URL}/images`);
  });

  test("should throw an error if hero is not found", async () => {
    const heroSlug = "non-existent-hero";

    const result = await getHeroAction(heroSlug).catch((error) => {
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    expect(result).toBeUndefined();
  });
});
