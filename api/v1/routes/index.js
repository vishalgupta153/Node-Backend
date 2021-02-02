import express from 'express'
import isUserAuthenticatedPolicy from '../policies/isUserAuthenticated'
import isLoggedInPolicie from '../policies/isLoggedIn'

/** Import Controller */
import AuthConroller from '../controller/auth'
import UserController from '../controller/user'
import ShopController from '../controller/shop'
const router = express.Router()

/**
 * Authentication Middleware (BEFORE)
 * Serve all apis before MIDDLE if they serve like /api/*
 */
router.all('/api/*', isUserAuthenticatedPolicy, isLoggedInPolicie)
router.get('/auth/test/', AuthConroller.test)
router.post('/auth/signUp/', AuthConroller.signUp)
router.post('/auth/login/', AuthConroller.login)

/** User Controller APIs */
router.get('/api/getUserDetails', UserController.getUserDetails)
router.patch('/api/updateUserDetails', UserController.updateUserDetails)

/** Shop Controller APIs */
router.post('/api/createShop', ShopController.createShop)
router.get('/api/getShopDetails', ShopController.getShopDetails)
router.patch('/api/updateShopDetails', ShopController.updateShopDetails)
router.delete('/api/deleteShop', ShopController.deleteShop)
router.post('/api/getMyShop', ShopController.getMyShop)



module.exports = router
