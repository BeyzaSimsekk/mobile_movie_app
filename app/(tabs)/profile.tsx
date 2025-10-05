import { account } from '@/services/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { ActivityIndicator, Alert, Image, Text, View } from 'react-native'

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

  if(isLoading) {
    return (
      <View className='profile-ifs'>
        <ActivityIndicator size='large' color="#AB8BFF"/>
        <Text className='base-regular text-light-100 mt-3'>Loading...</Text>
      </View>
    );
  }

  // eğer kullanıcı yoksa diye kontrol
  if(!user) {
    return (
      <View className='profile-ifs'>
        <Text className='text-base text-accent font-lexend-semibold'>Failed to load profile info.</Text>
      </View>
    )
  }

  const avatarUrl = 
    user.avatar && user.avatar.startsWith("http")
    ? user.avatar 
    : `https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(user.name || "U")}`;

  return (
    <View className='bg-primary flex-1 px-6'>
      {/* Profile Header */}
      <View className='items-center mt-16 mb-8'>
        <Image 
        source={{uri: avatarUrl}}
        className='profile-avatar'
        />
      </View>
    </View>
  )
}

export default profile