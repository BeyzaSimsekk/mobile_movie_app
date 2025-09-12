import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import { updateSearchCount } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'

const search = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  
    const {
      data: movies, 
      loading, 
      error,
      refetch: loadMovies,
      reset
    } 
      = useFetch( () => fetchMovies({query: searchQuery}),false) 
      //this time we dont want to fetch data automatically, we want to fetch data when the press the search button

    useEffect(()=>{
      /**
       * Performans açısından bunu kullanmayacagız:
       * if(searchQuery.trim()) {
          await loadMovies();
        } else{
          reset();
        }
          çünkü çok fazla istek atıyoruz, her karakter işleminde istek atıyoruz.
       */
      
      
      const timeOutId = setTimeout (async () => {

        if(searchQuery.trim()) {
          await loadMovies();
          setShowEmptyMessage(true); // sadece sorgu varsa göster
        } else{
          reset();
          setShowEmptyMessage(false); // boş sorguda mesajı gizle
        }

      }, 500)

      return () => {
        clearTimeout(timeOutId);
        setShowEmptyMessage(false); // yeni karakter girildiğinde mesajı hemen gizle
      } // with this we can prevent memory leak
    },[searchQuery]);

    // Yeni useEffect: movies güncellenince tetiklenir
    useEffect(() => {
        if (movies?.length > 0 && movies?.[0]) {
          updateSearchCount(searchQuery, movies[0]);
        }
      }, [movies]);

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover'/>

      <FlatList 
        data={movies}
        renderItem={({item})=> <MovieCard {...item}/>}
        keyExtractor={(item) => item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListHeaderComponent={
          <>
            <View className='w-full lfex-row justify-center mt-20 items-center'>
              <Image source={icons.logo} className='w-12 h-10'/>
            </View>

            <View className='my-5'>
              <SearchBar 
                placeholder='Search movies...'
                value={searchQuery}
                onChangeText = {(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && (
              <ActivityIndicator size="large" color="#AB8BFF" className='my-3' />
            )}

            {error && (
              <Text className='text-red-500 px-5 my-3'>
                Error: {error?.message}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length! > 0 && (
              <Text className='text-xl text-white font-bold '>
                Search results for {' '}
                <Text className='text-accent '>{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className='flex-1 justify-center items-center mt-10'>
            {searchQuery.trim() ? (movies?.length === 0 && showEmptyMessage && (
              <Text className='text-center text-gray-500 text-lg'>
                No movies found
              </Text>
          )
            ) : (
              <Image
                source={icons.SearchBg}
                className='w-20 h-20 opacity-40'
                resizeMode='contain'
              />
            )}
            </View>
          ) : null
        }
/>
    </View>
  )
}

export default search