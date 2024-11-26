type Props = {
  status: string;
};

export default function statusHoaDon({ status }: Props) {
  switch (status) {
    case "0":
      return "Đã hủy";
    case "1":
      return "Chờ xác nhận";
    case "2":
      return "Đã xác nhận";
    case "3":
      return "Đóng gói chờ vận chuyển";
    case "4":
      return "Đang giao hàng";
    case "5":
      return "Đã giao hàng";
    case "6":
      return "Hoàn thành";
    case "7":
      return "Hoàn đơn";
    default:
      return "";
  }
}
