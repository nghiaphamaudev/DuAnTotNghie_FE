import numeral from "numeral";

type Props = {
  money: string;
};

export default function formatCurrency({ money }: Props) {
  return numeral(money).format("0,0") + " ₫";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatPrice = (val: any) => {
  if (!val) return 0;

  return val.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};
