"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCart } from "@/redux/slices/cartSlice";
import api from "@/services/api";
import { createStripePaymentAPI } from "../components/paymentService";
import Button from "../components/Button";
import { FormInput, FormSelect, FormCheckbox, FormTextArea } from "../components/Form";
import { Badge } from "../components/Badge";
import { useToast, ToastContainer } from "../components/Toast";

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes?: string;
  sameAsShipping: boolean;
}

const initialForm: CheckoutForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "Pakistan",
  notes: "",
  sameAsShipping: true,
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toasts, add, remove } = useToast();

  const items = useAppSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  const total = items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.product.price) * item.quantity,
    0
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name as keyof CheckoutForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCOD = async () => {
    if (!validateForm()) {
      add("Please fill all required fields", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/order/checkout");
      dispatch(clearCart());
      add(`✓ Order placed successfully! Order ID: ${res.data.orderId}`, "success");
      setTimeout(() => router.push("/orders"), 1500);
    } catch (err) {
      console.error(err);
      add("Failed to place order. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStripe = async () => {
    if (!validateForm()) {
      add("Please fill all required fields", "error");
      return;
    }

    try {
      setLoading(true);
      const orderRes = await api.post("/order/checkout");
      const orderId = orderRes.data.orderId;

      const stripeRes = await createStripePaymentAPI(orderId);

      if (!stripeRes.data.url) {
        throw new Error("Stripe URL not found");
      }

      window.location.href = stripeRes.data.url;
    } catch (err) {
      console.error(err);
      add("Stripe checkout failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-8 animate-bounce">🛒</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent mb-4">Your cart is empty</h1>
          <p className="text-gray-600 text-lg font-semibold mb-10">
            Add some items to your cart before checking out.
          </p>
          <Button onClick={() => router.push("/products")} variant="primary" size="lg" className="px-8">
            ← Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div className="mb-12 pb-8 border-b-2 border-gray-200">
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent mb-3">
          🧾 Checkout
        </h1>
        <div className="flex items-center gap-3 text-lg text-gray-700 font-semibold">
          <span className="px-3 py-1.5 bg-blue-100 rounded-lg">📋</span>
          <span>Complete your purchase securely</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Shipping Address */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-md border-2 border-gray-100 p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div>
                <h2 className="text-3xl font-bold text-secondary">Shipping Address</h2>
                <p className="text-gray-600 font-medium">Where should we deliver your order?</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  placeholder="John"
                  required
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  placeholder="Doe"
                  required
                />
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="john@example.com"
                  required
                />
                <FormInput
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  placeholder="+92 300 1234567"
                  required
                />
              </div>

              {/* Address */}
              <FormInput
                label="Street Address"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                error={errors.address}
                placeholder="123 Main Street"
                required
              />

              {/* City, State, Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <FormInput
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  error={errors.city}
                  placeholder="Karachi"
                  required
                />
                <FormInput
                  label="State/Province"
                  name="state"
                  value={form.state}
                  onChange={handleInputChange}
                  error={errors.state}
                  placeholder="Sindh"
                  required
                />
                <FormInput
                  label="Zip Code"
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleInputChange}
                  error={errors.zipCode}
                  placeholder="75600"
                  required
                />
              </div>

              {/* Country */}
              <FormSelect
                label="Country"
                name="country"
                value={form.country}
                onChange={handleInputChange}
                options={[
                  { value: "Pakistan", label: "Pakistan" },
                  { value: "USA", label: "United States" },
                  { value: "UK", label: "United Kingdom" },
                  { value: "Canada", label: "Canada" },
                ]}
                required
              />

              {/* Notes */}
              <FormTextArea
                label="Delivery Instructions (Optional)"
                name="notes"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="e.g., Leave at the door if no one is home"
                rows={3}
              />
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-md border-2 border-gray-100 p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div>
                <h2 className="text-3xl font-bold text-secondary">Payment Method</h2>
                <p className="text-gray-600 font-medium">Choose how you want to pay</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* COD Option */}
              <label
                className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-gray-200 bg-white hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-6 h-6 accent-primary cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-lg text-secondary">💵 Cash on Delivery</p>
                    <p className="text-gray-600 font-semibold">Pay when your order arrives</p>
                  </div>
                </div>
              </label>

              {/* Stripe Option */}
              <label
                className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                  paymentMethod === "stripe"
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-gray-200 bg-white hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="w-6 h-6 accent-primary cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-lg text-secondary">💳 Credit/Debit Card</p>
                    <p className="text-gray-600 font-semibold">Secure payment with Stripe</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border-2 border-gray-100 p-8 sticky top-24 h-fit">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <h2 className="text-2xl font-bold text-secondary">Summary</h2>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-8 pb-8 border-b-2 border-gray-200 max-h-56 overflow-y-auto">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors">
                  <img
                    src={item.product.image || "https://via.placeholder.com/60"}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-secondary line-clamp-1 text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-gray-600 font-semibold text-xs">Qty: {item.quantity}</p>
                    <p className="font-bold text-primary text-base">
                      Rs {Number(item.product.price) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-8 pb-8 border-b-2 border-gray-200">
              <div className="flex justify-between font-semibold text-gray-700">
                <span>Subtotal</span>
                <span>Rs {total}</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-gray-700">Shipping</span>
                <Badge variant="success" size="sm">
                  ✓ Free
                </Badge>
              </div>
              <div className="flex justify-between font-semibold text-gray-700">
                <span>Tax</span>
                <span>Rs 0</span>
              </div>
              <div className="flex justify-between items-center bg-gradient-to-r from-primary/5 to-teal-500/5 rounded-xl p-4 mt-4">
                <span className="text-lg font-bold text-secondary">Total</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">Rs {total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={paymentMethod === "cod" ? handleCOD : handleStripe}
                disabled={loading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Processing...
                  </>
                ) : paymentMethod === "cod" ? (
                  "💵 Place Order"
                ) : (
                  "💳 Pay Now"
                )}
              </Button>

              <Button
                onClick={() => router.push("/cart")}
                disabled={loading}
                variant="outline"
                size="lg"
                className="w-full"
              >
                ← Back to Cart
              </Button>
            </div>

            {/* Security Info */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
              <p className="text-sm font-bold text-green-700 text-center flex items-center gap-2 justify-center">
                <span>🔒</span>
                Secure & Encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
