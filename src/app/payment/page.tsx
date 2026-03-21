import PaymentForm from "@/components/PaymentForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl">
          <PaymentForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}