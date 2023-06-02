import CustomChart from "@/app/_components/customChart";
import Navbar from "@/app/_components/navBar";
import "@/app/_sass/layout/document.scss";
import LinkList from "@/app/_components/linkList";
import Footer from "@/app/_components/footer";

async function getChartInfo() {
  const info = await fetch(process.env.NEXT_PUBLIC_API + "/api/v1/model/", {
    next: { revalidatee: 3600 },
  });
  return info.json();
}

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
  title: "Model info",
};

export default async function Home() {
  const data = await getChartInfo();

  const category = data.data.image_stats.category;

  const category_labels = category.map((cate) => cate.name);
  const category_data = category.map((cate) => {
    return cate.diseases.reduce((total, current) => total + current.number, 0);
  });

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
              <h1>Model Info</h1>
            </div>
            <Section title={"Test results"}>
              <div className="document__subsection">
                <h3>Test accuracy</h3>
                <p className="paragraph">
                  {`${
                    parseFloat(data.data.test_results.results.accuracy) * 100
                  }`.slice(0, 4) + "%"}
                </p>
              </div>
            </Section>
            <Section title={"Charts"}>
              <div className="document__subsection">
                <h3>Number of images in dataset by plant</h3>
                <CustomChart
                  datasets={[
                    {
                      data: Array.from(category_data),
                      label: "Image Count by Plant",
                    },
                  ]}
                  type={"bar"}
                  labels={Array.from(category_labels)}
                  x="plant"
                  y="number of images"
                />
              </div>
              <div className="document__subsection">
                <h3>Model test and training acurracy</h3>
                <CustomChart
                  datasets={[
                    {
                      label: "Training accuracy",
                      data: Object.values(data.data.training_stats.accuracy),
                    },
                    {
                      label: "Validation accuracy",
                      data: Object.values(
                        data.data.training_stats.val_accuracy
                      ),
                    },
                  ]}
                  type={"line"}
                  labels={Object.keys(data.data.training_stats.accuracy)}
                  x="epoch"
                  y="accuracy"
                />
              </div>
              <div className="document__subsection">
                <h3>
                  Model test and training loss (categorical cross entropy)
                </h3>
                <CustomChart
                  datasets={[
                    {
                      label: "Training loss",
                      data: Object.values(data.data.training_stats.loss),
                    },
                    {
                      label: "Validation loss",
                      data: Object.values(data.data.training_stats.val_loss),
                    },
                  ]}
                  type={"line"}
                  labels={Object.keys(data.data.training_stats.accuracy)}
                  x="epoch"
                  y="loss"
                />
              </div>
            </Section>
            <Section title={"Dataset categories"}>
              {category.map((cate, i) => {
                return (
                  <div
                    key={i}
                    className="document__subsection"
                    style={{ maxWidth: 500 }}
                  >
                    <h3>{cate.name}</h3>
                    <ul>
                      {cate.diseases.map((disease, i) => {
                        return (
                          <li className="paragraph" key={i}>
                            {disease.name}
                          </li>
                        );
                      })}
                    </ul>
                    <CustomChart
                      datasets={[
                        {
                          label: "Number of images",
                          data: cate.diseases.map((obj) => obj.number),
                        },
                      ]}
                      type={"pie"}
                      labels={cate.diseases.map((obj) => obj.name)}
                    />
                  </div>
                );
              })}
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
