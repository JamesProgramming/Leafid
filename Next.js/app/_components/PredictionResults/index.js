import "./predictionResults.scss";

export default function PredictionResults({ results }) {
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
