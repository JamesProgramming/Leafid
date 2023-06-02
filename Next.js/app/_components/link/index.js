import "./link.scss";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

const linkStyle = {
  outline: "outline",
  underline: "underline",
  icon: "icon",
};

export default function CustomLink(props) {
  const { children, type, href, url, onClick } = props;

  let className = "";
  if (url && url === href) {
    className = "link--current";
  }

  if (type === linkStyle.icon) {
    return (
      <Link
        href={href}
        className={`link link--icon ${className}`}
        onClick={onClick}
      >
        <span>
          {children}
          <ArrowTopRightOnSquareIcon />
        </span>
      </Link>
    );
  }

  return (
    <Link href={href} className={`link ${className}`} onClick={onClick}>
      <span>{children}</span>
    </Link>
  );
}

export { linkStyle };
