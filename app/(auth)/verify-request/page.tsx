"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const VerifyRequest = () => {
    const router=useRouter();
  const [otp, setOtp] = useState("");
   const [emailPending, startemailTransition] = useTransition();
   const params=useSearchParams()
   const email=params.get("email");
   const isOtpCompleted=otp.length==6;

   function verifyOtp(){
    startemailTransition(async()=>{
        await authClient.signIn.emailOtp({
            email:email,
            otp:otp,
            fetchOptions:{
                onSuccess:()=>{
                    toast.success("Email Verify")
                    router.push("/")
                },
                onError:()=>{
                    toast.error("Error in Verifying otp")
                }
            }
        })
    })
   }



  return (
    <div>
      <Card className="w-full mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Please check your email</CardTitle>
          <CardDescription>
            We have sent a verification email on to yor email address. please
            open email and paste the code below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to you email</p>
          </div>

        <Button onClick={verifyOtp} disabled={emailPending || !isOtpCompleted} className="w-full">
            {emailPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <Send className="size-4" />
              Verify your Account
            </>
          )}
            </Button>
        </CardContent>

      </Card>
    </div>
  );
};

export default VerifyRequest;
