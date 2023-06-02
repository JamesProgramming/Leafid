import Image from "next/image";
import logo from "@/public/logo.svg";
import Signin from "@/app/_components/signin";
import "@/app/_sass/pages/signin.scss";

export default function Home() {
  return (
    <main className="signin">
      <section className="signin__component">
        <Signin />
      </section>
      <section className="signin__text">
        <div>
          <Image
            src={logo}
            alt="logo"
            width={130}
            height={130}
            loading="eager"
          />
          <h2>
            Leaf processing <br /> on the fly.
          </h2>
        </div>
      </section>
    </main>
  );
}
