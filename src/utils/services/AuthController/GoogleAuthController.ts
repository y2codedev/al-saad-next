import {
  GoogleSignin,
  GoogleSigninButtonProps,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

class GoogleAuthController {
  static configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        "547060448284-3l6rvt82s58uu4uhmacrm7tb6ecq8c36.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }
  static async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut();
      }
      const userInfo = await GoogleSignin.signIn();
      return {
        success: true,
        data: userInfo,
      };
    } catch (error: any) {
      let message = "An error occurred during Google Sign-In.";
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        message = "User cancelled the login flow.";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        message = "Sign-in in progress.";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = "Google Play services not available or outdated.";
      } else {
        console.error(error);
      }
      return {
        success: false,
        message,
      };
    }
  }
}

export default GoogleAuthController;
