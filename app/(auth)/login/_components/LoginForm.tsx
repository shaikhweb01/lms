"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { error } from "console";
import { GithubIcon, Loader, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export default function LoginForm() {
    const router=useRouter()
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startemailTransition] = useTransition();
  const [email,setEmail]=useState("")

  async function signInWithGitHub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in with Github, you will be redirected...");
          },
          onError: () => {
            toast.error("Intenal server error");
          },
        },
      });
    });
  }
  function signInWithEmail(){
    startemailTransition(async()=>{
        await authClient.emailOtp.sendVerificationOtp({
            email:email,
            type:"sign-in",
            fetchOptions:{
                onSuccess:()=>{
                    toast.success("Email send")
                    router.push(`/verify-request?email=${email}`)
                },
                 onError: () => {
            toast.error("Error sending in email");
          },
            }
        })
    })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>Login with your github Email Account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={githubPending}
          onClick={signInWithGitHub}
          className="w-full "
          variant={"outline"}
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Sign in with GitHub
            </>
          )}
        </Button>
        <div
          className='relative text-center text-sm 
            after:content-[""] after:absolute after:inset-0 after:top-1/2
            after:z-0 after:flex after:items-center after:border-t after:border-border'
        >
          <span className="relative z-10 px-2 bg-card text-muted-foreground">
            Or Continue With
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} required type="email" placeholder="m@example.com" />
          </div>
          <Button onClick={signInWithEmail} disabled={emailPending}>

             {emailPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <Send className="size-4" />
              Continue with Email
            </>
          )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}