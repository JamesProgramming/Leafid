import Navbar from "@/app/_components/navBar";
import "@/app/_sass/pages/predictions.scss";

import Predictions from "./Predictions";
import Footer from "@/app/_components/footer";

export const metadata = {
  title: "Predictions",
};

export default function Home() {
  return (
    <>
      <main className="predictions">
        <Navbar />
        <Predictions />
      </main>
      <Footer />
    </>
  );
}
