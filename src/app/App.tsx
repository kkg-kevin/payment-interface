import PaymentForm from './components/PaymentForm';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#25476a]/10 via-white to-[#38aae1]/10 py-12 px-4">
      <PaymentForm />
      <Toaster position="top-right" richColors />
    </div>
  );
}