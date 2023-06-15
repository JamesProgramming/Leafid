import Link, { LinkStyle } from "../_components/link";
import Webcam from "../_components/webcam";
import UploadForm from "../_components/uploadForm";
import NavBar from "../_components/navBar";
import "../_sass/pages/dashboard.scss";
import Modal from "../_components/modal";
import Footer from "../_components/footer";

export const metadata = {
  title: "Dashboard",
};

export default function Home() {
  return (
    <>
      <main className="dashboard">
        <NavBar />
        <div className="dashboard__content">
          <h1 className="dashboard__header">Dashboard</h1>
          <div>
            <section className="dashboard__info">
              <h2>Leaf health checker</h2>
              <p className="paragraph">
                This app will detect if your plant has a common disease or is
                healthy. You can upload an image of your plant leaf or use the
                web app to take a picture.
              </p>
            </section>
            <section className="dashboard__info">
              <h2>Links</h2>
              <p className="paragraph">
                The following link contains a list of plant leaves and diseases
                this model is optimized to detect:
              </p>
              <ul>
                <li>
                  <Link
                    href="dashboard/model-info#Dataset-categories"
                    type={LinkStyle.icon}
                  >
                    Diseases and plants list
                  </Link>
                </li>
                <li>
                  <Link
                    href="dashboard/model-info#Charts"
                    type={LinkStyle.icon}
                  >
                    Charts of model training results
                  </Link>
                </li>
              </ul>
            </section>
          </div>

          <section className="dashboard__buttons">
            <div className="dashboard__button">
              <Modal name="Use Camera">
                <Webcam />
              </Modal>
            </div>
            <div className="dashboard__button">
              <Modal name="Upload Image">
                <UploadForm />
              </Modal>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
