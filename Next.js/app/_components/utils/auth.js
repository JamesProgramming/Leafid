import axios from "axios";
import { customAlert } from "../alert";

async function AuthSignin(password, employeeId) {
  let results;
  try {
    results = await axios.post(
      process.env.NEXT_PUBLIC_API + "/api/v1/user/signin",
      {
        data: { password: password, employeeId: employeeId },
      },
      { withCredentials: true }
    );
  } catch (e) {
    if (e.response) {
      customAlert(e.response.data.data.message);
      return false;
    }
    customAlert(e.message);
    return false;
  }

  if (results.status === 200) {
    return true;
  }

  customAlert(results.data.data.message);
  return false;
}

export { AuthSignin };
