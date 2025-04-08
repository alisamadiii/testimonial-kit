import { Resend } from "resend";

import ResetPasswordEmail from "@/emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { type, email, name, resetPasswordLink } = await request.json();

    if (!type) {
      return Response.json({ error: "Type is required" }, { status: 400 });
    }

    let errorMessage: string | null = null;
    let dataMessage: string | null = null;

    if (type === "reset-password") {
      if (!email || !name || !resetPasswordLink) {
        return Response.json(
          { error: "Email, name and resetPasswordLink are required" },
          { status: 400 }
        );
      }

      const { data, error } = await resend.emails.send({
        from: "app@alisamadii.com",
        to: [email],
        subject: "Reset password",
        react: ResetPasswordEmail({
          userFirstname: name,
          resetPasswordLink: resetPasswordLink,
        }),
      });

      if (error) {
        errorMessage = error.message;
      }

      dataMessage = data?.id ?? null;
    }

    if (errorMessage) {
      return Response.json({ error: errorMessage }, { status: 500 });
    }

    return Response.json(dataMessage);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
