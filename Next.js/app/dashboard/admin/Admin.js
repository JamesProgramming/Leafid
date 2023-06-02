"use client";
import Navbar from "@/app/_components/navBar";
import "@/app/_sass/layout/document.scss";
import "@/app/_sass/pages/admin.scss";
import LinkList from "@/app/_components/linkList";
import Form from "@/app/_components/form";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "@/app/_components/modal";
import Message from "@/app/_components/message";

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

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState("");

  const getAllUsers = async function () {
    let result;
    try {
      result = await axios.post(
        process.env.NEXT_PUBLIC_API + "/api/v1/user/getAllUsers",
        {},
        { withCredentials: true }
      );
    } catch (e) {
      return;
    }

    if (result?.status === 200) setUsers(result.data.data.users);
  };

  useEffect(() => {
    (async () => {
      let results = null;
      try {
        results = await axios.get(
          process.env.NEXT_PUBLIC_API + "/api/v1/user/",
          { withCredentials: true }
        );
      } catch (e) {
        return;
      }

      if (results?.status === 200 && results.data.data.role === "admin")
        setIsAdmin(true);
      getAllUsers();
    })();
  }, []);

  if (!isAdmin) {
    return <Message>You are not authorized here.</Message>;
  }

  return (
    <main>
      <Navbar />
      <div className="document">
        <aside className="document__aside">
          <LinkList linkState={users} />
        </aside>
        <div className="document__content">
          <div className="document__header">
            <h1>Manage</h1>
          </div>

          <Section title={"Create"}>
            <div className="document__subsection">
              <h3>Add user</h3>

              <Form
                inputs={[
                  {
                    type: "text",
                    name: "name",
                    placeholder: "Name",
                  },
                  {
                    type: "number",
                    name: "employeeId",
                    placeholder: "Employee ID",
                  },
                  {
                    type: "select",
                    name: "role",
                    options: ["admin", "user"],
                  },
                  {
                    type: "password",
                    name: "password",
                    placeholder: "New password",
                  },
                  {
                    type: "password",
                    name: "confirmPassword",
                    placeholder: "Confirm password",
                  },
                ]}
                buttonName={"Create user"}
                action={{
                  url: process.env.NEXT_PUBLIC_API + "/api/v1/user/create",
                  compare: ["password", "confirmPassword"],
                  compareMessage: ["New password fields do not match"],
                  cleaner: () => {
                    getAllUsers();
                  },
                }}
              />
            </div>
          </Section>

          <Section title={"Manage users"}>
            {users &&
              users.map((user, i) => {
                return (
                  <div key={i} className="admin__user">
                    <h3>
                      {`${user.name} - ${user.employeeId} (${user.role})`}
                    </h3>
                    <div className="admin__model-container">
                      <Modal name="Update">
                        <div className="admin__model">
                          <h4>
                            {`${user.name} - ${user.employeeId} (${user.role})`}
                          </h4>
                          <p>
                            Note: Leave field blank if you do not want its value
                            update.
                          </p>
                          <Form
                            inputs={[
                              {
                                type: "hidden",
                                name: "employeeId",
                                value: user.employeeId,
                              },
                              {
                                type: "text",
                                name: "name",
                                placeholder: `Name (${user.name})`,
                              },
                              {
                                type: "text",
                                name: "newEmployeeId",
                                placeholder: `Employee ID (${user.employeeId})`,
                              },
                              {
                                type: "password",
                                name: "newPassword",
                                placeholder: "New password",
                              },
                              {
                                type: "password",
                                name: "confirmPassword",
                                placeholder: "Confirm password",
                              },
                            ]}
                            buttonName={"Update"}
                            action={{
                              url:
                                process.env.NEXT_PUBLIC_API +
                                "/api/v1/user/update",
                              compare: ["newPassword", "confirmPassword"],
                              compareMessage: [
                                "New password fields do not match",
                              ],
                              cleaner: () => {
                                getAllUsers();
                              },
                            }}
                          />
                        </div>
                      </Modal>

                      <Modal name="Remove">
                        <div className="admin__model">
                          <h4>
                            {`${user.name} - ${user.employeeId} (${user.role})`}
                          </h4>
                          <Form
                            inputs={[
                              {
                                type: "hidden",
                                name: "employeeId",
                                value: user.employeeId,
                              },
                              {
                                type: "password",
                                name: "password",
                                placeholder: "Admin password",
                              },
                            ]}
                            buttonName={"Remove"}
                            action={{
                              url:
                                process.env.NEXT_PUBLIC_API +
                                "/api/v1/user/remove",
                              cleaner: () => {
                                getAllUsers();
                              },
                            }}
                          />
                        </div>
                      </Modal>
                    </div>
                  </div>
                );
              })}
          </Section>
        </div>
      </div>
    </main>
  );
}
