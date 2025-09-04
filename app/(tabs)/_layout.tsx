import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, Text } from 'react-native'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen 
            name='index'
            options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <>
                        <ImageBackground
                        source={images.highlight}
                        className='navbar-bg'
                        >
                            <Image 
                                source={icons.home}
                                tintColor= "#151312"
                                className='size-5'
                            />
                            <Text>Home</Text>

                        </ImageBackground>
                    </>
                )
            }}
        />

        <Tabs.Screen
            name='search'
            options={{
                title: 'Search',
                headerShown: false
            }}
        />

        <Tabs.Screen
            name='saved'
            options={{
                title: 'Saved',
                headerShown: false
            }}
        />

        <Tabs.Screen
            name='profile'
            options={{
                title: 'Profile',
                headerShown: false
            }}
        />
    </Tabs>
  )
}

export default _layout