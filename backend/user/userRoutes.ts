import express from "express";
import { asyncHandler } from "../util/route-util";
import { ProfileInfo, ErrorMessage, FavoritesInfo } from "../util/types";
import { checkAuth, createJSONToken } from "../util/auth";
import { 
    getUserDataFromEmail, 
    getUserFavorites, 
    getUserProfile, 
    editProfile, 
    removeProfile,
    checkUserNameValidation,
    addFavorites,
    getUserUploads,
    removeFavoriteActivity,
    getUserPlaylists 
} from "./user";
import { checkProfileValidation } from "../auth/auth";
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

    res.status(200).json({ userProfile: userProfile });
}))

//get user favorites
router.get('/:id/favorites', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.id);

    const userFavorites = await getUserFavorites(user_id);

    res.status(200).json({ userFavorites: userFavorites });
}))

//get user uploads
router.get('/:id/uploads', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.id);

    const userUploads = await getUserUploads(user_id);

    res.status(200).json({ userUploads: userUploads });
}))

//get user playlists
router.get('/:id/playlists', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const user_id: number = parseInt(req.params.id);

    const userPlaylists = await getUserPlaylists(user_id);

    res.status(200).json({ userPlaylists: userPlaylists });
}))



//add user's favorite activity
router.post('/', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);

    const formData: FavoritesInfo = req.body;

    await addFavorites(formData);
    res.status(200).json({ message: 'activity in user_favorites successfully updated.'});
}))

//edit user profile
router.patch('/:id', asyncHandler(async (req, res) => {
    const method = req.method;
    const authHeader = req.headers.authorization;
    const verifiedEmail = await checkAuth(method, authHeader);
    
    const formData: ProfileInfo = req.body;
    const user_id: number = parseInt(req.params.id);
    
    const errors: ErrorMessage = await checkProfileValidation(formData);
    const userNameError: ErrorMessage = await checkUserNameValidation(formData.user_name, user_id);
    
    if(Object.keys(userNameError).length > 0) {
        errors.user_name = userNameError.user_name;
    }

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

export default router;