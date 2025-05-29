import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAuth from "@/hooks/useAuthFirebase"
import { auth } from "@/lib/firebase"
import { useWalletStore } from "@/store/store"
import { CircleMinus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export function NavbarWallet() {
    const router = useRouter()
    const { user } = useAuth()
    const { balance, fetchBalance } = useWalletStore()

  useEffect(() => {
    if(user?.uid){
      fetchBalance(user.uid)
    }
  }, [user, fetchBalance])

  const stringifyedBalance = `${balance?.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`

  return (
    <div className="flex w-full max-w-[170px] items-center">
      <Input 
        type="text" 
        value={!user ? "₹ -" : `₹ ${stringifyedBalance}`} 
        readOnly 
        disabled 
        className="rounded-r-none"
      />
      <Button 
        type="submit" 
        onClick={() => {router.push('/wallet')}} 
        className="rounded-l-none py-[19px]"
      >
        Wallet
      </Button>
    </div>
  )
}
