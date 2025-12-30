"use client";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ThankYou() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center animate-[fadeInUp_0.5s_ease-out]">
        
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 animate-[popIn_0.4s_ease-in-out]" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been completed successfully.
          <br />
          We appreciate your trust in us.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow-sm transition-transform hover:scale-[1.02]"
        >
          Go to Home
        </button>

        <p className="text-xs text-gray-500 mt-4">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
