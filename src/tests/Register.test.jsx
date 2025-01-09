/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../components/user/Register";

describe("Register Component", () => {
  test("renders all elements", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /terms of use/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test("yupSchema", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findAllByText(/bắt buộc nhập/i)).toHaveLength(5);
  });

  test("handleFormSubmitFunction", async () => {
    const mockOnSubmit = vi.fn();

    render(
      <MemoryRouter>
        <Register onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "Duong" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Lich" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "thanhlich2103gg@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "27092002Tl@" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /terms of use/i }));
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await screen.findByRole("button", { name: /sign up/i });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      firstName: "Duong",
      lastName: "Lich",
      email: "thanhlich2103gg@gmail.com",
      password: "27092002Tl@",
      terms: true,
    });
  });
});
