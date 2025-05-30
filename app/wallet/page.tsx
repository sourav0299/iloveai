"use client"

import { useEffect, useState } from "react"
import { IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuth from "@/hooks/useAuthFirebase"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Loader from "../components/loader"

declare global {
  interface Window {
    Razorpay: any;
  }
}


const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000]

export default function CreditsPage() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, loading } = useAuth()
  const [balance, setBalance] = useState<number | null>(null)
  const router = useRouter()

  const handleUpdateCredits = async(amount: number, firebaseUid: string) => {
    const response = await fetch('/api/purchase-credit', {
      method: 'PUT',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({amount, firebaseUid})
    });
    if(!response.ok){
      throw new Error("Fail to update credits");
    }
    return response.json();
  }

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

  // Handle authentication check
  useEffect(() => {
    // Only redirect if not loading and no user
    if (!loading && !user) {
      toast.error("Please login to access wallet")
      router.push('/')
    }
  }, [user, router, loading])

  // Show loading state while checking auth
  if (loading) {
    return (
      <Loader />
    )
  }

  // Protect the page from unauthorized access
  if (!user) return null

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

const handleProceedPayment = async () => {
  if (!amount || Number.parseFloat(amount) < 10) return
  
  setIsLoading(true)
  
  toast.promise(
    handleUpdateCredits(Number(amount), user.uid)
      .then(async (response) => {
        const data = await fetchBalance()
        if (data?.credits !== undefined) {
          setBalance(data.credits)
        }
        return response
      }),
    {
      loading: `Processing payment of ₹${amount}`,
      success: <b>Payment Success!</b>,
      error: <b>Payment Failed!</b>
    }
  ).finally(() => {
    setIsLoading(false)
  })
}

// First, add this interface at the top of the file
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Replace the handlePayment function
const handlePayment = async (amount: number) => {
  try {
    setIsLoading(true);
    
    // Create Razorpay order
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment order');
    }

    const data = await response.json();

    // Initialize Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency,
      name: "I LOVE AI",
      description: `Payment for ${data.orderId}`,
      image: "/logo.png",
      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
      },
      theme: {
        color: "#000000"
      },
      handler: async (response: RazorpayResponse) => {
        try {
          await handleUpdateCredits(amount, user.uid);
          const newBalance = await fetchBalance();
          
          if (newBalance?.credits !== undefined) {
            setBalance(newBalance.credits);
            toast.success(`₹${amount} Credits Added to Wallet`);
          }
        } catch (error) {
          console.error('Credit update failed:', error);
          toast.error("Failed to update credits. Please contact support.");
        }
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          toast.error("Payment cancelled");
        }
      }
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on('payment.failed', (resp: { error: { description: string } }) => {
      setIsLoading(false);
      toast.error(resp.error.description || "Payment failed");
    });

    razorpay.open();
  } catch (error) {
    console.error("Payment initialization failed:", error);
    toast.error("Failed to process payment");
    setIsLoading(false);
  }
};

  const isValidAmount = amount && Number.parseFloat(amount) >= 10 && Number.parseFloat(amount) <= 25000

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Add Credits</h1>
          <p className="text-muted-foreground">Top up your account balance</p>
        </div>

        {/* Current Balance */}
        <Card className="border border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
             <p className="text-2xl font-bold text-foreground">
        {balance === null ? (
          <span className="animate-pulse">Loading...</span>
        ) : (
          `₹${balance.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        )}
      </p>
            </div>
          </CardContent>
        </Card>

        {/* Add Credits Form */}
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Select */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {QUICK_AMOUNTS.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === quickAmount.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="h-10 text-sm w-full"
                >
                  ₹{quickAmount.toLocaleString("en-IN")}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Custom Amount
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount in INR"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 h-12"
                  min="10"
                  max="25000"
                />
              </div>
              <p className="text-xs text-muted-foreground">Min ₹10 • Max ₹25,000</p>
            </div>

            {/* Total Display */}
            {amount && isValidAmount && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-xl font-semibold text-foreground">
                    ₹
                    {Number.parseFloat(amount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Proceed Button */}
            <Button
              className="w-full h-12 text-base"
              disabled={!isValidAmount || isLoading}
              onClick={() => handlePayment(Number(amount))}
            >
              {isLoading ? "Processing..." : amount ? `Add ₹${amount} Credits` : "Enter Amount"}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Credits never expire and are non-refundable • Amount in INR
        </p>
      </div>
    </div>
  )
}