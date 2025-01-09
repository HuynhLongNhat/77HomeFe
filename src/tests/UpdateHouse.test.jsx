/* eslint-disable no-undef */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { getAllWard } from "../service/apiService";
import UpdateHouse from "../components/owner/house/UpdateHouse";

// Mock API service
vi.mock("../service/apiService", () => ({
  getAllWard: vi.fn(),
}));

describe("UpdateHouse Component", () => {
  const mockWardData = [
    { id: 1, name: "Ward 1" },
    { id: 2, name: "Ward 2" },
  ];

  beforeEach(() => {
    // Mock dữ liệu trả về từ API
    getAllWard.mockResolvedValue({
      data: { data: mockWardData },
    });
  });

  it("renders the form with default values", async () => {
    render(
      <MemoryRouter>
        <UpdateHouse />
      </MemoryRouter>
    );

    expect(screen.getByText("Chỉnh sửa nhà trọ")).toBeInTheDocument();

    // Kiểm tra các trường trong form
    expect(screen.getByLabelText("Tên nhà trọ")).toBeInTheDocument();
    expect(screen.getByLabelText("Mô tả")).toBeInTheDocument();
    expect(screen.getByLabelText("Phường/Xã")).toBeInTheDocument();
    expect(screen.getByLabelText("Số nhà, Tên đường")).toBeInTheDocument();
    expect(screen.getByLabelText("Giá thuê")).toBeInTheDocument();
    expect(screen.getByLabelText("Diện tích (m²)")).toBeInTheDocument();

    // Kiểm tra xem các options Phường/Xã có được tải lên không
    await waitFor(() => {
      mockWardData.forEach((ward) =>
        expect(screen.getByText(ward.name)).toBeInTheDocument()
      );
    });
  });

  it("displays validation errors for required fields", async () => {
    render(
      <MemoryRouter>
        <UpdateHouse />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", { name: /gửi thông tin/i }); // Update button name here
    fireEvent.click(submitButton);

    // Kiểm tra các lỗi validation hiển thị khi không điền thông tin
    await waitFor(() => {
      expect(
        screen.getByText("Tên nhà trọ không được để trống!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Mô tả không được để trống!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Phường/Xã không được để trống!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Số nhà, Tên đường không được để trống!")
      ).toBeInTheDocument();
    });
  });

  it("handles form submission with valid data", async () => {
    render(
      <MemoryRouter>
        <UpdateHouse />
      </MemoryRouter>
    );

    // Điền thông tin vào form
    fireEvent.change(screen.getByLabelText("Tên nhà trọ"), {
      target: { value: "Căn hộ hiện đại" },
    });
    fireEvent.change(screen.getByLabelText("Mô tả"), {
      target: { value: "Căn hộ tiện nghi gần trung tâm" },
    });
    fireEvent.change(screen.getByLabelText("Phường/Xã"), {
      target: { value: "Ward 1" },
    });
    fireEvent.change(screen.getByLabelText("Số nhà, Tên đường"), {
      target: { value: "123 Đường ABC" },
    });
    fireEvent.change(screen.getByLabelText("Giá thuê"), {
      target: { value: "5000000" },
    });
    fireEvent.change(screen.getByLabelText("Diện tích (m²)"), {
      target: { value: "50" },
    });

    // Use the correct button name (Gửi thông tin)
    const submitButton = screen.getByRole("button", { name: /gửi thông tin/i });
    fireEvent.click(submitButton);

    // Kiểm tra xem lỗi validation có được loại bỏ khi điền đầy đủ thông tin không
    await waitFor(() => {
      expect(
        screen.queryByText(/không được để trống!/i)
      ).not.toBeInTheDocument();
    });
  });

  it("renders file input previews for uploaded images", async () => {
    render(
      <MemoryRouter>
        <UpdateHouse />
      </MemoryRouter>
    );

    const fileInput = screen.getByLabelText("Hình ảnh nhà trọ");
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const imagePreview = screen.getByAltText("Property preview");
      expect(imagePreview).toBeInTheDocument();
      expect(imagePreview).toHaveAttribute(
        "src",
        expect.stringContaining("data:image/png;base64")
      );
    });
  });
});
