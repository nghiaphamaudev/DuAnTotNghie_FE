import Breadcrumb from "antd/lib/breadcrumb";
import Typography from "antd/lib/typography";
import { Link } from "react-router-dom";

type Props = {
  listLink: { link?: string; name: string }[];
  nameHere: string;
};

export default function BreadcrumbsCustom({ listLink, nameHere }: Props) {
  let items: { key: string; title: React.ReactNode }[] = [];

  if (Array.isArray(listLink)) {
    items = listLink.map((e, index) => ({
      key: `listLink${index + 1}`,
      title: e.link ? (
        <Link
          to={e.link}
          style={{
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "calc(1.2rem + 0.15vw)",
            color: "black",
          }}
        >
          {e.name}
        </Link>
      ) : (
        <Typography.Text
          strong
          style={{
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "calc(1.2rem + 0.15vw)",
            color: "black",
          }}
        >
          {e.name}
        </Typography.Text>
      ),
    }));
  }

  items.push({
    key: "listLink0",
    title: (
      <Typography.Text
        strong
        style={{
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "calc(1.2rem + 0.15vw)",
          color: "black",
        }}
      >
        {nameHere}
      </Typography.Text>
    ),
  });

  return (
    <Breadcrumb separator="/" style={{ marginBottom: "8px" }} items={items} />
  );
}
