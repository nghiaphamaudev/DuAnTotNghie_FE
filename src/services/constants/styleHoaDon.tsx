type Props = {
  status: string;
};
export default function styleHoaDon({ status }: Props) {
  switch (status) {
    case "0":
      return "chip-da-huy";
    case "1":
      return "chip-cho-xac-nhan";
    case "2":
      return "chip-da-xac-nhan";
    case "3":
      return "chip-dang-van-chuyen";
    case "4":
      return "chip-giao-hang";
    case "5":
      return "chip-da-giao-hang";
    case "6":
      return "chip-hoan-thanh";
    case "7":
      return "chip-da-thanh-toan";
    default:
      return "";
  }
}
