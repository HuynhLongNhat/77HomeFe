/* eslint-disable no-undef */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import DeleteHouse from "../components/owner/house/DeleteHouse";

// Mock the deleteHouse API or function
vi.mock("../service/apiService", () => ({
  deleteHouse: vi.fn(),
}));

describe("DeleteHouse Component", () => {
  const handleClose = vi.fn();
  const deleteHouse = vi.fn();
  const houseData = { id: 1, name: "Căn hộ hiện đại" };

  beforeEach(() => {
    render(
      <DeleteHouse
        show={true}
        handleClose={handleClose}
        houseData={houseData}
        deleteHouse={deleteHouse}
      />
    );
  });

  it("renders the modal with correct content", () => {
    expect(screen.getByText("Xác nhận xóa nhà trọ!")).toBeInTheDocument();
    expect(
      screen.getByText("Bạn có chắc chắn muốn thực hiện thao tác này không ?")
    ).toBeInTheDocument();
    expect(screen.getByText("Đóng")).toBeInTheDocument();
    expect(screen.getByText("Xác nhận")).toBeInTheDocument();
  });

  it("should call handleClose when 'Đóng' button is clicked", () => {
    const closeButton = screen.getByText("Đóng");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  //   it("should call deleteHouse when 'Xác nhận' button is clicked", async () => {
  //     const deleteHouse = vi.fn(); // Mock deleteHouse function
  //     const houseData = { id: 123 }; // Mock dữ liệu nhà trọ

  //     render(
  //       <DeleteHouse
  //         show={true}
  //         handleClose={handleClose}
  //         houseData={houseData}
  //         deleteHouse={deleteHouse}
  //       />
  //     );

  //     // Lấy nút "Xác nhận" thông qua vai trò button và tên
  //     const confirmButton = screen.getAllByRole("button", {
  //       name: /Xác nhận/i,
  //     })[0]; // Lấy button đầu tiên
  //     expect(confirmButton).toBeInTheDocument();
  //     fireEvent.click(confirmButton);

  //     // Click vào nút "Xác nhận"
  //     fireEvent.click(confirmButton);

  //     // Kiểm tra xem deleteHouse có được gọi không
  //     await waitFor(() => {
  //       expect(deleteHouse).toHaveBeenCalledTimes(1);
  //       expect(deleteHouse).toHaveBeenCalledWith(houseData.id);
  //     });
  //   });
});
