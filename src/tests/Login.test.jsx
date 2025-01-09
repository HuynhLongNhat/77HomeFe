/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../components/user/Login";

describe("Login Component", () => {
  test("renders all elements", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("yupSchema", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/email không được để trống!/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password không được để trống!/i)
    ).toBeInTheDocument();
  });

  test("handleFormSubmitFunction", async () => {
    const mockOnSubmit = vi.fn();

    render(
      <MemoryRouter>
        <Login onSubmit={mockOnSubmit} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: "thanhlich2103gg@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: "27092002Tl@" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await screen.findByRole("button", { name: /sign in/i });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "thanhlich2103gg@gmail.com",
      password: "27092002Tl@",
    });
  });
});
