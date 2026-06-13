import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

async function notifyTelegram(text: string) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch {}
}

function nowKyiv() {
  return new Date().toLocaleString("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard";
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      const label = isNewUser ? "🆕 Нова реєстрація Google" : "🔑 Вхід через Google";
      await notifyTelegram(
        `${label}\n\n` +
        `👤 <b>${user.name || "—"}</b>\n` +
        `📧 ${user.email}\n` +
        `🕐 ${nowKyiv()}`
      );
    },
  },
});