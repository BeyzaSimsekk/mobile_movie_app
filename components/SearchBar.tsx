import { icons } from '@/constants/icons'
import { Props } from '@/interfaces/interfaces'
import React from 'react'
import { Image, TextInput, View } from 'react-native'

const SearchBar = ({placeholder, onPress, value, onChangeText}: Props) => {
  return (
    <View className='search-bar'>
      <Image source={icons.search} className='size-6' resizeMode='contain' tintColor="#AB8BFF"/>
      <TextInput 
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#A8B5DB"
        className='flex-1 ml-2 text-white font-lexend-light'
      />
    </View>
  )
}

export default SearchBar