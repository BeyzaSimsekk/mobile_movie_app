import { CreateUserParams, Movie, SavedMovie, SignInParams, TrendingMovie } from "@/interfaces/interfaces";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

// track the searches made by a user

const appwriteConfig ={
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    platform: "com.byz.molixapp",
    metricsTableId: process.env.EXPO_PUBLIC_APPWRITE_METRICS_TABLE_ID!,
    savedMoviesTableId: process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_TABLE_ID!,
    userTableId:process.env.EXPO_PUBLIC_APPWRITE_USER_TABLE_ID!,
    bucketId:process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID!
}


export const client = new Client()

client
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client)
export const storage= new Storage(client);
const avatars = new Avatars(client);


const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {

    try {
        const result = await database.listDocuments(appwriteConfig.databaseId, appwriteConfig.metricsTableId, [
            Query.equal("searchTerm", query),
    ]);

    // console.log(result);
    // check if a record  of that search has already been stored
    if(result.documents.length > 0){
        const existingMovie = result.documents[0];

        await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.metricsTableId,
            existingMovie.$id,
            {
                count: existingMovie.count + 1
            }
        )
    } else {
        await database.createDocument(appwriteConfig.databaseId, appwriteConfig.metricsTableId, ID.unique(), {
            searchTerm: query,
            movie_id: movie.id,
            count: 1,
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        })
    }
    } catch (error) {
        console.log(error);
        throw error;
    }

    // if a document is found increment the searchCount field
    // if not create a new document in Appwrite database -> 1
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(appwriteConfig.databaseId, appwriteConfig.metricsTableId, [
            Query.limit(5),
            Query.orderDesc("count")
    ]);

    return result.documents as unknown as TrendingMovie[];

    } catch (error) {
        console.log(error);
        return undefined;
    }
}

 export const createUser = async({email, password, name} : CreateUserParams) => {
     try {
        
         const newAccount = await account.create(ID.unique(),email, password, name);

         if(!newAccount) {
             throw new Error("Failed to create user account");
         }

         // kullanıcı oluşturulduktan sonra otomatik giriş
         await signIn({email, password})

         const avatarUrl =  avatars.getInitialsURL(name)

         const newUser = await databases.createDocument(
             appwriteConfig.databaseId,
             appwriteConfig.userTableId,
             ID.unique(),
             { email, name, accountId: newAccount.$id, avatar: avatarUrl }
         );

         return newUser;
     } catch (error) {
         throw new Error(error as string);
     }
 }


 export const signIn = async({email, password} : SignInParams) => {
     try {

         // önce mevcut session var mı diye bak
     const existing = await account.get().catch(() => null);

     if (existing) {
       // zaten login, yeni session açma
       return existing;
     }

         // session yoksa giriş yap
     return await account.createEmailPasswordSession(email, password);
     } catch (error) {
         throw new Error(error as string);
     }
 }

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) {
            throw new Error("No user is currently signed in");
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentAccount) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
        throw new Error(error as string);
    }
}

export const updateUserProfile = async (userId: string, name: string ) => {
    try {
        
        // Appwrite account update
        await account.updateName(name);

        // Database update
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            userId,
            { name }
        );

        return updatedUser;

    } catch (error) {
        console.error("Update User Profile Error:", error);
        throw new Error("Failed to update user profile");
    }
}

export const userUpdateAvatar = async (userId: string, imageUri: string) => {
    try {

        // 1) fetch ile uri'den blob al (expo-image-picker veya RN ImagePicker ile gelen uri'ler için çalışır)
        const response = await fetch(imageUri); 
        const blob = await response.blob();

        // 2) dosya objesini hazırla (Appwrite Storage createFile bu formattaki objeyi bekliyor)
        const fileName = imageUri.split('/').pop() || `avatar-${Date.now()}.jpg`;
        const fileObj = {
            uri: imageUri,
            name: fileName,
            type: blob.type || "image/png",
            size: blob.size ?? 0
        };

        // 3) storage'a yükle
        const file = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            fileObj
        );

        // 4) public/view URL al (react-native-appwrite'da bu yöntemi kullanmak doğru)
        const avatarUrl = storage.getFileViewURL(appwriteConfig.bucketId, file.$id);

        // 5) DB'deki user kaydını güncelle
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            userId,
            { avatar: avatarUrl}
        );

        return updatedUser;

    } catch (error) {
        console.error("Update User Avatar Error:", error);
        throw new Error("Failed to update avatar");
    }
}

// save movie
export const saveMovie = async (userId: string, movie: Movie) : Promise<SavedMovie>=> {
    try {
        
        const saved = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savedMoviesTableId,
            ID.unique(),
            {
                user_id: userId,
                movie_id: movie.id,
                title: movie.title,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            }
        );

        return saved as unknown as SavedMovie;

    } catch (error) {
        console.error("saveMovie error:",error);
        throw new Error("Failed to save movie");
    }
}

// remove saved movie
export const unsaveMovie = async (userId: string, movieId: string) => {
    try {
        
        // önce bu kullanıcıya ait movie_id var mı kontrol et
        const existing = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savedMoviesTableId,
            [
                Query.equal("user_id", userId),
                Query.equal("movie_id", Number(movieId))
            ]
        );

        if(existing.documents.length === 0) {
            return null; //zaten kaydedilmemiş
        }

        const docId = existing.documents[0].$id;

        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savedMoviesTableId,
            docId,
        );

        return true;

    } catch (error) {
        console.error("unsaveMovie error:", error);
        throw new Error("Failed to unsave movie");
    }
}

// get saved movies
export const getSavedMovies = async (userId: string) : Promise<SavedMovie[]> => {
    try {
        
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savedMoviesTableId,
            [
                Query.equal("user_id", userId)
            ]
        );

        return result.documents as unknown as SavedMovie[];
        
    } catch (error) {
        console.error("unsaveMovie error:", error);
        throw new Error("Failed to unsave movie");
    }
}