// fetchFunction dediğimiz:
// fetchMovies, fetchMovieDetails... gibi tüm fetch apilerini kapsayan bir fonksiyon
//useFetch(fetchMovies) veya useFetch(fetchMovieDetails) gibi kullanılacak

import { useEffect, useState } from "react";

//we can use this hook everything data related
const useFetch = <T>(fetchFunction: ()=>Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await fetchFunction();

            setData(result);

        } catch (err) {
            setError(err instanceof Error ? err : new Error("An error occurred"));
        } finally {
            setLoading(false);
        }
    }

    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }


    //useEffect called when you wanna do something at the start of your code
    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, []);


    //hooks have to return something
    return {data, loading, error, refetch: fetchData, reset};
}

export default useFetch;
