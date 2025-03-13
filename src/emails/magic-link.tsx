import * as React from "react";
import { Html, Button, Heading, Text } from "@react-email/components";

export function MagicLinkEmail({ url }: { url: string }) {
  return (
    <Html lang="en">
      <Heading as="h1">Here is your magic link</Heading>
      <Text>Click the link below to connect to PFE</Text>
      <Button
        href={url}
        style={{
          color: "white",
          padding: "10px 20px",
          backgroundColor: "red",
          borderRadius: "5px",
        }}
        target="_blank"
      >
        Click me
      </Button>
    </Html>
  );
}
