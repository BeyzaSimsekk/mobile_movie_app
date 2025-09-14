import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, Text, View } from 'react-native';

// () => () => implicit return | () => {} => explicit return (return yazmak şart)
const MovieInfo = ({label, value} : MovieInfoProps) => (
  <View className='movie-info-container'>
    <Text className='movie-info-label'>{label}</Text>
    <Text className='movie-info-value'>{value || 'N/A'}</Text>
  </View>
)

const MovieDetails = () => {

  const {id} = useLocalSearchParams(); // id almak istediğinde useLocalSearchParams kullan

  const {data: movie, loading} = useFetch(() => fetchMovieDetails(id as string));

  return (
    <>
    <StatusBar hidden={true} />
      <View className='bg-primary flex-1'>
        <ScrollView contentContainerStyle={{paddingBottom:80}}>
          <View>
            <Image 
              source={{uri:`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
              className='w-full h-[550px]'
              resizeMode='stretch'
            />
          </View>

          <View className='flex-col items-start justify-center mt-5 px-5'>
            <Text className='movie_details-title'>{movie?.title}</Text>
            <View className='movie_details-small'>
              <Text className='movie_details-small-text'>{movie?.release_date?.split('-')[0]} </Text>
              <Text className='movie_details-small-text'>| {movie?.runtime}min</Text>
            </View>

            <View className='movie_details-rating'>
              <Image
                source={icons.star}
                className='size-4'
              />
              <Text className='movie_details-rating-text'>
                {Math.round(movie?.vote_average ?? 0)}/10
              </Text>
              
              <Text className='text-light-200 text-lg font-lexend'>({movie?.vote_count} votes)</Text>

            </View>

            <MovieInfo label='Overview' value={movie?.overview}/>
            <MovieInfo label='Genres' value={movie?.genres?.map((g)=>g.name).join(' - ') || 'N/A'}/>
            <View className='movie-info_budget '>
              <MovieInfo label='Budget' value={`$${movie?.budget / 1_000_000} millions `}/>
              <MovieInfo label='Revenue' value={`$${Math.round(movie?.revenue / 1_000_000)} millions`}/>
            </View>

          </View>
        </ScrollView>
      </View>
    </>
  )
}

export default MovieDetails