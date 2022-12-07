
// export const APP_URI = "https://tauri.localhost"

//  Development Variables
export const APP_URI = window.location.origin
export const AUTH0_DOMAIN = import.meta.env.REACT_APP_AUTH0_DOMAIN ||  "dev-qgdysq-r.us.auth0.com"
export const AUTH0_CLIENT_ID = import.meta.env.REACT_APP_AUTH0_CLIENT_ID || "8QBsWM8EwrQG0CxmKJoziLR1BRgZxYYi"
export const AUTH0_REDIRECT_URI = window.location.origin + "/auth/callback"
export const AUTH0_AUDIENCE = import.meta.env.REACT_APP_AUTH0_AUDIENCE || "https://dev.api.faasly.com"
export const AUTH0_SCOPE = "read:current_user update:current_user_metadata read:functions create:function delete:function read:function update:function read:user read:team update:team create:user update:user delete:user read:listings create:listing delete:listing read:listing update:listing read:templates create:template delete:template read:template update:template read:events create:event delete:event read:event update:event read:logs create:log delete:log read:log update:log"