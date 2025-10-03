import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/services/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Dimensions, Text, View } from 'react-native'

const SignIn = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({email: '', password: ''})

  const submit = async () => {

    const { email, password } = form;

    if(!email || !password) return Alert.alert('Error', 'Please enter valid email address and password');

    setIsSubmitting(true);

    try {
      await signIn({email, password});

      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally{
      setIsSubmitting(false);
    }
  }

  return (
    <View className='flex-1 bg-primary'>
      <View className='gap-10 bg-white rounded-lg p-8 mt-8'style={{height: Dimensions.get('screen').height/1.9}}>
        <CustomInput
            placeholder='Enter your email'
            value={form.email}
            onChangeText={(text) => setForm((prev)=>({...prev, email: text}))}
            label='Email'
            keyboardType='email-address'
        />
        <CustomInput
            placeholder='Enter your password'
            value={form.password}
            onChangeText={(text) => setForm((prev)=>({...prev, password: text}))}
            label='Password'
            secureTextEntry={true}
        />
        <CustomButton
        title="Sign In "
        isLoading={isSubmitting}
        onPress={submit}
        /> 

        <View className='flex flex-row justify-center mt-5 gap-2'>
          <Text className="base-regular text-light-100">Don't have an account?</Text>
          <Link href = "/sign-up" className= "base-bold text-accent">Sign Up</Link>
        </View>
      </View>
    </View>
  )
}

export default SignIn