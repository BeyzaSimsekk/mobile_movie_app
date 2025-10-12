import { icons } from '@/constants/icons';
import { ProfileFieldProps, User } from '@/interfaces/interfaces';
import { account, updateUserProfile, userUpdateAvatar } from '@/services/appwrite';
import useAuthStore from '@/store/auth.store';
import * as ImagePicker from "expo-image-picker";
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const profile = () => {

  const { user , setUser, setIsAuthenticated, isLoading, setLoading} = useAuthStore();

  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  const handleAvatarChange = useCallback(async () => {
    try {
      
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(status !== "granted") {
        Alert.alert("Permission denied", "We need access to your gallery to update your avatar.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if(result.canceled) return;
      
      const imageUri = result.assets[0].uri;
      setLoading(true);

      // User Null Check
      if (!user) {
        Alert.alert("Error", "User not found");
        setLoading(false);
        return;
      }

      const updatedUser = await userUpdateAvatar(user.$id, imageUri)

      setUser(updatedUser as unknown as User);

      Alert.alert("Success", "Your avatar has been updated!");

    } catch (error:any) {
      console.error("Avatar Update Error:", error);
      Alert.alert("Error", "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  }, [user])

  const handleEditProfile = useCallback( async () => {
    try {
      
      if(!newName.trim()){
        Alert.alert("Error", "Name cannot be empty");
        return;
      }

      setLoading(true);

      if(!user) {
        Alert.alert("Error", "User not found");
        setLoading(false);
        return;
      }

      const updatedUser = await updateUserProfile(user.$id, newName);
      setUser(updatedUser as unknown as User);
      Alert.alert("Success", "Your profile has been updated!");
      setModalVisible(false); 

  } catch (error: any) {
      console.error("Edit Profile Error:", error);
      Alert.alert("Error", "Failed to update profile information");
  } finally {
      setLoading(false);
  }
  },[newName, user])

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
              onPress={handleAvatarChange}
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
            onPress={() => setModalVisible(true)}
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

      {/* Modal */}
      <Modal visible={isModalVisible} transparent animationType='fade'>
        <View className='flex-1 bg-black/50 items-center justify-center'>
          <View className='bg-secondary w-4/5 p-6 rounded-2xl'>
            <Text className='text-lg text-light-100 font-lexend-semibold mb-2'>Edit your name</Text>

            <TextInput 
              value={newName}
              onChangeText={setNewName}
              placeholder='Enter new name'
              placeholderTextColor='#999'
              className='bg-dark_accent text-white rounded-xl p-3 mb-4'
            />

            <View className='flex-row justify-between'>
              {/* Save */}
              <TouchableOpacity
                className='bg-accent p-3 rounded-xl w-[48%] items-center'
                onPress={handleEditProfile}
              >
                <Text className='text-white font-lexend-semibold'>Save</Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                className='bg-light-100 p-3 rounded-xl w-[48%] items-center'
                onPress={() => setModalVisible(false)}
              >
                <Text className='text-dark_accent font-lexend-semibold'>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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