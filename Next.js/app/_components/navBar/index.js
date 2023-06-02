"use client";
import "./navbar.scss";
import Image from "next/image";
import CustomLink, { linkStyle } from "../link";
import fullLogo from "@/public/fullLogo.svg";
import fullLogoDark from "@/public/fullLogoDark.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { alert } from "../alert";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Narbar() {
  const [page, setPage] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClosed, setIsClosed] = useState(true);

  useEffect(() => {
    setPage(window.location.pathname);
  }, []);

  useEffect(() => {
    (async () => {
      let results;
      try {
        results = await axios.get(
          process.env.NEXT_PUBLIC_API + "/api/v1/user/",
          { withCredentials: true }
        );
      } catch (e) {
        alert(e.message);
      }

      results = results.data.data;
      setEmployeeId(results.employeeId);
      setIsAdmin(results.role === "admin");
    })();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link href="/dashboard">
          <Image
            src={fullLogo}
            width={110}
            alt="Leaf Id logo"
            className="show-light-mode"
          />
          <Image
            src={fullLogoDark}
            width={110}
            alt="Leaf Id logo"
            className="show-dark-mode"
          />
        </Link>
        <button
          onClick={() => setIsClosed(false)}
          className="navBar__hamburger"
        >
          <Bars3Icon title="hamburger icon" />
        </button>

        <div className={`navbar__nav ${isClosed ? "navBar--closed" : ""}`}>
          <span
            onTouchStart={() => setIsClosed(true)}
            onClick={() => setIsClosed(true)}
            className="navBar__menu-cover"
          ></span>
          <button onClick={() => setIsClosed(true)}>
            <XMarkIcon />
          </button>
          <ul className="navbar__links">
            <li>
              {isAdmin && (
                <CustomLink
                  href="/dashboard/admin"
                  type={linkStyle.underline}
                  url={page}
                >
                  Admin
                </CustomLink>
              )}
            </li>
            <li>
              <CustomLink
                href="/dashboard"
                type={linkStyle.underline}
                url={page}
              >
                Dashboard
              </CustomLink>
            </li>
            <li>
              <CustomLink
                href="/dashboard/predictions"
                type={linkStyle.underline}
                url={page}
              >
                Predictions
              </CustomLink>
            </li>
            <li>
              <CustomLink
                href="/dashboard/model-info"
                type={linkStyle.underline}
                url={page}
              >
                Model Info
              </CustomLink>
            </li>
            <li>
              <CustomLink
                href="/dashboard/settings"
                type={linkStyle.underline}
                url={page}
              >
                Settings
              </CustomLink>
            </li>
            <li>
              <CustomLink
                type={linkStyle.underline}
                href="/signin"
                onClick={async () => {
                  try {
                    await axios.post(
                      process.env.NEXT_PUBLIC_API + "/api/v1/user/signout",
                      {},
                      { withCredentials: true }
                    );
                  } catch (e) {
                    alert(e.message);
                  }
                }}
              >
                Sign Out
              </CustomLink>
            </li>

            <li className="navbar__employee-id">Hi, {employeeId}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
