import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

GoogleSignin.configure({
  webClientId:
    "99320420058-sniobca75ssbd1j2r3b54f1s8pvj5esi.apps.googleusercontent.com",
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    const googleIdToken = response.data?.idToken;

    if (!googleIdToken) {
      throw new Error("No ID token returned from Google");
    }

    const googleCredential = auth.GoogleAuthProvider.credential(googleIdToken);
    const firebaseUser = await auth().signInWithCredential(googleCredential);

    const firebaseIdToken = await firebaseUser.user.getIdToken();

    return firebaseIdToken;
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
