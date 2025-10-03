import useAuthStore from "@/store/auth.store";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import "./global.css";

export default function RootLayout() {
  const {isLoading, fetchAuthenticatedUser} = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "Lexend-Bold": require('../assets/fonts/Lexend-Bold.ttf'),
    "Lexend-Medium": require('../assets/fonts/Lexend-Medium.ttf'),
    "Lexend-Regular": require('../assets/fonts/Lexend-Regular.ttf'),
    "Lexend-SemiBold": require('../assets/fonts/Lexend-SemiBold.ttf'),
    "Lexend-Light": require('../assets/fonts/Lexend-Light.ttf'),
  });

  useEffect(() => {
    if (error) console.error("Font yükleme hatası:", error);
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser()
  }, [])

  if (!fontsLoaded || isLoading) return null;

  return (  
    <>
    <StatusBar hidden={false} />
      <Stack>
        <Stack.Screen 
        name="(tabs)"
        options={{headerShown: false}}
        />

        <Stack.Screen 
        name="(auth)"
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