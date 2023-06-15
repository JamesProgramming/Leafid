import Navbar from "../../_components/navBar";
import "../../_sass/pages/predictions.scss";

import Predictions from "./Predictions";
import Footer from "../../_components/footer";

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
