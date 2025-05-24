import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function NavbarWallet() {
    const router = useRouter()
  return (
    <div className="flex w-full max-w-[170px] items-center">
      <Input type="text" value={`₹ ${100}`} className="rounded-r-none" />
      <Button type="submit" onClick={() => {router.push('/wallet')}} className="rounded-l-none py-[19px]" >Wallet</Button>
    </div>
  )
}
