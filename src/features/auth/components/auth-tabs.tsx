"use client";

import { Tabs, TabsContent } from "@/components/ui/shadcn/tabs";
import { LoginForm } from "@/features/auth/components/login-form";
import { useState } from "react";

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");
  return (
    <Tabs
      defaultValue="login"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {activeTab === "login" ? "Welcome" : "Create an account"}
        </h1>
        <p className="text text-muted-foreground">
          {activeTab === "login"
            ? "Sign in to your Artilink account"
            : "Join the Artilink community"}
        </p>
      </div>

      {/* <TabsList className="grid grid-cols-2 mb-6 w-full">
        <TabsTrigger value="login">Sign in</TabsTrigger>
        <TabsTrigger value="register">Sign up</TabsTrigger>
      </TabsList> */}
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>

      {/* <TabsContent value="register">
        <RegisterForm />
      </TabsContent> */}
    </Tabs>
  );
}
