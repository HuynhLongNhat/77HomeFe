/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import axios from "axios";
import DetailBuilding from "../components/owner/building/DetailBuilding";

// Giả lập axios
vi.mock("axios");

describe("DetailBuilding Component", () => {
  beforeEach(() => {
    // Mock dữ liệu trả về từ axios
    vi.spyOn(axios, "get").mockResolvedValue({
      data: {
        id: 1,
        name: "Building A",
        address: "456 Elm Street",
        region: "Central Area",
        area: 500,
        numberOfFloors: 10,
        yearBuilt: 2000,
        description: "Modern building with 10 floors.",
        longitude: "123.456",
        latitude: "78.910",
        ownerRepresent: "John Doe",
        status: "Available",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-12-14T00:00:00Z",
        createdBy: "Admin",
        avatar: "http://example.com/image.jpg"
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders building details correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/building/1"]}>
        <DetailBuilding />
      </MemoryRouter>
    );

    // Kiểm tra các chi tiết hiển thị
    expect(await screen.findByRole("heading", { name: /building a/i })).toBeInTheDocument();
    expect(screen.getByText(/456 elm street/i)).toBeInTheDocument();
    expect(screen.getByText(/modern building with 10 floors./i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument(); // Kiểm tra người đại diện
    expect(screen.getByText(/available/i)).toBeInTheDocument(); // Kiểm tra trạng thái
    expect(screen.getByText(/2000/i)).toBeInTheDocument(); // Kiểm tra năm xây dựng
    expect(screen.getByText(10)).toBeInTheDocument();
    // Kiểm tra số tầng
    

    // Kiểm tra diện tích
    expect(screen.getByText(/diện tích/i)).toBeInTheDocument();
    expect(screen.getByText(/500/i)).toBeInTheDocument();

    // Kiểm tra vùng
    expect(screen.getByText(/central area/i)).toBeInTheDocument();

    // Kiểm tra tọa độ
    expect(screen.getByText(/123.456/i)).toBeInTheDocument();
    expect(screen.getByText(/78.910/i)).toBeInTheDocument();

    // Kiểm tra người tạo
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });
});
