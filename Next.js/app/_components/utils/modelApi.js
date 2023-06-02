import axios from "axios";

export default async function (url, data, resultStateSetter) {
  let results;
  try {
    results = await axios.post(
      url,
      { data: { image: data } },
      { withCredentials: true }
    );
  } catch (e) {
    return;
  }

  resultStateSetter(results.data.data.predictions);
}
