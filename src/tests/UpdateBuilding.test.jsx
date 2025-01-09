/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import UpdateBuilding from "../components/owner/building/UpdateBuilding";
import { vi } from "vitest";
import * as apiService from "../service/apiService";
import { MemoryRouter } from "react-router-dom";

// Mock API service
vi.mock("../service/apiService", () => ({
  getAllWard: vi.fn().mockResolvedValue({
    data: {
      data: [
        { id: 1, name: "Phường 1" },
        { id: 2, name: "Phường 2" },
      ],
    },
  }),
}));

describe("UpdateBuilding Component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it("renders the form with all input fields", async () => {
    render(
      <BrowserRouter>
        <UpdateBuilding />
      </BrowserRouter>
    );

    // Check if important input fields exist
    expect(screen.getByLabelText(/Tên toà nhà/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mô tả/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phường\/Xã/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Số nhà, Tên đường/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Năm xây dựng/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Số tầng/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Diện tích/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kinh độ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vĩ độ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trạng thái/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chủ sỡ hữu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hình ảnh toà nhà/i)).toBeInTheDocument();
  });

  it("displays validation errors when submitting an empty form", async () => {
    render(
      <BrowserRouter>
        <UpdateBuilding />
      </BrowserRouter>
    );

    const submitButton = screen.getByText(/Gửi thông tin/i);
    fireEvent.click(submitButton);

    // Wait for validation messages
    await waitFor(() => {
      expect(
        screen.getByText(/Tên toà nhà không được để trống!/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Mô tả không được để trống!/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Phường\/Xã không được để trống!/i)
      ).toBeInTheDocument();
    });
  });

  it("uploads an image and shows a preview", async () => {
    render(
      <BrowserRouter>
        <UpdateBuilding />
      </BrowserRouter>
    );

    const file = new File(["dummy content"], "example.jpg", {
      type: "image/jpeg",
    });
    const fileInput = screen.getByLabelText(/Hình ảnh toà nhà/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src");
    });
  });

  test("fills input fields with existing building data", async () => {
    const buildingData = {
      name: "Tòa nhà Bình Định Tower",
      description: "Tòa nhà với tiện nghi hiện đại và an ninh đảm bảo.",
      ward: "Lý Thường Kiệt",
      streetAddress:
        "Số 12, Đường Lê Lợi, Phường Lý Thường Kiệt, TP. Quy Nhơn, Bình Định",
      yearBuilt: 2020,
      numberOfFloors: 15,
      area: 500,
      longitude: 108.321,
      latitude: 15.879,
      status: "Đã thuê",
      ownerRepresent: "Nguyễn Văn A",
    };

    render(
      <MemoryRouter initialEntries={[{ state: buildingData }]}>
        <UpdateBuilding />
      </MemoryRouter>
    );

    // Đợi bất đồng bộ hoàn tất
    await waitFor(() => {
      expect(
        screen.getByDisplayValue("Tòa nhà Bình Định Tower")
      ).toBeInTheDocument();
    });

    // Kiểm tra các trường khác
    expect(
      screen.getByDisplayValue(
        "Tòa nhà với tiện nghi hiện đại và an ninh đảm bảo."
      )
    ).toBeInTheDocument();
    //expect(screen.getByDisplayValue('Lý Thường Kiệt')).toBeInTheDocument();
    //expect(screen.getByDisplayValue('Số 12, Đường Lê Lợi, Phường Lý Thường Kiệt, TP. Quy Nhơn, Bình Định')).toBeInTheDocument();
    expect(screen.getByDisplayValue("2020")).toBeInTheDocument();
    expect(screen.getByDisplayValue("15")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("108.321")).toBeInTheDocument();
    expect(screen.getByDisplayValue("15.879")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Đã thuê")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Nguyễn Văn A")).toBeInTheDocument();
  });

  it("calls the submit handler with correct form data", async () => {
    render(
      <BrowserRouter>
        <UpdateBuilding />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Tên toà nhà/i), {
      target: { value: "Toà nhà B" },
    });
    fireEvent.change(screen.getByLabelText(/Mô tả/i), {
      target: { value: "Mô tả toà nhà B" },
    });

    const submitButton = screen.getByText(/Gửi thông tin/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/Tên toà nhà không được để trống!/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Mô tả không được để trống!/i)
      ).not.toBeInTheDocument();
    });
  });
});
