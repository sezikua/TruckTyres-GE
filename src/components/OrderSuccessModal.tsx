'use client';

import { CheckCircle, X } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderSuccessModal({ isOpen, onClose }: OrderSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Дякуємо!</h2>
          
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Ваше замовлення надіслано. Ми зв&apos;яжемось з Вами якомога швидше.
          </p>
          
          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  );
}
