import { getSteamLoginUrl, getSteamIdFromResponse } from '.'
import { SteamLoginResponse } from './types'

/**
 * Redirects the user to the Steam login page.
 * @param returnUrl The URL that Steam redirects to after authentication.
 */
export function doSteamLogin(returnUrl: string): void {
  window.location.href = getSteamLoginUrl(returnUrl)
}

/**
 * Gets the response from Steam. Useful for SPAs.
 * @returns The response from Steam.
 */
export function getSteamLoginResponse(): SteamLoginResponse {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries()) as SteamLoginResponse
}

export { getSteamLoginUrl, getSteamIdFromResponse }
export default { getSteamLoginUrl, getSteamIdFromResponse, doSteamLogin, getSteamLoginResponse }