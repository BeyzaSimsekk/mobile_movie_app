import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "./global.css";

export default function RootLayout() {

  const [fontsLoaded, error] = useFonts({
    "Lexend-Bold": require('../assets/fonts/Lexend-Bold.ttf'),
    "Lexend-Medium": require('../assets/fonts/Lexend-Medium.ttf'),
    "Lexend-Regular": require('../assets/fonts/Lexend-Regular.ttf'),
    "Lexend-SemiBold": require('../assets/fonts/Lexend-SemiBold.ttf'),
    "Lexend-Light": require('../assets/fonts/Lexend-Light.ttf'),
  });

  return (  
    <>
    <StatusBar hidden={false} />
      <Stack>
        <Stack.Screen 
        name="(tabs)"
        options={{headerShown: false}}
        />

        <Stack.Screen
        name="movies/[id]"
        options={{headerShown: false}}
        />
      </Stack>
    </>
  );
}

/****
 * Her yerde status bar görünmesin istersen;
 * <>
 * <StatusBar hidden={true} />
 * <Stack>
 *   <Stack.Screen 
 *   name="(tabs)"
 *   options={{headerShown: false}}
 *   />
 * 
 *   <Stack.Screen
 *   name="movies/[id]"
 *   options={{headerShown: false}}
 *   />
 * </Stack>
 * </>
 * 
 */