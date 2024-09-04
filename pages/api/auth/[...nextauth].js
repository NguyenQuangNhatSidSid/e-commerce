import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/db";
const adminEmail = ["bin.nhok.94695@gmail.com"];
export default NextAuth({
  providers: [
    // OAuth authentication providers...
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Passwordless / email sign in
    // EmailProvider({
    //   server: process.env.MAIL_SERVER,
    //   from: 'NextAuth.js <no-reply@example.com>'
    // }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    session: ({ session, account, profile }) => {
      console.log({ session, account, profile });
      if (adminEmail.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
});
