import { icons } from '@/constants/icons'
import { ProfileFieldProps } from '@/interfaces/interfaces'
import { account } from '@/services/appwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import React, { useCallback } from 'react'
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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

        {/* Avatar */}
        <View className='items-center mt-16'>
          <View className='relative'>
            <Image 
              source={{uri: avatarUrl}}
              className='profile-avatar'
            />
            <TouchableOpacity
              activeOpacity={0.8}
              className='profile-avatar-edit'
              onPress={() => {}}
            >
              <Image source={icons.edit} className='size-5 tint-white'/>
            </TouchableOpacity>
          </View>
        </View>

        {/* InfoCard */}
        <View className='profile-info-card'>
          <InfoRow
            icon={icons.user}
            label='Full Name'
            value={user.name}
          />
          <InfoRow
            icon={icons.email}
            label='Email'
            value={user.email}
          />

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/saved")}
            className='profile-info-card-saved'
          >
            <View className='infoRow-icon'>
              <Image source={icons.saved} className='size-5' resizeMode='contain'/>
            </View>
            <Text className='text-dark_accent font-lexend-semibold text-base'>Saved Movies</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View className='profile-buttons'>
          {/* Edit Profile Button */}
          <TouchableOpacity 
            className='editProfile-btn'
            onPress={() => {}} // FONKSİYONELLİĞİ SONRA YAZILACAK
          >
            <Image source={icons.edit} className='size-4' tintColor="#AB8BFF"/>
            <Text className='editProfile-btn-text'>Edit Profile</Text>
          </TouchableOpacity>

          {/* Log Out Button */}
          <TouchableOpacity
            className='logoutProfile-btn'
            onPress={handleLogout}
          >
            <Image source={icons.logout} className='size-4' />
            <Text className='logoutProfile-btn-text'>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const InfoRow = ({label,value,icon}: ProfileFieldProps) =>(
  <View className='infoRow-container'>
    <View className='infoRow-icon'>
      <Image source={icon} className='size-5' resizeMode='contain'/>
    </View>

    <View>
      <Text className='infoRow-label'>{label}</Text>
      <Text className='infoRow-value'>{value}</Text>
    </View>
  </View>
)

export default profile