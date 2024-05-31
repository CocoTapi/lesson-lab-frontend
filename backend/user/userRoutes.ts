import express from "express";
import { asyncHandler } from "../util/route-util";
import { ErrorMessage, FavoritesInfo, EditProfileInfo } from "../util/types";
import { checkAuth, createJSONToken } from "../util/auth";
import { 
    getUserDataFromEmail, 
    getUserFavorites, 
    getUserProfile, 
    editProfile, 
    removeProfile,
    checkEditProfileValidation,
    addFavorites,
    getUserUploads,
    removeFavoriteActivity,
    getUserPlaylists,
    addPlaylist,
    deletePlaylist,
    removeActivityFromPlaylist,
    addActivitiesIntoPlaylist
} from "./user";
import env from "dotenv";

env.config();

const router = express.Router();

//user info retrieval using token
router.get('/', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const userInfo = await getUserDataFromEmail(verifiedEmail);

    res.status(200).json({ 
        message: 'Successfully got user data from token',
        data: userInfo
     });
}))


//get user profile and favorites
router.get('/:id', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const id: number = parseInt(req.params.id);

    //check token
    const userProfile = await getUserProfile(verifiedEmail);
    const verifiedId = userProfile.user_id;
    if (id !== verifiedId) throw Error("Auth Error. Token and user_id doesn't match")

    res.status(200).json({ userProfile });
}))

//get user favorites
router.get('/:id/favorites', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.id);

    const userFavorites = await getUserFavorites(user_id);

    res.status(200).json({ userFavorites });
}))

//get user uploads
router.get('/:id/uploads', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.id);

    const userUploads = await getUserUploads(user_id);

    res.status(200).json({ userUploads });
}))

//get user playlists
router.get('/:id/playlists', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.id);

    const userPlaylists = await getUserPlaylists(user_id);

    res.status(200).json({ userPlaylists });
}))

//add user's favorite activity
router.post('/:id/favorites', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const formData: FavoritesInfo = req.body;

    await addFavorites(formData);
    res.status(200).json({ message: 'activity in user_favorites successfully updated.'});
}))

//create new playlist
router.post('/:id/playlists', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const playlist_title: string = req.body.playlist_title;
    const user_id: number = parseInt(req.params.id);

    await addPlaylist(playlist_title, user_id);
    res.status(200).json({ message: 'New playlist added.'});
}))

//add activities into playlist
router.patch('/:id/playlists/:playlist_id', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const activity_id_arr: number[] = req.body.activity_id_arr;
    const user_id: number = req.body.user_id;
    const playlist_id: number = req.body.playlist_id;

    await addActivitiesIntoPlaylist(activity_id_arr, user_id, playlist_id);   
    res.status(200).json({ message: 'Activities added into a playlist.'});      
}))

//edit user profile
router.patch('/:id', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);
    
    const formData: EditProfileInfo = req.body;
    const user_id: number = parseInt(req.params.id);
    
    const errors: ErrorMessage = await checkEditProfileValidation(formData);

    console.log("password errors", errors);

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: "Edit profile failed due to validation errors.",
            errors,
        })
    }

    await editProfile(verifiedEmail, formData);

    const token = createJSONToken(formData.email);

    res.status(200).json({ message: 'uploaded user profile' , token: token});
}))


//delete user profile
router.delete('/:id', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.id);

    await removeProfile(user_id, verifiedEmail);
    res.status(200).json({ message: 'Profile deleted.'});
}))

//remove user's favorite activity
router.delete('/:user_id/favorites/:activity_id', asyncHandler(async(req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.user_id);
    const activity_id: number = parseInt(req.params.activity_id);

    await removeFavoriteActivity(user_id, activity_id);
    res.status(200).json({ message: 'Favorite activity deleted.'});
}))

//delete playlist
router.delete('/:user_id/playlists', asyncHandler(async(req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.user_id);
    const playlist_id: number = req.body.playlist_id;
  
    await deletePlaylist(user_id, playlist_id);

    res.status(200).json({ message: 'Playlist deleted.'});
}))

//remove activity from playlist
router.patch('/:user_id/playlists', asyncHandler(async(req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const playlist_id: number = req.body.playlist_id;
    const activity_id: number = req.body.activity_id;
  
    await removeActivityFromPlaylist(playlist_id, activity_id);

    res.status(200).json({ message: 'Activity removed.'});
}))

export default router;