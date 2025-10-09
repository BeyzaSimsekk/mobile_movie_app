import { CreateUserParams, Movie, SignInParams, TrendingMovie } from "@/interfaces/interfaces";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

// track the searches made by a user

const appwriteConfig ={
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    platform: "com.byz.molixapp",
    metricsTableId: process.env.EXPO_PUBLIC_APPWRITE_METRICS_TABLE_ID!,
    userTableId:process.env.EXPO_PUBLIC_APPWRITE_USER_TABLE_ID!
}


export const client = new Client()

client
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client)
//export const storage= new Storage(client);
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

export const updateUserProfile = async (userId: string, data: {name?: string, email?: string}) => {
    try {
        
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            userId,
            data
        );
        return updatedUser;

    } catch (error) {
        console.error("Update user profile error:", error);
        throw error;
    }
}

// (örnek: resim URL'si ya da base64 string)
export const updateUserAvatar = async (userId: string, avatarUrl: string) => {
    try {
        
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            userId,
            { avatar: avatarUrl }
        );

        return updatedUser;

    } catch (error) {
        console.error("Update user avatar error:", error);
        throw error;
    }
}