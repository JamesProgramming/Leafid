import Navbar from "@/app/_components/navBar";
import "@/app/_sass/layout/document.scss";
import LinkList from "@/app/_components/linkList";
import Form from "@/app/_components/form";
import Footer from "@/app/_components/footer";

function Section({ children, title }) {
  return (
    <section className="document__section">
      <div>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export const metadata = {
  title: "Settings",
};

export default async function Home() {
  return (
    <>
      <main>
        <Navbar />
        <div className="document">
          <aside className="document__aside">
            <LinkList />
          </aside>
          <div className="document__content">
            <div className="document__header">
              <h1>Settings</h1>
            </div>
            <Section title={"Security"}>
              <div className="document__subsection">
                <h3>Change password</h3>

                <Form
                  buttonName="Change password"
                  inputs={[
                    {
                      type: "password",
                      placeholder: "Current password",
                      name: "currentPassword",
                    },
                    {
                      type: "password",
                      placeholder: "New password",
                      name: "newPassword",
                    },
                    {
                      type: "password",
                      placeholder: "Comfirm password",
                      name: "confirmPassword",
                    },
                  ]}
                  action={{
                    url:
                      process.env.NEXT_PUBLIC_API +
                      "/api/v1/user/updatedPassword",
                    compare: ["newPassword", "confirmPassword"],
                    compareMessage: ["New password fields do not match"],
                  }}
                />
              </div>
            </Section>
            <Section title={"Theme"}>
              <div className="document__subsection">
                <h3>Color Theme</h3>
                <Form
                  inputs={[
                    {
                      type: "theme",
                      name: "theme",
                      options: [
                        "Light Mode",
                        "Dark mode",
                        "High contrast light mode",
                        "High contrast dark mode",
                      ],
                    },
                  ]}
                  action={{
                    url:
                      process.env.NEXT_PUBLIC_API + "/api/v1/user/changeTheme",
                  }}
                />
              </div>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
