/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import axios from "axios";
import DetailHouse from "../components/owner/house/DetailHouse";

// Mock axios
vi.mock("axios");

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 1 }),
  };
});

describe("DetailHouse Component", () => {
  let mockHouseData;

  beforeEach(() => {
    // Dữ liệu mock
    mockHouseData = {
      id: 1,
      name: "Cozy Apartment",
      street: "123 Main St",
      ward: "District A",
      province: "Cityville",
      price: 1000,
      area: 50,
      bedrooms: 2,
      bathrooms: 1,
      description: "A lovely apartment with a great view.",
      phoneNumber: "123-456-7890",
      email: "landlord@example.com",
      image: "https://example.com/image.jpg",
    };

    // Mock axios
    vi.spyOn(axios, "get").mockResolvedValue({ data: mockHouseData });
  });

  afterEach(() => {
    vi.clearAllMocks(); // Reset tất cả mock sau mỗi test
  });

  test("renders house details correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/house/1"]}>
        <DetailHouse />
      </MemoryRouter>
    );

    // Kiểm tra chi tiết hiển thị
    expect(
      await screen.findByRole("heading", { name: /cozy apartment/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/123 main st/i)).toBeInTheDocument();
    expect(screen.getByText(/district a/i)).toBeInTheDocument();
    expect(screen.getByText(/cityville/i)).toBeInTheDocument();
    expect(screen.getByText(/1000 đ\/tháng/i)).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument(); // Diện tích
    expect(screen.getByText("2")).toBeInTheDocument(); // Phòng ngủ
    expect(screen.getByText("1")).toBeInTheDocument(); // Phòng tắm
    expect(
      screen.getByText(/a lovely apartment with a great view./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/123-456-7890/i)).toBeInTheDocument();
    expect(screen.getByText(/landlord@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/còn trống/i)).toBeInTheDocument();

    expect(screen.getByRole("img")).toHaveAttribute("src", mockHouseData.image);
  });

  test("navigates to update page on edit button click", async () => {
    render(
      <MemoryRouter initialEntries={["/house/1"]}>
        <DetailHouse />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /cozy apartment/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /chỉnh sửa/i }));

    // Kiểm tra chuyển hướng
    expect(mockNavigate).toHaveBeenCalledWith("/house/update", {
      state: mockHouseData,
    });
  });
});
