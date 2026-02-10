/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#222222",
        secondary: "#008BFF",
        light: "#FAF3E1",
        tertiary: "#F5E7C6",
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
      },
    },
  },
  plugins: [],
}