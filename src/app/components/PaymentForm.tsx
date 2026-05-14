import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Smartphone,
  Building2,
  CreditCard,
  Wallet,
  User,
  Calendar,
  BookOpen,
  DollarSign,
} from "lucide-react";
import CalendarPicker from "./CalendarPicker";

interface Course {
  name: string;
  price: number;
}

const availableCourses: Course[] = [
  { name: "Story development", price: 15000 },
  { name: "Animation", price: 12000 },
  { name: "Simple robotics", price: 18000 },
  { name: "Game design", price: 20000 },
  { name: "Code foundation", price: 10000 },
  { name: "Robotics with Quarky", price: 16000 },
  { name: "Introduction to coding", price: 9000 },
  { name: "Programming in Python", price: 14000 },
  { name: "3D modeling", price: 17000 },
  { name: "Web development basics", price: 13000 },
];

const paymentMethods = [
  {
    id: "MPESA",
    name: "MPESA",
    icon: Smartphone,
    color: "#38aae1",
  },
  {
    id: "Bank Transfer",
    name: "Bank Transfer",
    icon: Building2,
    color: "#25476a",
  },
  {
    id: "Card",
    name: "Card",
    icon: CreditCard,
    color: "#38aae1",
  },
  { id: "Cash", name: "Cash", icon: Wallet, color: "#feb139" },
];

export default function PaymentForm() {
  const [learnerName] = useState("John Kamau");
  const [date] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  );
  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment method specific fields
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [cashReceivedBy, setCashReceivedBy] = useState("");
  const [balancePaymentDate, setBalancePaymentDate] = useState<Date | undefined>();

  const filteredCourses = availableCourses.filter((course) =>
    course.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSearchTerm(course.name);
    setShowDropdown(false);
    setErrors({ ...errors, course: "" });
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    // Validate basic fields first
    if (!selectedCourse) {
      newErrors.course = "Please select a course";
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (
      selectedCourse &&
      amount &&
      parseFloat(amount) > selectedCourse.price
    ) {
      newErrors.amount = `Amount cannot exceed course fee (KSh ${selectedCourse.price.toLocaleString()})`;
    }

    if (!paymentMethod) {
      newErrors.paymentMethod =
        "Please select a payment method";
    }

    // Validate balance payment date for partial payments
    if (
      selectedCourse &&
      amount &&
      parseFloat(amount) < selectedCourse.price
    ) {
      if (!balancePaymentDate) {
        newErrors.balancePaymentDate =
          "Please select a date to pay the balance";
      }
    }

    // Validate payment method specific fields
    if (paymentMethod === "MPESA") {
      if (!mpesaPhone || mpesaPhone.length < 10) {
        newErrors.mpesaPhone =
          "Please enter a valid phone number";
      }
    } else if (paymentMethod === "Card") {
      if (!cardNumber || cardNumber.length < 16) {
        newErrors.cardNumber =
          "Please enter a valid card number";
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry =
          "Please enter expiry date (MM/YY)";
      }
      if (!cardCvv || cardCvv.length < 3) {
        newErrors.cardCvv = "Please enter CVV";
      }
      if (!cardName) {
        newErrors.cardName = "Please enter cardholder name";
      }
    } else if (paymentMethod === "Bank Transfer") {
      if (!bankName) {
        newErrors.bankName = "Please select a bank";
      }
      if (!accountNumber) {
        newErrors.accountNumber = "Please enter account number";
      }
      if (!accountName) {
        newErrors.accountName = "Please enter account name";
      }
    } else if (paymentMethod === "Cash") {
      if (!cashReceivedBy) {
        newErrors.cashReceivedBy =
          "Please enter who will receive the cash";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const amountPaid = parseFloat(amount);
      const totalFee = selectedCourse?.price || 0;
      const isFullPayment = amountPaid === totalFee;

      const paymentData = {
        learner: learnerName,
        date,
        course: selectedCourse?.name,
        amount: amountPaid,
        totalFee,
        paymentMethod,
        status: isFullPayment
          ? "Full Payment"
          : "Partial Payment",
        balanceDue: totalFee - amountPaid,
        balancePaymentDate: isFullPayment ? null : balancePaymentDate?.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      };

      console.log("Payment submitted:", paymentData);

      setIsProcessing(false);

      if (paymentMethod === "MPESA") {
        toast.success("MPESA prompt sent!", {
          description: `Check your phone (${mpesaPhone}) to complete the payment`,
        });
      } else {
        toast.success(
          `Payment of KSh ${amountPaid.toLocaleString()} processed successfully!`,
          {
            description: isFullPayment
              ? "Payment completed in full"
              : `Balance due: KSh ${(totalFee - amountPaid).toLocaleString()}`,
          },
        );
      }

      // Reset form
      setSelectedCourse(null);
      setSearchTerm("");
      setAmount("");
      setPaymentMethod("");
      setMpesaPhone("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
      setCardName("");
      setBankName("");
      setAccountNumber("");
      setAccountName("");
      setCashReceivedBy("");
      setBalancePaymentDate(undefined);
    }, 2000);
  };

  const getPaymentStatus = () => {
    if (!selectedCourse || !amount) return null;

    const amountPaid = parseFloat(amount);
    const totalFee = selectedCourse.price;

    if (amountPaid === totalFee) {
      return (
        <div className="mt-6 rounded-2xl border-2 border-[#38aae1] bg-gradient-to-br from-[#38aae1]/10 via-white to-[#38aae1]/5 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <p className="font-bold text-[#25476a] text-xl">
              Payment Summary
            </p>
            <span className="px-5 py-2 rounded-full bg-gradient-to-r from-[#38aae1] to-[#25476a] text-white text-sm font-bold shadow-lg">
              Full Payment
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b-2 border-[#38aae1]/20">
              <span className="text-gray-600 font-medium">
                Total Course Fee:
              </span>
              <span className="font-bold text-[#25476a] text-xl">
                KSh {totalFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 font-medium">
                Amount Paid:
              </span>
              <span className="font-bold text-[#38aae1] text-xl">
                KSh {amountPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-600 pt-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-xl border-l-4 border-green-500">
              <CheckCircle2 size={20} />
              <span className="font-bold">
                Payment completed in full
              </span>
            </div>
          </div>
        </div>
      );
    } else if (amountPaid < totalFee) {
      return (
        <div className="mt-6 rounded-2xl border-2 border-[#feb139] bg-gradient-to-br from-[#feb139]/10 via-white to-[#feb139]/5 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <p className="font-bold text-[#25476a] text-xl">
              Payment Summary
            </p>
            <span className="px-5 py-2 rounded-full bg-gradient-to-r from-[#feb139] to-[#f59e0b] text-white text-sm font-bold shadow-lg">
              Partial Payment
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b-2 border-[#feb139]/20">
              <span className="text-gray-600 font-medium">
                Total Course Fee:
              </span>
              <span className="font-bold text-[#25476a] text-xl">
                KSh {totalFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b-2 border-[#feb139]/20">
              <span className="text-gray-600 font-medium">
                Amount Paid:
              </span>
              <span className="font-bold text-[#38aae1] text-xl">
                KSh {amountPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-4 bg-gradient-to-r from-[#feb139]/20 to-[#feb139]/10 px-4 rounded-xl border-2 border-[#feb139]/30">
              <span className="text-[#25476a] font-bold">
                Balance Due:
              </span>
              <span className="font-bold text-[#feb139] text-2xl">
                KSh {(totalFee - amountPaid).toLocaleString()}
              </span>
            </div>

            <div className="pt-4">
              <label className="block text-xs font-bold text-[#25476a] mb-2 flex items-center gap-2 uppercase tracking-wide">
                <Calendar size={14} className="text-[#feb139]" />
                When will you pay the balance?
              </label>
              <CalendarPicker
                selectedDate={balancePaymentDate}
                onDateSelect={(date) => {
                  setBalancePaymentDate(date);
                  setErrors({ ...errors, balancePaymentDate: "" });
                }}
                minDate={new Date()}
                error={errors.balancePaymentDate}
              />
            </div>

            <p className="text-sm text-[#25476a] pt-4 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 rounded-xl border-l-4 border-[#feb139] font-medium">
              This is a partial payment. Please complete the
              remaining balance by the selected date to continue with the course.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPaymentMethodDetails = () => {
    if (!paymentMethod) return null;

    switch (paymentMethod) {
      case "MPESA":
        return (
          <div className="mt-4 p-6 bg-gradient-to-br from-[#38aae1]/10 to-white border-2 border-[#38aae1] rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-[#38aae1] rounded-lg">
                <Smartphone className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#25476a]">
                MPESA Payment Details
              </h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#25476a] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => {
                  setMpesaPhone(e.target.value);
                  setErrors({ ...errors, mpesaPhone: "" });
                }}
                placeholder="0712345678"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38aae1] focus:border-[#38aae1] transition-all ${
                  errors.mpesaPhone
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              {errors.mpesaPhone && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.mpesaPhone}
                </p>
              )}
              <div className="mt-3 p-3 bg-[#38aae1]/10 rounded-lg border-l-4 border-[#38aae1]">
                <p className="text-[#25476a] text-sm font-medium">
                  📱 You will receive an MPESA prompt on this
                  number
                </p>
              </div>
            </div>
          </div>
        );

      case "Card":
        return (
          <div className="mt-4 p-6 bg-gradient-to-br from-[#38aae1]/10 to-white border-2 border-[#38aae1] rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-[#38aae1] rounded-lg">
                <CreditCard className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#25476a]">
                Card Payment Details
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#25476a] mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                    setErrors({ ...errors, cardName: "" });
                  }}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38aae1] focus:border-[#38aae1] transition-all ${
                    errors.cardName
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                />
                {errors.cardName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.cardName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#25476a] mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(
                      /\s/g,
                      "",
                    );
                    if (value.length <= 16) {
                      setCardNumber(value);
                      setErrors({ ...errors, cardNumber: "" });
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38aae1] focus:border-[#38aae1] transition-all ${
                    errors.cardNumber
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.cardNumber}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#25476a] mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(
                        /\D/g,
                        "",
                      );
                      if (value.length >= 2) {
                        value =
                          value.slice(0, 2) +
                          "/" +
                          value.slice(2, 4);
                      }
                      setCardExpiry(value);
                      setErrors({ ...errors, cardExpiry: "" });
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38aae1] focus:border-[#38aae1] transition-all ${
                      errors.cardExpiry
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  {errors.cardExpiry && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span> {errors.cardExpiry}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#25476a] mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(
                        /\D/g,
                        "",
                      );
                      if (value.length <= 4) {
                        setCardCvv(value);
                        setErrors({ ...errors, cardCvv: "" });
                      }
                    }}
                    placeholder="123"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38aae1] focus:border-[#38aae1] transition-all ${
                      errors.cardCvv
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-white"
                    }`}
                  />
                  {errors.cardCvv && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>⚠️</span> {errors.cardCvv}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "Bank Transfer":
        return (
          <div className="mt-4 p-6 bg-gradient-to-br from-[#25476a]/10 to-white border-2 border-[#25476a] rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-[#25476a] rounded-lg">
                <Building2 className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#25476a]">
                Bank Transfer Details
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#25476a] mb-2">
                  Bank Name
                </label>
                <select
                  value={bankName}
                  onChange={(e) => {
                    setBankName(e.target.value);
                    setErrors({ ...errors, bankName: "" });
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25476a] focus:border-[#25476a] transition-all ${
                    errors.bankName
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <option value="">Select your bank</option>
                  <option value="KCB Bank">KCB Bank</option>
                  <option value="Equity Bank">
                    Equity Bank
                  </option>
                  <option value="Cooperative Bank">
                    Cooperative Bank
                  </option>
                  <option value="Standard Chartered">
                    Standard Chartered
                  </option>
                  <option value="Barclays Bank">
                    Barclays Bank
                  </option>
                  <option value="NCBA Bank">NCBA Bank</option>
                </select>
                {errors.bankName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.bankName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#25476a] mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    setErrors({ ...errors, accountNumber: "" });
                  }}
                  placeholder="Enter your account number"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25476a] focus:border-[#25476a] transition-all ${
                    errors.accountNumber
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.accountNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#25476a] mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => {
                    setAccountName(e.target.value);
                    setErrors({ ...errors, accountName: "" });
                  }}
                  placeholder="Name as it appears on account"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25476a] focus:border-[#25476a] transition-all ${
                    errors.accountName
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                />
                {errors.accountName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.accountName}
                  </p>
                )}
              </div>
              <div className="mt-3 p-3 bg-[#25476a]/10 rounded-lg border-l-4 border-[#25476a]">
                <p className="text-[#25476a] text-sm font-medium">
                  🏦 Transfer will be initiated from your
                  account. Please ensure you have sufficient
                  funds.
                </p>
              </div>
            </div>
          </div>
        );

      case "Cash":
        return (
          <div className="mt-4 p-6 bg-gradient-to-br from-[#feb139]/10 to-white border-2 border-[#feb139] rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-[#feb139] rounded-lg">
                <Wallet className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#25476a]">
                Cash Payment Details
              </h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#25476a] mb-2">
                Received By
              </label>
              <input
                type="text"
                value={cashReceivedBy}
                onChange={(e) => {
                  setCashReceivedBy(e.target.value);
                  setErrors({ ...errors, cashReceivedBy: "" });
                }}
                placeholder="Name of person receiving cash"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#feb139] focus:border-[#feb139] transition-all ${
                  errors.cashReceivedBy
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              {errors.cashReceivedBy && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.cashReceivedBy}
                </p>
              )}
              <div className="mt-3 p-3 bg-[#feb139]/10 rounded-lg border-l-4 border-[#feb139]">
                <p className="text-[#25476a] text-sm font-medium">
                  🧾 Please ensure you receive a physical
                  receipt for this cash payment.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-[#25476a] via-[#25476a] to-[#38aae1] px-8 py-8">
        <h1 className="text-white text-4xl font-bold tracking-tight">
          Make Payment
        </h1>
        <p className="text-white/90 text-base mt-2">
          Complete your course payment securely and easily
        </p>
      </div>

      <form
        onSubmit={handleCompletePayment}
        className="p-8 bg-gradient-to-br from-white to-gray-50"
      >
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <label className="block text-xs font-bold text-[#25476a] mb-2 flex items-center gap-2 uppercase tracking-wide">
              <User size={14} className="text-[#38aae1]" />
              Learner Name
            </label>
            <input
              type="text"
              value={learnerName}
              disabled
              className="w-full px-0 py-1 bg-transparent text-[#25476a] font-semibold text-lg cursor-not-allowed border-none outline-none"
            />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <label className="block text-xs font-bold text-[#25476a] mb-2 flex items-center gap-2 uppercase tracking-wide">
              <Calendar size={14} className="text-[#38aae1]" />
              Payment Date
            </label>
            <input
              type="text"
              value={date}
              disabled
              className="w-full px-0 py-1 bg-transparent text-[#25476a] font-semibold text-lg cursor-not-allowed border-none outline-none"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-[#25476a] mb-3 flex items-center gap-2 uppercase tracking-wide">
            <BookOpen size={14} className="text-[#38aae1]" />
            Course / Description
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Type to search courses..."
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38aae1] focus:border-[#38aae1] transition-all font-medium shadow-sm ${
                errors.course
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-white hover:border-[#38aae1]/50"
              }`}
            />
            {showDropdown && filteredCourses.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-[#38aae1] rounded-xl shadow-2xl max-h-64 overflow-auto">
                {filteredCourses.map((course) => (
                  <div
                    key={course.name}
                    onClick={() => handleCourseSelect(course)}
                    className="px-5 py-4 hover:bg-gradient-to-r hover:from-[#38aae1]/10 hover:to-[#38aae1]/5 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0 transition-all"
                  >
                    <span className="font-semibold text-[#25476a]">
                      {course.name}
                    </span>
                    <span className="text-[#38aae1] font-bold">
                      KSh {course.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.course && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
              <span>⚠️</span> {errors.course}
            </p>
          )}
          {selectedCourse && (
            <div className="mt-3 p-3 bg-gradient-to-r from-[#38aae1]/10 to-[#38aae1]/5 rounded-lg border-l-4 border-[#38aae1]">
              <p className="text-[#25476a] text-sm font-bold flex items-center gap-2">
                <BookOpen
                  size={16}
                  className="text-[#38aae1]"
                />
                Total course fee: KSh{" "}
                {selectedCourse.price.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-[#25476a] mb-3 flex items-center gap-2 uppercase tracking-wide">
            <DollarSign size={14} className="text-[#38aae1]" />
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-5 top-5 text-[#25476a] font-bold text-xl">
              KSh
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors({ ...errors, amount: "" });
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`w-full pl-20 pr-5 py-4 border-2 rounded-xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#38aae1] focus:border-[#38aae1] transition-all shadow-sm ${
                errors.amount
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-white hover:border-[#38aae1]/50"
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
              <span>⚠️</span> {errors.amount}
            </p>
          )}

          {getPaymentStatus()}
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-[#25476a] mb-3 uppercase tracking-wide">
            Payment Method
          </label>
          <div className="flex gap-3 flex-wrap">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(method.id);
                    setErrors({ ...errors, paymentMethod: "" });
                  }}
                  className={`flex flex-col items-center justify-center px-7 py-4 rounded-2xl border-2 transition-all shadow-sm hover:shadow-md ${
                    isSelected
                      ? "border-[#38aae1] bg-gradient-to-br from-[#38aae1]/10 to-[#38aae1]/5 shadow-md"
                      : "border-gray-200 bg-white hover:border-[#38aae1]/30"
                  }`}
                >
                  <div
                    className={`mb-2 p-2.5 rounded-xl transition-all ${
                      isSelected
                        ? "bg-[#38aae1] shadow-lg"
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      size={22}
                      className={
                        isSelected
                          ? "text-white"
                          : "text-gray-600"
                      }
                    />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isSelected
                        ? "text-[#25476a]"
                        : "text-gray-600"
                    }`}
                  >
                    {method.name}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
              <span>⚠️</span> {errors.paymentMethod}
            </p>
          )}

          {renderPaymentMethodDetails()}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isProcessing}
            className={`px-10 bg-gradient-to-r from-[#feb139] via-[#feb139] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#feb139] text-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2 text-base">
                <span className="animate-spin">⏳</span>
                Processing...
              </span>
            ) : (
              <span className="text-base">
                Complete Payment
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
