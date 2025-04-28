import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Camisa', price: 25.99, image: '/api/placeholder/80/80', quantity: 0, category: 'ropa' },
    { id: 2, name: 'Pantalón', price: 39.99, image: '/api/placeholder/80/80', quantity: 0, category: 'ropa' },
    { id: 3, name: 'Zapatos', price: 59.99, image: '/api/placeholder/80/80', quantity: 0, category: 'calzado' },
    { id: 4, name: 'Gorra', price: 15.99, image: '/api/placeholder/80/80', quantity: 0, category: 'accesorios' },
    { id: 5, name: 'Reloj', price: 89.99, image: '/api/placeholder/80/80', quantity: 0, category: 'accesorios' },
    { id: 6, name: 'Bufanda', price: 19.99, image: '/api/placeholder/80/80', quantity: 0, category: 'accesorios' },
  ]);
  
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
    
    showNotification(`¡${product.name} añadido al carrito!`, 'success');
  };
  
  const removeFromCart = (productId) => {
    const productToRemove = cart.find(item => item.id === productId);
    setCart(cart.filter(item => item.id !== productId));
    showNotification(`${productToRemove.name} eliminado del carrito`, 'info');
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId ? {...item, quantity: newQuantity} : item
      ));
    }
  };
  
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCouponCode('');
    showNotification('Carrito vaciado completamente', 'info');
  };
  
  const applyCoupon = () => {
    // Códigos de cupón de ejemplo
    const coupons = {
      'DESCUENTO10': 10,
      'DESCUENTO20': 20,
      'PRIMAVERA': 15
    };
    
    if (coupons[couponCode]) {
      setDiscount(coupons[couponCode]);
      showNotification(`¡Cupón aplicado! ${coupons[couponCode]}% de descuento`, 'success');
    } else {
      showNotification('Cupón no válido', 'error');
    }
  };
  
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * (discount / 100);
    return (subtotal - discountAmount).toFixed(2);
  };
  
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Obtener categorías únicas para el filtro
  const categories = [...new Set(products.map(product => product.category))];
  
  return (
    <div className="App">
      <header className="header">
        <h1>Mi Tienda Online</h1>
        <div className="header-actions">
          <button 
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            {showCart ? 'Seguir comprando' : 'Ver carrito'} 
            {cartItemCount > 0 && (
              <span className="badge">{cartItemCount}</span>
            )}
          </button>
        </div>
      </header>
      
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      {!showCart ? (
        <div className="products-container">
          <h2>Nuestros Productos</h2>
          
          <div className="filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="category-filter">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <span className="product-category">{product.category}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="add-to-cart"
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="cart-container">
          <h2>Tu Carrito de Compras</h2>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío</p>
              <button 
                onClick={() => setShowCart(false)}
                className="continue-shopping"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div>
                        <h3>{item.name}</h3>
                        <p>${item.price}</p>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="coupon-section">
                <input
                  type="text"
                  placeholder="Código de cupón"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  onClick={applyCoupon}
                  className="apply-coupon"
                >
                  Aplicar
                </button>
                <button 
                  onClick={clearCart}
                  className="clear-cart"
                >
                  Vaciar carrito
                </button>
              </div>
              
              <div className="cart-footer">
                <div className="total">
                  <div className="subtotal">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="discount">
                      <span>Descuento ({discount}%):</span>
                      <span>-${(calculateSubtotal() * (discount / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="final-total">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <p className="taxes">Impuestos incluidos</p>
                </div>
                <button 
                  className="checkout-btn"
                  onClick={() => showNotification('¡Gracias por tu compra!', 'success')}
                >
                  Proceder al pago
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;