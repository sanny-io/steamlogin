# @sanny-io/steamlogin

Dead simple functions for logging in through Steam. Works great with SPAs, server rendered pages, and cloud functions. No messing around with OpenID required.

## Installation

```
npm i @sanny-io/steamlogin
```

## Example

An example with server validation can be found in this repository's [`example`](example) folder.

## Client

### Using an `href`

```jsx
import React from 'react'
import { getSteamLoginUrl } from '@sanny-io/steamlogin'

const returnUrl = 'http://localhost:3000/auth'

export default function LoginButton() {
    return <a href={getSteamLoginUrl(returnUrl)}>Login through Steam</a>
}
```

### Using an `onClick` handler

```jsx
import React from 'react'
import { doSteamLogin } from '@sanny-io/steamlogin'

const returnUrl = 'http://localhost:3000/auth'
const handleClick = () => doSteamLogin(returnUrl)

export default function LoginButton() {
    return <button onClick={handleClick}>Login through Steam</button>
}
```

The snippet below is only necessary if `returnUrl` is an SPA. This would be the `http://localhost:3000/auth` route in our example.

If `returnUrl` is a server, you can simply skip to the server section.

```jsx
import React, { useEffect } from 'react'
import axios from 'axios'
import { getSteamLoginResponse, getSteamIdFromResponse } from '@sanny-io/steamlogin'

export default function AuthRoute() {
    const response = getSteamLoginResponse()

    // If you need to validate the login, send it to the server
    // with fetch, axios, etc...

    // OR

    // If you don't need to validate the login, you can immediately
    // start using the 64-bit Steam ID of the user.
    const steamId = getSteamIdFromResponse(response)
}
```

## Server

```typescript
// If you're using ES modules.
import steamlogin from '@sanny-io/steamlogin'

// If you're using CommonJS.
const steamlogin = require('@sanny-io/steamlogin')

// Get the response through express, cloud functions, etc...
// ...

// Then validate it like so.
steamlogin.validateSteamLogin(response)
.then(steamId => {
    // We have the 64-bit Steam ID of the user, validated by Steam.
})
```

Please note that **a response can only ever be validated once.** Subsequent attempts will always fail.

## `response`

It's an object that Steam sends to the specified `returnUrl` through GET parameters after the user has logged in.

If `returnUrl` is a client (like an SPA), `getSteamLoginResponse` creates this object for you. If you need to validate the login, you must send it to a server and call `validateSteamLogin` over there. Otherwise, you can immediately start using the 64-bit Steam ID of the user with `getSteamIdFromResponse`.

If `returnUrl` is a server (like express), this object can be accessed through your server software's GET parameters. **You shouldn't directly use `getSteamIdFromResponse` on the server, as it doesn't perform any validation.** You should instead get the Steam
ID through `validateSteamLogin`.

```typescript
{
    ['openid.assoc_handle']: "1234567890"
    ['openid.claimed_id']: "https://steamcommunity.com/openid/id/XXXXXXXXXXXXXX"
    ['openid.identity']: "https://steamcommunity.com/openid/id/XXXXXXXXXXXXXX"
    ['openid.mode']: "id_res"
    ['openid.ns']: "http://specs.openid.net/auth/2.0"
    ['openid.op_endpoint']: "https://steamcommunity.com/openid/login"
    ['openid.response_nonce']: "2021-06-11T00:20:52Z7yoVVmrWgSENuw60w8rj2zZ82K4="
    ['openid.return_to']: "http://localhost:3000/auth"
    ['openid.sig']: "XXXXXXXXXXXXXX"
    ['openid.signed']: "signed,op_endpoint,claimed_id,identity,return_to,response_nonce,assoc_handle"
}
```

Looks like a bunch of junk, huh? *Because it is.* Just give this object to the `validateSteamLogin` function and it'll confirm with Steam that everything checks out, with the final result being the user's 64-bit Steam ID.

## Next Steps

Start using the Steam API.

https://www.npmjs.com/package/steamapi