import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number >> {
    fn: (params: P) => Promise<T>;
    params?: P;
    skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams?: P) => Promise<void>;
}

const useAppwrite = <T, P extends Record<string, string | number >>({
    fn, 
    params = {} as P,
    skip = false} : UseAppwriteOptions<T, P>) : UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (fetchParams: P) => {
            setLoading(true);
            setError(null);

            try {
                
                const result = await fn({...fetchParams});
                setData(result);

            } catch (error:unknown) {

                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setError(errorMessage);
                Alert.alert("Error", errorMessage);
                
            } finally {
                setLoading(false);
            }
        },
        [fn]
    );


    //sayfa açılır açılmaz veri çekiliyor.
    useEffect(()=>{
        if(!skip) {
            fetchData(params);
        }
    }, []);


    //refetch fonksiyonu, yeni parametrelerle veri çekmeyi sağlar.
    const refetch = async (newParams?: P) => await fetchData(newParams!);
    return {data, loading, error, refetch};

    };

export default useAppwrite;
