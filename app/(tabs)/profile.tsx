import { icons } from '@/constants/icons'
import { account } from '@/services/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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

    //şimdilik arrowBack ve Profile.tsx teki searchte fonksiyonellik olmayacağı için Image olarak oluşturduk.*****BUNU GÜNCELLE*****
  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        {/* Header */}
        <View className='profile-header'>
          <Image source={icons.arrowBack} className='size-5'/> 
          <Text className='profile-header-title'>Profile</Text>
          <Image source={icons.search} className='size-5' tintColor="#A8B5DB"/>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default profile