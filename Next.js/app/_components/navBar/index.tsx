"use client";
import "./navbar.scss";
import Image from "next/image";
import CustomLink, { LinkStyle } from "../link";
import fullLogo from "../../../public/fullLogo.svg";
import fullLogoDark from "../../../public/fullLogoDark.svg";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { customAlert } from "../alert";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

/**
 * Navbar for the website.
 */
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
      let results: AxiosResponse;
      try {
        results = await axios.get(
          process.env.NEXT_PUBLIC_API + "/api/v1/user/",
          { withCredentials: true }
        );
      } catch (e) {
        customAlert(e.message);
      }

      const resultsData = results.data.data;
      setEmployeeId(resultsData.employeeId);
      setIsAdmin(resultsData.role === "admin");
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
        {/* Mobile view */}
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
                  type={LinkStyle.underline}
                  url={page}
                >
                  Admin
                </CustomLink>
              )}
            </li>
            <li>
              <CustomLink
                href="/dashboard"
                type={LinkStyle.underline}
                url={page}
              >
                Dashboard
              </CustomLink>
            </li>
            <li>
              <CustomLink
                href="/dashboard/predictions"
                type={LinkStyle.underline}
                url={page}
              >
                Predictions
              </CustomLink>
            </li>
            <li>
              <CustomLink
                href="/dashboard/model-info"
                type={LinkStyle.underline}
                url={page}
              >
                Model Info
              </CustomLink>
            </li>
            <li>
              <CustomLink
                href="/dashboard/settings"
                type={LinkStyle.underline}
                url={page}
              >
                Settings
              </CustomLink>
            </li>
            <li>
              <CustomLink
                type={LinkStyle.underline}
                href="/signin"
                onClick={async () => {
                  try {
                    await axios.post(
                      process.env.NEXT_PUBLIC_API + "/api/v1/user/signout",
                      {},
                      { withCredentials: true }
                    );
                  } catch (e) {
                    customAlert(e.message);
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
