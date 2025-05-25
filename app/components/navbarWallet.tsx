import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useAuth from "@/hooks/useAuthFirebase"
import { auth } from "@/lib/firebase"
import { CircleMinus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export function NavbarWallet() {
    const router = useRouter()
    const { user } = useAuth()
    const [balance, setBalance] = useState<number | null>(null)

    const fetchBalance = async() => {
    try{
      const response = await fetch(`/api/sso-login?firebaseUid=${user?.uid}`)
      if(!response.ok){
        throw new Error("Fail to fetch profile data");
      }
      const data = await response.json()
      return data;
    }catch(error){
      console.log("Failed fetching account balance")
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    const loadBalance = async() => {
      const data = await fetchBalance()
      if(data?.credits !== undefined){
        setBalance(data.credits)
      }
    }
    loadBalance()
  }, [user])

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
