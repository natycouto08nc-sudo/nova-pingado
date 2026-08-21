'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { CarrinhoItem } from '@/lib/types';
import type { Cupom } from '@/lib/coupons';

const CART_STORAGE_KEY = 'pingado_cart';
const FRETE_STORAGE_KEY = 'pingado_frete';
const CUPOM_STORAGE_KEY = 'pingado_cupom';

interface CartContextType {
  items: CarrinhoItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  addItem: (payload: Omit<CarrinhoItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantidade: number) => void;
  clearCart: () => void;
  cep: string;
  freteCalculado: boolean;
  setCep: (cep: string) => void;
  calcularFrete: () => void;
  cupom: Cupom | null;
  setCupom: (cupom: Cupom | null) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  loading: true,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cep: '',
  freteCalculado: false,
  setCep: () => {},
  calcularFrete: () => {},
  cupom: null,
  setCupom: () => {},
});

function buildLineId(cafeId: string, varianteId?: string, moagem?: string) {
  return [cafeId, varianteId ?? 'default', moagem ?? 'default'].join('::');
}

function persist(items: CarrinhoItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function persistFrete(cep: string, calculado: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FRETE_STORAGE_KEY, JSON.stringify({ cep, calculado }));
}

function persistCupom(cupom: Cupom | null) {
  if (typeof window === 'undefined') return;
  if (cupom) {
    localStorage.setItem(CUPOM_STORAGE_KEY, JSON.stringify(cupom));
  } else {
    localStorage.removeItem(CUPOM_STORAGE_KEY);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CarrinhoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cep, setCepState] = useState('');
  const [freteCalculado, setFreteCalculado] = useState(false);
  const [cupom, setCupomState] = useState<Cupom | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedFrete = localStorage.getItem(FRETE_STORAGE_KEY);
      if (savedFrete) {
        const parsed = JSON.parse(savedFrete);
        setCepState(parsed.cep ?? '');
        setFreteCalculado(Boolean(parsed.calculado));
      }
      const savedCupom = localStorage.getItem(CUPOM_STORAGE_KEY);
      if (savedCupom) {
        setCupomState(JSON.parse(savedCupom));
      }
    } catch (e) {
      console.error('Erro ao ler carrinho salvo:', e);
    }
    setLoading(false);
  }, []);

  const addItem = (payload: Omit<CarrinhoItem, 'id'>) => {
    const id = buildLineId(payload.cafeId, payload.varianteId, payload.moagem);

    setItems((prev) => {
      const existente = prev.find((item) => item.id === id);
      let next: CarrinhoItem[];

      if (existente) {
        const limite = payload.estoqueMaximo ?? existente.estoqueMaximo;
        const novaQuantidade = limite
          ? Math.min(existente.quantidade + payload.quantidade, limite)
          : existente.quantidade + payload.quantidade;
        next = prev.map((item) =>
          item.id === id ? { ...item, quantidade: novaQuantidade } : item,
        );
      } else {
        next = [...prev, { ...payload, id }];
      }

      persist(next);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persist(next);
      return next;
    });
  };

  const updateQuantity = (id: string, quantidade: number) => {
    setItems((prev) => {
      const next = prev.map((item) => {
        if (item.id !== id) return item;
        const limite = item.estoqueMaximo;
        const clamped = Math.max(1, limite ? Math.min(quantidade, limite) : quantidade);
        return { ...item, quantidade: clamped };
      });
      persist(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    persist([]);
    setCepState('');
    setFreteCalculado(false);
    persistFrete('', false);
    setCupomState(null);
    persistCupom(null);
  };

  const setCep = (novoCep: string) => {
    setCepState(novoCep);
    setFreteCalculado(false);
    persistFrete(novoCep, false);
  };

  const calcularFrete = () => {
    setFreteCalculado(true);
    persistFrete(cep, true);
  };

  const setCupom = (novoCupom: Cupom | null) => {
    setCupomState(novoCupom);
    persistCupom(novoCupom);
  };

  const itemCount = items.reduce((total, item) => total + item.quantidade, 0);
  const subtotal = items.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cep,
        freteCalculado,
        setCep,
        calcularFrete,
        cupom,
        setCupom,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
