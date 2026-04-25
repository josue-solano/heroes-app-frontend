import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SearchControls } from "./SearchControls";
import { MemoryRouter } from "react-router";

if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
}

const renderWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <SearchControls />
    </MemoryRouter>,
  );
};

describe("SearchControls", () => {
  test("should render SearchControls with default values", () => {
    const { container } = renderWithRouter();

    expect(container).toMatchSnapshot();
  });

  test("should set input value when search param name is set", () => {
    const name = "Batman";

    renderWithRouter([`/?name=${name}`]);

    const input = screen.getByPlaceholderText(
      "Buscar héroes, villanos, poderes, equipos...",
    );

    expect(input.getAttribute("value")).toBe(name);
  });

  test("should change params when input is changed and enter is pressed", () => {
    const name = "Batman";

    renderWithRouter([`/?name=${name}`]);

    const input = screen.getByPlaceholderText(
      "Buscar héroes, villanos, poderes, equipos...",
    );

    expect(input.getAttribute("value")).toBe(name);

    fireEvent.change(input, { target: { value: "Superman" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.getAttribute("value")).toBe("Superman");
  });

  test("should change params strength when slider is changed", () => {
    const name = "Batman";

    renderWithRouter([`/?name=${name}&active-accordion=advanced-filters`]);

    const slider = screen.getByRole("slider");

    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider.getAttribute("aria-valuenow")).toBe("1");
  });

  test("should open accordion when active-accordion param is set", () => {
    const name = "Batman";

    renderWithRouter([`/?name=${name}&active-accordion=advanced-filters`]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordionItem?.getAttribute("data-state")).toBe("open");
  });

  test("should close accordion when active-accordion param is not set", () => {
    const name = "Batman";

    renderWithRouter([`/?name=${name}`]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordionItem?.getAttribute("data-state")).toBe("closed");
  });
});
