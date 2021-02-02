/**
 * Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
 */
const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    'PROJECT_NAME': 'techflitter',
    'PORT': 3000,
    'appHost': process.env.APP_HOST,
    'database': {
        'mongoURL': process.env.MONGO_URL,
    },
    'jwtTokenVerificationEnable': true,
    'secret': '#2@21Techflitter#',
    'socket': {
        'enable': false
    },

    /** File URLs */
    'IMAGE_URL': {
        'DEFAULT': {
            'USER_PROFILE': process.env.APP_HOST + '/uploads/profile/default.png'
        }
    }
}