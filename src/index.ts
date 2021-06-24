import { SteamLoginResponse } from './types'

/**
 * Gets the login URL for Steam.
 * @param returnUrl The URL that Steam redirects to after authentication.
 * @returns The URL to the Steam login page.
 */
export function getSteamLoginUrl(returnUrl: string): string {
  return 'https://steamcommunity.com/openid/login?' + new URLSearchParams({
    'openid.return_to': returnUrl,
    'openid.realm': new URL(returnUrl).origin,
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
  })
}

/**
 * Gets the 64-bit Steam ID of the user. This is not validated by Steam, it's simply extracted
 * from the response. Useful for SPAs that don't need to perform validation.
 * Use `validateSteamLogin` in the server portion of this library if you'd like to do this.
 * @param response The response from Steam.
 * @returns The 64-bit Steam ID of the user, validated by Steam.
 */
export function getSteamIdFromResponse(response: SteamLoginResponse): string {
  return response['openid.claimed_id'].match(/\d+/)![0]
}

export default { getSteamLoginUrl, getSteamIdFromResponse }