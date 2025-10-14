import MovieCard from '@/components/MovieCard'
import { icons } from '@/constants/icons'
import { SavedMovie } from '@/interfaces/interfaces'
import { getSavedMovies } from '@/services/appwrite'
import useAuthStore from '@/store/auth.store'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const saved = () => {

  const { user, isAuthenticated } = useAuthStore(); 
  const [savedMovies,setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading,setLoading] = useState(true);
  const [refreshing,setRefreshing] = useState(false);

  const fetchSavedMovies = useCallback(async () => {

    if(!user) return;

    try {
      setLoading(true);
      const movies = await getSavedMovies(user.$id);
      setSavedMovies(movies);

    } catch (error) {
      console.error("fetchSavedMovies error:",error);
    } finally{
      setLoading(false);
    }

  }, [user] )

  useEffect(() => {
    fetchSavedMovies();
  }, [fetchSavedMovies]);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await fetchSavedMovies();
    } catch (error) {
      console.error("onRefresh error:",error);
    } finally{
      setRefreshing(false);
    }

  }, [fetchSavedMovies]);


  if(loading) {
    return (
      <View className='flex-1 justify-center items-center bg-primary'>
        <ActivityIndicator size='large' color="#AB8BFF" />
      </View>
    );
  }


  return (
    <SafeAreaView className='flex-1 bg-primary px-5'>
      <Image source={icons.logo} className="home-logo"/>
      <Text className="header-saved">Saved Movies</Text>
      <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        columnWrapperStyle={{justifyContent:"flex-start", gap:20, marginBottom:10 }}
        renderItem={({item})=>(
          <MovieCard
            id={item.movie_id}
            title={item.title}
            vote_average={item.vote_average}
            release_date={item.release_date}
            poster_path={item.poster_url?.replace("https://image.tmdb.org/t/p/w500","")}
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#AB8BFF"
            colors={["#AB8BFF", "#FFD700"]}
            progressBackgroundColor="#1E1E2D"
          />
        }
        ListEmptyComponent={() => (
          <View className='flex-1 justify-center items-center py-20'>
            <Image
              source={icons.save}
              className='size-10'
              tintColor="#6b7280"
            />
            <Text className='text-gray-500 text-2xl font-lexend-medium mt-3'>
              No saved movies yet.
            </Text>
          </View>
        )}
        contentContainerStyle={{flexGrow: 1,paddingBottom:20, paddingTop:10}}
      />
    </SafeAreaView>
  )
}

export default saved