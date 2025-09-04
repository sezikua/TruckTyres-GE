'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, X, Trash2, Send } from 'lucide-react';
import { Product } from '@/lib/api';

interface CartItem {
  product: Product;
  quantity: number;
}

const UA_REGIONS = [
  'Вінницька','Волинська','Дніпропетровська','Донецька','Житомирська','Закарпатська','Запорізька','Івано-Франківська','Київська','Кіровоградська','Луганська','Львівська','Миколаївська','Одеська','Полтавська','Рівненська','Сумська','Тернопільська','Харківська','Херсонська','Хмельницька','Черкаська','Чернівецька','Чернігівська','м. Київ'
];

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tab, setTab] = useState<'items' | 'quick' | 'checkout'>('items');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Quick order
  const [qFirstName, setQFirstName] = useState('');
  const [qPhone, setQPhone] = useState('');

  // Full checkout
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [delivery, setDelivery] = useState<string[]>([]);
  const [carrierWarehouse, setCarrierWarehouse] = useState('');
  const [message, setMessage] = useState('');

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.regular_price) * item.quantity,
    0
  );

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setTab('items');
    setIsOpen(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).addToCart = addToCart;
      return () => {
        if ((window as any).addToCart === addToCart) {
          (window as any).addToCart = undefined;
        }
      };
    }
  }, []);

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleDelivery = (opt: string) => {
    setDelivery(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };

  const itemsForPayload = useMemo(() => cartItems.map(ci => ({
    id: ci.product.id,
    product_name: ci.product.product_name,
    model: ci.product.model,
    size: ci.product.size,
    regular_price: parseFloat(ci.product.discount_price || ci.product.regular_price),
    quantity: ci.quantity,
  })), [cartItems]);

  async function submitQuick() {
    setSubmitting(true); setError(null); setSuccess(null);
    try {
      if (!qFirstName.trim() || !qPhone.trim()) {
        setError('Вкажіть Імʼя та номер телефону');
        setSubmitting(false); return;
      }
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quick',
          firstName: qFirstName.trim(),
          phone: qPhone.trim(),
          items: itemsForPayload,
          total: Math.round(totalPrice)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Помилка відправки');
      setSuccess('Замовлення надіслано. Ми зателефонуємо вам найближчим часом.');
      setCartItems([]);
    } catch (e: any) {
      setError(e?.message || 'Невідома помилка');
    } finally { setSubmitting(false); }
  }

  async function submitFull() {
    setSubmitting(true); setError(null); setSuccess(null);
    try {
      if (!firstName.trim() || !lastName.trim() || !phone.trim() || !region.trim() || !city.trim() || delivery.length === 0) {
        setError('Заповніть обовʼязкові поля');
        setSubmitting(false); return;
      }
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'full',
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          region,
          city,
          delivery,
          carrierWarehouse: carrierWarehouse.trim() || undefined,
          message: message.trim() || undefined,
          items: itemsForPayload,
          total: Math.round(totalPrice)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Помилка відправки');
      setSuccess('Замовлення надіслано в Telegram. Ми з вами звʼяжемось.');
      setCartItems([]);
    } catch (e: any) {
      setError(e?.message || 'Невідома помилка');
    } finally { setSubmitting(false); }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-white hover:text-white/90 transition-colors"
        aria-label="Кошик"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
              <h2 className="text-xl font-semibold">Кошик</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-4 pt-3 flex gap-2 border-b border-black/10 dark:border-white/10">
              <button onClick={() => setTab('items')} className={`px-3 py-2 rounded-md text-sm ${tab==='items'?'bg-black/5 dark:bg-white/10':''}`}>Товари</button>
              <button onClick={() => setTab('quick')} className={`px-3 py-2 rounded-md text-sm ${tab==='quick'?'bg-black/5 dark:bg-white/10':''}`}>Швидке замовлення</button>
              <button onClick={() => setTab('checkout')} className={`px-3 py-2 rounded-md text-sm ${tab==='checkout'?'bg-black/5 dark:bg-white/10':''}`}>Оформлення</button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {tab === 'items' && (
                cartItems.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">Кошик порожній</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 border border-black/10 dark:border-white/10 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{item.product.product_name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.product.model} • {item.product.size}</p>
                        </div>
                        <div className="text-sm font-medium whitespace-nowrap">
                          {parseFloat(item.product.regular_price).toLocaleString('uk-UA')} грн
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded bg-black/5 dark:bg-white/10">-</button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded bg-black/5 dark:bg_WHITE/10">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded-md">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-medium">Всього:</span>
                      <span className="text-lg font-bold">{totalPrice.toLocaleString('uk-UA')} грн</span>
                    </div>
                  </div>
                )
              )}

              {tab === 'quick' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={qFirstName} onChange={e=>setQFirstName(e.target.value)} placeholder="Імʼя *" className="px-3 py-2 rounded border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800" />
                    <input value={qPhone} onChange={e=>setQPhone(e.target.value)} placeholder="№ телефону *" className="px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800" />
                  </div>
                  <button disabled={submitting} onClick={submitQuick} className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text_WHITE py-3 rounded-lg">
                    <Send className="w-4 h-4" /> Відправити замовлення
                  </button>
                </div>
              )}

              {tab === 'checkout' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Імʼя *" className="px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800" />
                    <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Прізвище *" className="px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800" />
                    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Пошта (необовʼязково)" className="px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800" />
                    <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="№ телефону *" className="px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800" />
                    <select value={region} onChange={e=>setRegion(e.target.value)} className="px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800">
                      <option value="">Область *</option>
                      {UA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Населений пункт *" className="px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800" />
                  </div>

                  <div>
                    <p className="mb-2 font-medium">Спосіб доставки *</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['Нова Пошта','САТ','Делівері','Самовивіз'].map(opt => (
                        <label key={opt} className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={delivery.includes(opt)} onChange={()=>toggleDelivery(opt)} />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <input value={carrierWarehouse} onChange={e=>setCarrierWarehouse(e.target.value)} placeholder="Склад перевізника (необовʼязково)" className="w-full px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800" />

                  <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Повідомлення" className="w-full px-3 py-2 rounded border border-black/10 dark:border_WHITE/10 bg_WHITE dark:bg-neutral-800 min-h-[100px]" />

                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  {success && <p className="text-green-600 text-sm">{success}</p>}

                  <button disabled={submitting} onClick={submitFull} className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text_WHITE py-3 rounded-lg">
                    <Send className="w-4 h-4" /> Оформити замовлення
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
