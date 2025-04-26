"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe("pk_test_123")

interface StripeProps {
  options: {
    mode: "payment" | "subscription"
    amount: number
    currency: string
  }
  children: React.ReactNode
  className?: string
}

export function Stripe({ options, children, className }: StripeProps) {
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // This would normally fetch from your API to create a payment intent
    // For demo purposes, we're just setting a fake client secret
    setClientSecret("pi_3NkZf2CIJn6javES1q6dKIGY_secret_vqZMDJKjoSzjYd5Tw9rh440XT")
  }, [])

  return (
    <div className={className}>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          {children}
        </Elements>
      )}
    </div>
  )
}
