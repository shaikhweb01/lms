"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"
import { toast } from "sonner";

export function useSignOut(){
    const router=useRouter()
     const handleSignOut=async function signOut() {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  toast.success("Singed out Successfully");
                  router.push("/");
                },
                onError:()=>{
                    toast.error("Failed to signOut")
                }
              },
            });
          }
          return handleSignOut; 
        
}
