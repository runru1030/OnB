import { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import { getClient } from "@app/_components/ApolloClientRSC";
import { auth } from "@app/lib/graphql/queries";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
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
        mutation: auth.CREATE_AUTH,
        variables: { ...user },
      });
      return true;
    },
    async session({ session }) {
      if (session.user) {
        const { data } = await getClient().query({
          query: auth.GET_USER,
          variables: { email: session.user.email },
        });
        session.user.id = data.user.id;
        session.user.name = data.user.name;
      }
      return session;
    },
  },
};
export { authOptions };
