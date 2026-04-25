import type React from "react";
import type { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { CustomPagination } from "./CustomPagination";

vi.mock("../ui/button", () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
}));

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries?: string[],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe("CustomPagination", () => {
  test("should render component with default values ", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);
    expect(screen.getByText("Anterior")).toBeDefined();
    expect(screen.getByText("Siguiente")).toBeDefined();

    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
  });

  test("should disable previous button when page is one ", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    const previousButton = screen.getByText("Anterior");

    expect(previousButton.getAttributeNames()).toContain("disabled");
  });

  test("should disable next button when we are in the last page", () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=5"]);

    const nextButton = screen.getByText("Siguiente");

    expect(nextButton.getAttributeNames()).toContain("disabled");
  });

  test("should disable button three when we are in page three", () => {
    renderWithRouter(<CustomPagination totalPages={10} />, ["/?page=3"]);

    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");

    expect(button2.getAttribute("variant")).toBe("outline");
    expect(button3.getAttribute("variant")).toBe("default");
  });

  test("should change page when click on number button", () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=3"]);

    const button2 = screen.getByText("2");
    const button3 = screen.getByText("3");

    expect(button2.getAttribute("variant")).toBe("outline");
    expect(button3.getAttribute("variant")).toBe("default");

    fireEvent.click(button2);

    expect(button2.getAttribute("variant")).toBe("default");
    expect(button3.getAttribute("variant")).toBe("outline");
  });
});
