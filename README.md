# Farcaster Mini App Boilerplate

```
                 C A T E G O R I C A L L Y
               __    _____ _____ _____ _____
              |  |  |  _  | __  |   __|   __|
              |  |__|     |    -|  |  |   __|
              |_____|__|__|__|__|_____|_____|  

                          I N C.

  ███    ███ ██ ███    ██ ██      █████  ██████  ██████  ███████ 
  ████  ████ ██ ████   ██ ██     ██   ██ ██   ██ ██   ██ ██      
  ██ ████ ██ ██ ██ ██  ██ ██     ███████ ██████  ██████  ███████ 
  ██  ██  ██ ██ ██  ██ ██ ██     ██   ██ ██      ██           ██ 
  ██      ██ ██ ██   ████ ██     ██   ██ ██      ██      ███████ 
                                                                
          B O I L E R P L A T E / Q U I C K S T A R T      
```

**Prerequisites**:

- Node Version 19+ (<https://nodejs.org/en>)

- Recaster App (<https://recaster.org>)

- Ngrok Account (<https://ngrok.com/>)

- Neynar API Key (<https://dev.neynar.com/app>)

- Any IDE - e.g., Visual Studio Code or Cursor

- **DO NOT FORGET** - your domain MUST be allow-listed by Warpcast to be sharable

- NextAuth does NOT work on [localhost](http://localhost) - use Ngrok or another platform for testing.

---

**How to run**

Set up your `.env.local` file with the correct environment variables.

You will need to start up your ngrok server for your `NEXT_PUBLIC_URL`& provide a Neynar API key, but the other values are fine for testing.

```
# ngrok url [https://ngrok.com/]
NEXT_PUBLIC_URL=
# ngrok short url ( no https:// )
NEXT_PUBLIC_URL_SHORT=

# NextAuth secret (generate a new one for production)
NEXTAUTH_SECRET=760...

# Neynar API key (get one at https://neynar.com/)
NEYNAR_API_KEY=NEYNAR_API_DOCS

# Next.js environment  (Only effects logging at the moment)
NEXT_PUBLIC_ENVIRONMENT=development

# Auth encryption key (generate a new one for production)
AUTH_ENCRYPTION_KEY=you-should-generate-a-new-key

# Your app name - used for frame api routes and meta tags - must be 15 characters or less
NEXT_PUBLIC_APP_NAME= 'Sample Mini App'

# Your apps full descritpion
NEXT_PUBLIC_APP_DESCRIPTION= 'Sample Mini App Description'

# Your apps short descritpion - must be 20 characters or less
NEXT_PUBLIC_APP_DESCRIPTION_SHORT= 'Sample App'
```

```
npm install
```

```
npm run dev
```

This will display a QR code that you can scan with Recaster (mobile) or open in Warpcast Playground (desktop) to test the Mini App.

<img src="/public/testing.png" alt="Mini App Boilerplate Testing" width="700">

---

### Overview

In this demo boilerplate, we will get a farcaster Mini app running as fast as possible.

Farcaster Mini Apps are web apps that can be embedded into any Farcaster client.

When accessed from a Farcaster client, Mini Apps can currently access the following features:

- Magic link style authentication - handled via `api/launcher` & `AuthContext`
- Create Cast intent - share frames, contextual information, etc `
- Deeplinking - easily prompt Mini app from feed, dms, external shares etc
- Transactions - **COMING SOON** - prompt transactions from within the mini app

This boilerplate is a simple example of how to create a Farcaster Mini App as quickly as possible.

- Mini apps can be built with any web framework, but for this example we will use `Next.js`
- We will use `NextAuth` for managing authentication credentials
- We will create an `launcher api` route to handle launching the mini app and authenticating users from a Farcaster client
- We will handle the session state for the mini app with NextAuth session and custom session provider
- We will use the `createCast` method to create a new cast intent from within the mini app

### Youtube link

[![Youtube embed](https://img.youtube.com/vi/QVqrExzVPyI/0.jpg)](https://www.youtube.com/watch?v=QVqrExzVPyI)

---

### Firstly

Create a `.env.local` file and populate it with all the environment variables (envs) from the `.env.example` file.

All of the envs must be filled out for the Mini App to work

Test your Mini App to ensure it works with Farcaster:

**Mobile:** <https://recaster.org> **Desktop:** [https://warpcast.com/\\\~/developers/composer-actions](https://warpcast.com/%5C~/developers/composer-actions)

The dev tool provided by warpcast is called the "Composer Action Playground", don't forget to add `/api/launcher` at the end of the Post URL to call the correct route, like in the example below:

<https://www.yourUrl.xyz/api/launcher>

---

**Live Demo**

You can view a sample demo [here](https://warpcast.com/~/developers/composer-actions?postUrl=https%3A%2F%2Fmini-app-next-js-boilerplate.vercel.app%2Fapi%2Flauncher) to see how this boilerplate works with a Farcaster client infrastructure using an embedded web view.

You can also test out the QR Code login method by going to the live domain [here](https://mini-app-next-js-boilerplate.vercel.app)

---

### Mini App Launch & Auth Flow

When your Mini App is triggered by a Farcaster client, it calls the `api/launcher` route with an authenticated post request from the user.

In the `api/launcher` route, we extract the `messageBytes` from the `trustedData` provided by the Farcaster client. We then validate the `messageBytes` using Neynar APIs. Upon successful validation, we use the same `messageBytes` to create a URL needed for the Farcaster client to redirect to.

We encrypt the `messageBytes` using a standard AES encryption method. The encrypted `messageBytes` are URL-encoded by replacing certain characters to avoid creating an invalid link. The auth link will look something like this:

`https://YOUR_DOMAIN.xyz/auth?key=ABCD....XYZ&mini=true`

The Farcaster Client will use this link to open the Mini App in an embedded web view.

When the mini app opens, the URL contains the `key`, which is essential for the frontend. As the Mini App loads, the `AuthContext.tsx` detects the `key`.

```
const scheduling = async (key: string) => {
      await handleSignIn(key)
      router.replace(pathname)
}

useEffect(() => {
      const key = searchParams.get("key")
      const mini = searchParams.get("mini")

      if (key) {
            // If key is detected fire scheduling() - so it can fire handleSignIn()
            // We do it this way, as the URL wants to be replaced after login to clear it from all params
            scheduling(key)
      }
      if (mini) {
            setIsMini(true)
      }
}, [handleSignIn, searchParams])
```

When the `key` is detected, we call the `handleSignIn` function. This function calls the `auth/[...nextAuth]` authentication using the `miniApp` method.

In `[...nextAuth]/authOptions`, we first use the correct `CredentialsProvider` based on the `id` that was called. We then ensure that all necessary parameters are received. Next, we decrypt the `key` and revert the replaced special characters back to their original state (which were replaced back in `api/launcher`).

Using the `key`, we `validateFrameAction` which on success retrieves the user. With this user data, we construct a user object that can safely be passed to the frontend via `session`.

Additionally, we return `cipheredParams`, an encrypted user object that communicates with the backend securely to prevent injection attacks.

---

## Mini App features

### Create a Cast from within a Mini App

To create a cast for a user from within a Mini app we use the `createCast` postMessage within our `FarcasterShare` component.

This lets us reuse a share button anywhere and pass through `message` and `embed` params each time.

```
    <FarcasterShare 
      message="hey @dwr.eth just letting you know I am building /miniapps for farcaster" 
      embeds={[process.env.NEXT_PUBLIC_URL || ""]}>
      <span className="text-white">Share on Farcaster</span>
    </FarcasterShare>
```

Since all of our Mini apps can also be accessed directly via web, we want to handle Shares for both

So depending on the `isMini` value, which is set when launched as a Mini App - we will either use a `cast intent link` (web) or a `createCast post message` (MiniApp)

The same thinking will be relevent for handling things like transaction data in the future

```
export default function FarcasterShare({ message, embeds, customClass, children }: ShareButtonProps) {
    const { isMini } = useAuthContext()

    const encodedText = encodeURIComponent(message)
    const embedURL = encodeURIComponent(embeds?.[0] || "")

    const shareCast = async () => {
        window.parent.postMessage({
            type: "createCast",
            data: {
                cast: {
                    parent: "0x",
                    text: message,
                    embeds: embeds || [""]
                }
            }
        }, "*")
    }

  ...(abbreviated for brevity)

    return (
        <>
            {!isMini ? (
                <Link href={`https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${embedURL}`} target="_blank" className={`${customClass || shareButton}`}>
                    {buttonContent}
                </Link>
            ) : (
                <button className={`${customClass || shareButton}`} onClick={shareCast}>
                    {buttonContent}
                </button>
            )}
        </>
    )


```


### Prompt a transacaction from within a Mini App **COMING SOON**

---

### QR Code Login Option \[Standard SIWF\]

There’s also the option to log in via a QR code.

When a user accesses the Mini App outside of a Farcaster client, there will be no `key`.

The user will need to authenticate using a QR code. The user is directed to the `/auth` page, where they are prompted with the `SIFC.tsx` Sign-In Modal Component. When clicked, a scannable QR code appears. Once scanned, it calls the `auth/[...nextAuth]` authentication, this time using the `farcasterQR` method.

This method is similar to the previous one but instead of using `validateFrameAction`, it uses the `verifySignInMessage` method from the Neynar SDK, as it receives a `message` and `signature` from the QR code data, and verifies their authenticity.


---

If you have any questions, feel free to reach out to any of our team members:

- Arek Rybicki (<https://warpcast.com/arek>) - [arek@exhale.studio](mailto:arek@exhale.studio)
- Matthew Fox (<https://warpcast.com/matthewfox>) - [matthew@exhale.studio](mailto:matthew@exhale.studio)
- Josh Roxby (<https://warpcast.com/exhalejr>) - [josh@exhale.studio](mailto:josh@exhale.studio)
