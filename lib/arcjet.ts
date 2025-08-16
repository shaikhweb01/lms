import "server-only"
import arcjet, {shield,slidingWindow,detectBot,fixedWindow,protectSignup,sensitiveInfo} from "@arcjet/next"
import { env } from "./env"
export{
    detectBot,
    shield,
    slidingWindow,
    fixedWindow,
    protectSignup,
    sensitiveInfo
}

export default arcjet({
    key:env.ARCJET_KEY,
    characteristics:["fingerprint"],
    rules:[
        shield({
            mode:'LIVE',
        })
    ]
})