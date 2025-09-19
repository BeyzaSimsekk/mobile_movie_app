//import useAuthStore from '@/store/auth.store';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Redirect, Slot } from 'expo-router';
import React from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';


export default function AuthLayout() {

  // const {isAuthenticated} = useAuthStore();
   const isAuthenticated = false;

   if(isAuthenticated) return <Redirect href="/" />


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView className='bg-primary h-full' keyboardShouldPersistTaps="handled" >
        <View className='w-full relative' style={{height: Dimensions.get('screen').height / 2.25}} >
        <Image source={images.bg} className='absolute w-full z-0'/>
        <Image source={icons.authLogo} className = "logo z-10"/>
        </View>
        
      <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}