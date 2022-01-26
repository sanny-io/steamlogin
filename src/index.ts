import fetch from 'isomorphic-fetch'

export type SteamLoginResponse = {
  ['openid.ns']: string,
  ['openid.mode']: string,
  ['openid.op_endpoint']: string,
  ['openid.claimed_id']: string,
  ['openid.identity']: string,
  ['openid.return_to']: string,
  ['openid.response_nonce']: string,
  ['openid.assoc_handle']: string,
  ['openid.signed']: string,
  ['openid.sig']: string,
}

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
 * Use `validateSteamLogin` if you'd like to perform validation.
 * @param response The response from Steam.
 * @returns The 64-bit Steam ID of the user.
 */
export function getSteamIdFromResponse(response: SteamLoginResponse): string {
  return response['openid.claimed_id'].match(/\d+/)![0]
}

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

/**
 * Validates the response with Steam, and retrieves the user's Steam ID.
 * A response can only ever be validated once. Subsequent attempts will always fail.
 * @param response The response from Steam.
 * @returns The 64-bit Steam ID of the user, validated by Steam.
 */
export async function validateSteamLogin(response: SteamLoginResponse): Promise<string> {
  const parameters = { ...response, ['openid.mode']: 'check_authentication' }

  const httpResponse = (await fetch('https://steamcommunity.com/openid/login?' + new URLSearchParams(parameters), {
    method: 'GET',
  }))

  const httpResponseText = await httpResponse.text()

  if (httpResponseText.includes('is_valid:true')) {
    return getSteamIdFromResponse(response)
  }

  throw new Error('Steam validation failed.')
}

export default {
  getSteamLoginResponse,
  getSteamIdFromResponse,
  getSteamLoginUrl,
  doSteamLogin,
  validateSteamLogin,
}