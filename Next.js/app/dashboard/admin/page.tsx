import Admin from "./Admin";
import Footer from "../../_components/footer";

export const metadata = {
  title: "Admin",
};

export default async function Home() {
  return (
    <>
      <Admin />
      <Footer />
    </>
  );
}
