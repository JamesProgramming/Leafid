import "./link.scss";
import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { MouseEventHandler } from "react";

enum LinkStyle {
  "outline",
  "underline",
  "icon",
}

interface Props {
  children: JSX.Element | string;
  type?: LinkStyle;
  href: string;
  url?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

// Parameters type enforement is done by typescript
/**
 * Creates a custom link.
 * @param {*} props Given by react.
 * @param {*} props.children Link text
 * @param {*} props.type A preset link style.
 * @param {*} props.href Passed to the `a` element's `href` prop.
 * @param {*} props.url Current page pathname. Used to determine if the link is pointing to the current page.
 * @param {*} props.onClick Passed to the `a` element's `onClick` prop.
 */
export default function CustomLink(props: Props) {
  const { children, type, href, url, onClick } = props;

  let className = "";
  if (url && url === href) {
    className = "link--current";
  }

  if (type === LinkStyle.icon) {
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

export { LinkStyle };
