"use client";
import { useEffect, useState } from "react";
import "./linkList.scss";
import Link from "next/link";
import { ListBulletIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface Props {
  linkState?: string | boolean | number;
}

/**
 * This creates a list of links to all the h1 and h2 elements in the current page.
 * @param props Given by react.
 * @param props.linkState A variable that changes when the list should be refreshed.
 */
export default function LinkList(linkState: Props) {
  const [linkList, setLinkList] = useState([]);
  const [pathname, setPathName] = useState("");
  const [isClosed, setIsClosed] = useState(true);

  useEffect(() => {
    const allHeaderElements = Array.from(document.querySelectorAll("h2, h3"));

    const allHeaders = allHeaderElements.map((header: HTMLElement) => {
      const id = header.innerText.split(" ").join("-");
      header.setAttribute("id", id);
      return { name: header.innerText, id, h3: header.nodeName === "H3" };
    });

    // Mobile view
    const closeMenu = (e) => {
      if (e.target.closest("aside")) return;
      setIsClosed(true);
    };
    window.addEventListener("click", closeMenu);
    window.addEventListener("touchstart", closeMenu);

    setPathName(window.location.pathname);
    setLinkList(allHeaders);

    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("touchstart", closeMenu);
    };
  }, [linkState]);

  return (
    <div className={`linkList-container ${isClosed ? "linkList-closed" : ""}`}>
      <div className="linkList-button-container">
        <button onClick={() => setIsClosed(!isClosed)}>
          <ListBulletIcon title="open menu" />
          <XMarkIcon title="close menu" />
        </button>
      </div>
      {linkList.map((elementObject, i) => {
        return (
          <Link
            key={i}
            className={`${
              !elementObject.h3 ? "linkList-header3" : ""
            } linkList`}
            href={`${pathname}#${elementObject.id}`}
            onClick={() => setIsClosed(true)}
          >
            <span>{elementObject.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
