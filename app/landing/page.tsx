import Link from "next/link"
import Image from "next/image"


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8 relative">
      <div className="absolute top-4 left-4">
        <Image src='https://i.ibb.co/tdLHv3C/Minimalist-Hospital-and-Medical-Health-Logo-1.png' alt="MedChain Logo" width={150} height={150} />
      </div>
      <h1 className="text-4xl font-bold mb-4">Welcome to MedChain</h1>
      <p className="text-lg max-w-xl text-center mb-6">
        Secure, private, and controlled sharing of medical research data using blockchain technology.
      </p>
      <Link href="/dashboard">
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded">
          Get Started
        </button>
      </Link>
    </div>
  )
}
