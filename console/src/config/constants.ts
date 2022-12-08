
// export const APP_URI = "https://tauri.localhost"

//  Development Variables
export const APP_URI = window.location.origin
export const AUTH0_DOMAIN = import.meta.env.REACT_APP_AUTH0_DOMAIN ||  "dev-d0m2qkwao0zc3lbs.us.auth0.com"
export const AUTH0_CLIENT_ID = import.meta.env.REACT_APP_AUTH0_CLIENT_ID || "4z4S98D089sDLtWZXSGp8UP8iWnsAq6V"
export const AUTH0_REDIRECT_URI = window.location.origin + "/auth/callback"
export const AUTH0_AUDIENCE = import.meta.env.REACT_APP_AUTH0_AUDIENCE || "https://api.faasly.com"
export const AUTH0_SCOPE = "read:current_user update:current_user_metadata"