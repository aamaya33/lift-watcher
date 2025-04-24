import { Stack } from "expo-router";


/*'Used to share UI between multiple routes such as injecting global providers, themes,
  styles, delay splash screen rendering until assets and fonts are loaded, or defining
  your app's root navigation structure.' - FROM EXPO DOCS
*/

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

