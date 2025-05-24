"use client"

import { useState } from "react"
import { IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000]

export default function CreditsPage() {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

  const handleProceedPayment = async () => {
    if (!amount || Number.parseFloat(amount) < 10) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert(`Processing payment of ₹${amount}`)
    }, 2000)
  }

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
              <p className="text-2xl font-bold text-foreground">₹2,850.00</p>
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
              onClick={handleProceedPayment}
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