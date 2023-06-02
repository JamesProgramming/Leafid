"use client";
import { useEffect, useState } from "react";
import "./linkList.scss";
import Link from "next/link";
import { ListBulletIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function LinkList({ parentId, linkState }) {
  const [linkList, setLinkList] = useState([]);
  const [pathname, setPathName] = useState("");
  const [isClosed, setIsClosed] = useState(true);

  useEffect(() => {
    let allHeaders = Array.from(document.querySelectorAll("h2, h3"));

    allHeaders = allHeaders.map((header) => {
      const id = header.innerText.split(" ").join("-");
      //Math.floor(Math.random() * 10000000000) + "" + Date.now() + "pageId";
      header.setAttribute("id", id);
      return { name: header.innerText, id, h3: header.nodeName === "H3" };
    });

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
