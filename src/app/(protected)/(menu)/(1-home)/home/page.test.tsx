import { render, screen } from "@testing-library/react";
import HomePlaceholder from "./page";

describe("(protected)/(menu)/(1-home)/home page", () => {
  it("renders links to backup pages /home2 and /home3", () => {
    render(<HomePlaceholder />);

    const link2 = screen.getByText(/バックアップ: \/home2/i);
    const link3 = screen.getByText(/バックアップ: \/home3/i);

    expect(link2).toBeTruthy();
    expect(link3).toBeTruthy();
    expect(link2.getAttribute('href')).toBe('/home2');
    expect(link3.getAttribute('href')).toBe('/home3');
  });
});
