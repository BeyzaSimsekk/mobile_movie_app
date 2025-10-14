import { icons } from '@/constants/icons'
import { Movie, MovieCardProps } from '@/interfaces/interfaces'
import { getSavedMovies, saveMovie, unsaveMovie } from '@/services/appwrite'
import useAuthStore from '@/store/auth.store'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'

const MovieCard = ({id, poster_path, title, vote_average, release_date}:MovieCardProps) => {

    const [isSaved, setIsSaved] = useState(false);
    const { user , isAuthenticated} = useAuthStore();
    const [loading, setLoading] = useState(false);


    // Kullanıcının bu filmi kaydedip kaydetmediğini kontrol et
    useEffect(() => {
        const checkSaved = async () => {
        if (!user) return;
        try {
            const savedMovies = await getSavedMovies(user.$id);
            const found = savedMovies.find(movie => movie.movie_id === id);
            setIsSaved(!!found);
        } catch (error) {
            console.log("Error checking saved movie:", error);
        }
        };

        checkSaved();
    }, [user, id]);

    const handleSaveToggle = async () => {
        
        if(!isAuthenticated || !user) {
            Alert.alert('Please sign in','You must be logged in to save a movie.');
            return;
        }

        if (loading) return; // multiple click önlemek için

        setLoading(true);

        try {
            
            if (isSaved) {
                // Film kaydedilmiş, şimdi sil
                await unsaveMovie(user.$id, id.toString());
                setIsSaved(false);
            } else {
                // Film kaydedilmemiş, şimdi kaydet
                await saveMovie(user.$id, { id, title, vote_average, release_date, poster_path } as Movie);
                setIsSaved(true);
            }

        } catch (error) {
            console.error("Save Toggle Error:", error);
            Alert.alert('Error', 'Something went wrong while updating your saved movies.')
        } finally {
            setLoading(false);
        }

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
                    onPress={(e) => {
                        e.stopPropagation(); 
                        handleSaveToggle();
                    }}
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