import { getClient } from "@app/_components/ApolloClientRSC";
import { CREATE_AUTH } from "@lib/graphql/mutations";
import { GET_USER } from "@lib/graphql/queries";
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_ID || "",
      clientSecret: process.env.KAKAO_SECRET || "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await getClient().mutate({
        mutation: CREATE_AUTH,
        variables: { ...user },
      });
      return true;
    },
    async session({ session }) {
      if (session.user) {
        const { data } = await getClient().query({
          query: GET_USER,
          variables: { email: session.user.email },
        });
        session.user.id = data.user.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };