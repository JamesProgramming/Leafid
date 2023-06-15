import axios, { AxiosResponse } from "axios";
import { SetStateAction, Dispatch } from "react";
import { Results } from "../PredictionResults";
/**
 * Get prediction results for an image from the API.
 * @param url Url to send data to.
 * @param data Base64String convertion of the image.
 * @param resultStateSetter A react callback to
 * @returns
 */
export default async function (
  url: string,
  data: string,
  resultStateSetter: Dispatch<SetStateAction<Results[]>>
) {
  let results: AxiosResponse;
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
