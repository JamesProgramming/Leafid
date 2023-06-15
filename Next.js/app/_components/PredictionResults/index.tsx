import "./predictionResults.scss";

export interface Results {
  name: string;
  percent: string;
}

interface Props {
  results: Results[];
}

// Parameters type enforement is done by typescript
/**
 * Displays the results of the a leaf prediction done by the API.
 * @param {*} props Given by react.
 * @param {*} props.results Image prediction results from API.
 */
export default function PredictionResults({ results }: Props) {
  return (
    <section className="predictionResults">
      <div className="predictionResults__header">
        <h2 className="fsm cbk">Prediction</h2>
        <h2 className="fss fwr cbk">(Confidence %)</h2>
      </div>

      {results.map((result, i) => {
        return (
          <div className="predictionResults__results" key={i}>
            <p>{result.name}</p>
            <p>{String(result.percent).slice(0, 4)}%</p>
          </div>
        );
      })}
    </section>
  );
}
