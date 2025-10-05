import { icons } from '@/constants/icons'
import { account } from '@/services/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { Alert, Image, Text, View } from 'react-native'

const profile = () => {

  const { user , setUser, setIsAuthenticated, isLoading, setLoading} = useAuthStore();

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await account.deleteSession("current");
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      Alert.alert("Output Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View className='bg-primary flex-1 px-10'>
      <View className='flex justify-center items-center flex-1 flex-col gap-5'>
        <Image 
          source={icons.person}
          className='size-10'
          tintColor="#fff"
        />
        <Text className='text-gray-500 text-base font-lexend-bold'>Profile</Text>
      </View>
    </View>
  )
}

export default profile