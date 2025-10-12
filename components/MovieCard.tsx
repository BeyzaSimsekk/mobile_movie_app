import { icons } from '@/constants/icons'
import { Movie } from '@/interfaces/interfaces'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const MovieCard = ({id, poster_path, title, vote_average, release_date}:Movie) => {

    const [isSaved, setIsSaved] = useState(false);

    const handleSaveToggle = () => {
        setIsSaved(!isSaved);
    }

  return (
    <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity className='w-[30%]'>
            <View className='relative'>
                {/* Poster */}
                <Image
                    source={{
                        uri:poster_path
                        ? `https://image.tmdb.org/t/p/w500${poster_path}`
                        : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
                    }}
                    className='w-full h-52 rounded-lg'
                    resizeMode='cover'
                    />

                {/* Save Icon */}
                <TouchableOpacity
                    onPress={handleSaveToggle}
                    className='absolute top-2 right-2'
                >
                    <FontAwesome name="bookmark" size={25} color={isSaved ? '#FF9333' : 'white'}/>

                </TouchableOpacity>


            </View>
            <Text className='movie_card-title' numberOfLines={1}>{title}</Text>

            {/* Rating */}
            <View className='flex-row items-center justify-start gap-x-1'>
                <Image source={icons.star} className='size-4'/>
                <Text className='vote-text'>{Math.round(vote_average)}</Text>
            </View>

            <View className='flex-row items-center justify-between'>
                {/* Released Date */}
                <Text className='released-date-text'>
                    {release_date?.split('-')[0]}
                </Text>

                {/* <Text className='text-xs font-medium text-light-300 uppercase'> Movie</Text> */} 
            </View>
        </TouchableOpacity>
    </Link>
  )
}

export default MovieCard