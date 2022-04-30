import { doSteamLogin, SteamLoginResponse, validateSteamLogin } from '@sanny-io/steamlogin'
import { GetServerSideProps } from 'next'

const handleClick = () => doSteamLogin('http://localhost:3000')

type Props = {
  steamId: string | null,
}

export default function HomePage({ steamId }: Props) {
  return (
    steamId
      ? <p>Your Steam ID is {steamId}</p>
      : <button onClick={handleClick}>Click me to login</button>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  let steamId

  try {
    steamId = await validateSteamLogin(context.query as SteamLoginResponse)
  }

  catch (e) {

  }

  return {
    props: {
      steamId: steamId || null
    }
  }
}