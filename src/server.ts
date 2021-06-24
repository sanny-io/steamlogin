import * as axiosModule from 'axios'
import { getSteamLoginUrl, getSteamIdFromResponse } from '.'
import { SteamLoginResponse } from './types'

const axios = axiosModule.default

/**
 * Validates the response returned from Steam. This can only be done once per response. Subsequent attempts will always fail.
 * @param response The response returned from Steam.
 * @returns The 64-bit Steam ID of the user, validated by Steam.
 */
export async function validateSteamLogin(response: SteamLoginResponse): Promise<string> {
  const parameters = { ...response, ['openid.mode']: 'check_authentication' }
  const httpResponse = await axios.get('https://steamcommunity.com/openid/login?' + new URLSearchParams(parameters))

  if (httpResponse.data.includes('is_valid:true')) {
    return getSteamIdFromResponse(response)
  }

  throw new Error('Steam validation failed.')
}

export { getSteamLoginUrl, getSteamIdFromResponse }
export default { getSteamLoginUrl, getSteamIdFromResponse, validateSteamLogin }