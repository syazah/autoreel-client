import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "99320420058-sniobca75ssbd1j2r3b54f1s8pvj5esi.apps.googleusercontent.com",
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;

    if (!idToken) {
      throw new Error("No ID token returned");
    }

    return idToken;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("User cancelled sign-in");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Sign-in already in progress");
    } else {
      console.error("Google sign-in error:", error);
    }
    throw error;
  }
}
