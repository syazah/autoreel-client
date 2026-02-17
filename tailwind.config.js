/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff",
        secondary: "#c15f3c",
        primaryDark: "#f4f3ee",
        tertiary: "#444",
      },
      fontFamily: {
        roboto: ["Roboto_400Regular"],
        "roboto-bold": ["Roboto_700Bold"],
        "roboto-medium": ["Roboto_500Medium"],
        "roboto-light": ["Roboto_300Light"],
        "roboto-thin": ["Roboto_100Thin"],
        "roboto-extralight": ["Roboto_200ExtraLight"],
        "roboto-semibold": ["Roboto_600SemiBold"],
        "roboto-black": ["Roboto_900Black"],
        "roboto-extrabold": ["Roboto_800ExtraBold"],
        "notoserif-thin": ["NotoSerif_100Thin"],
        "notoserif-extralight": ["NotoSerif_200ExtraLight"],
        "notoserif-light": ["NotoSerif_300Light"],
        "notoserif-regular": ["NotoSerif_400Regular"],
        "notoserif-medium": ["NotoSerif_500Medium"],
        "notoserif-semibold": ["NotoSerif_600SemiBold"],
        "notoserif-bold": ["NotoSerif_700Bold"],
        "notoserif-extrabold": ["NotoSerif_800ExtraBold"],
        "notoserif-black": ["NotoSerif_900Black"],
      },
    },
  },
  plugins: [],
}