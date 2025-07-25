import axios from "axios";
import {
  setUserSuccess,
  setUserLoading,
  setUserError,
  clearUserData,
} from "../reducer/loggedInUser";
import {
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  hasValidSession,
} from "../../contexts/auth";

// Action to handle user login
export const loginUser = (formdata) => async (dispatch) => {
  dispatch(setUserLoading(true));
  dispatch(setUserError(null));

  try {
    const response = await signinAPI(formdata);

    if (response.data.status) {
      const userData = response.data.data;

      // Store only token in cookies with 7-day expiry
      setAuthToken(userData.token);

      // Store the complete user data in Redux
      dispatch(setUserSuccess(userData));

      return { success: true, data: response.data };
    } else {
      dispatch(setUserError(response.data.message || "Login failed"));
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";
    dispatch(setUserError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setUserLoading(false));
  }
};

// Action to handle user logout
export const logoutUser =
  (token = null) =>
  async (dispatch) => {
    dispatch(setUserLoading(true));

    // Use provided token or get from cookies
    const authToken = token || getAuthToken();

    try {
      if (authToken) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`,
          {
            method: "POST",
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.status) {
          console.log("Logout successful:", data.message);
        } else {
          console.error("Logout failed:", data.message);
        }
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear both cookie and Redux state regardless of API success
      clearAuthToken();
      dispatch(clearUserData());
      dispatch(setUserLoading(false));
    }
  };

// Action to restore user session from cookies (on app start)
export const restoreSession = () => async (dispatch) => {
  // Simply check if token cookie exists
  if (hasValidSession()) {
    // Token exists, session is valid (cookie handles 7-day expiry)
    // Note: We don't have user data in Redux yet, but we know user is authenticated
    // The app can make an API call to get user data if needed, or rely on subsequent API calls
    console.log("Valid session found, user can proceed");
    return true;
  } else {
    // No token cookie, user needs to login
    console.log("No valid session, user needs to login");
    return false;
  }
};

// Action to set user data directly (for cases like token refresh)
export const setUser = (userData) => (dispatch) => {
  dispatch(setUserSuccess(userData));
};

// Action to clear user data
export const clearUser = () => (dispatch) => {
  clearAuthToken();
  dispatch(clearUserData());
};

// Signin API function
const signinAPI = async (formdata) => {
  try {
    let data = JSON.stringify({
      email_or_phone: formdata.emailOrPhone,
      password: formdata.password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/signin`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    return await axios.request(config);
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};
