import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
import { object, string } from "zod"
import { getUser } from "./lib/actions"
import bcrypt from "bcryptjs"

export const signInSchema = object({
  username: string()
    .min(1, "Username is required"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials,request) => {
        const {username,password} = await signInSchema.parseAsync(credentials);
        // logic to salt and hash password
        
        // logic to verify if the user exists
        const user = (await getUser(username))?.[0]
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("User doesn't exist")
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) {
            throw new Error("Incorrect password")
        }
        // return user object with their profile data
        return {id:String(user.id),name:user.username}
      },
    }),
  ],
})