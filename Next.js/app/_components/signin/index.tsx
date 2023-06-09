"use client";
import Image from "next/image";
import fullLogo from "../../../public/fullLogo.svg";
import { useEffect, useRef, useState } from "react";
import Button from "../button";
import "./sign-in.scss";
import { AuthSignin } from "../utils/auth";
import Loading from "../loading";
import axios, { AxiosResponse } from "axios";
import { MouseEventHandler } from "react";
/**
 * Signin form.
 */
function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const employeeId = useRef<HTMLInputElement>();
  const password = useRef<HTMLInputElement>();

  const loginButton: MouseEventHandler<HTMLButtonElement> = async function (e) {
    e.preventDefault();
    setIsLoading(true);

    if (await AuthSignin(password.current.value, employeeId.current.value)) {
      window.location.replace("/dashboard");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      let loggedIn: AxiosResponse;
      try {
        loggedIn = await axios.post(
          process.env.NEXT_PUBLIC_API + "/api/v1/user/auth",
          {},
          { withCredentials: true }
        );
      } catch (e) {
        return;
      }

      if (loggedIn.status === 200) {
        window.location.replace("/dashboard");
      }
    })();
  }, []);

  return (
    <div className="sign-in">
      <div>
        {isLoading && <Loading size={"small"} />}
        <div>
          <Image
            src={fullLogo}
            width={140}
            alt="Leaf Id logo"
            loading="eager"
          />
        </div>

        <h1 className="sign-in__header">Sign in</h1>
        <form method="post" className="sign-in__form">
          <input
            type="text"
            name="employeeId"
            ref={employeeId}
            placeholder="Employee ID"
            aria-label="Employee ID"
          />
          <input
            type="password"
            name="password"
            ref={password}
            placeholder="Password"
            aria-label="Password"
          />
          <div className="sign-in__button">
            <Button type="submit" onClick={loginButton}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
