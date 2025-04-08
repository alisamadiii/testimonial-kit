import {
  Body,
  Tailwind,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

export const ResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 py-2.5">
          <Preview>Reset your password</Preview>
          <Container className="border border-gray-100 bg-white p-11">
            <Img
              src="https://wl28iu3axg.ufs.sh/f/oXdJ2JUESNJ1a1Shm7pfPLmRq5JW9As8lenwr4bcCI3Dj6oG"
              width="40"
              height="40"
              alt="Logo"
            />
            <Section>
              <Text className="font-sans text-base leading-7 font-light text-gray-600">
                Hi {userFirstname},
              </Text>
              <Text className="font-sans text-base leading-7 font-light text-gray-600">
                Someone recently requested a password change for your account.
                If this was you, you can set a new password here:
              </Text>
              <Button
                className="block w-[210px] rounded-xl bg-black px-2 py-3.5 text-center font-sans text-sm text-white no-underline"
                href={resetPasswordLink}
              >
                Reset password
              </Button>
              <Text className="font-sans text-base leading-7 font-light text-gray-600">
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  userFirstname: "Alan",
  resetPasswordLink: "https://dropbox.com",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
