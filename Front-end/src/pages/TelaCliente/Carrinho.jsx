import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (produto, tamanho, quantidade, lojaNome, lojaId) => {
    setCartItems((prevItems) => {
      const itemExistenteIndex = prevItems.findIndex(
        item => item.id === produto.id && item.tamanho === tamanho
      );

      if (itemExistenteIndex >= 0) {
        const novosItems = [...prevItems];
        novosItems[itemExistenteIndex].quantidade += quantidade;
        return novosItems;
      } else {
        return [...prevItems, { 
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imgUrl: produto.imgUrl,
            lojaNome: lojaNome, 
            lojaId: lojaId,
            tamanho,
            quantidade 
        }];
      }
    });
  };

  const removeFromCart = (produtoId, tamanho) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === produtoId && item.tamanho === tamanho))
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);