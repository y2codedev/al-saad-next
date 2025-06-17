import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
} from "react-native-fbsdk-next";
import { Platform } from "react-native";

class FacebookAuthController {
  static async signInWithFacebook() {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        return {
          success: false,
          message: "User cancelled the login flow.",
        };
      }

      let accessToken;
      if (Platform.OS === "ios") {
        const authTokenResult =
          await AuthenticationToken.getAuthenticationTokenIOS();
        accessToken = authTokenResult?.authenticationToken;
      } else {
        const accessTokenResult = await AccessToken.getCurrentAccessToken();
        accessToken = accessTokenResult?.accessToken;
      }

      if (!accessToken) {
        return {
          success: false,
          message: "Failed to obtain access token.",
        };
      }

      const userData =
        await FacebookAuthController.fetchFacebookUserData(accessToken);

      if (!userData) {
        return {
          success: false,
          message: "Failed to fetch user data.",
        };
      }

      return {
        success: true,
        data: {
          user: userData,
          accessToken: accessToken,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "An error occurred during Facebook Sign-In.",
      };
    }
  }

  static async fetchFacebookUserData(accessToken: string) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`,
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data;
    } catch (error) {
      console.error("Error fetching user data: ", error);
      return null;
    }
  }
}

export default FacebookAuthController;
