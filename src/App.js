import React from 'react';
import './App.css';

function App() {
  const [products, setProducts] = React.useState([
    { id: 1, name: 'Camisa', price: 25.99, image: '/api/placeholder/80/80', quantity: 0 },
    { id: 2, name: 'Pantalón', price: 39.99, image: '/api/placeholder/80/80', quantity: 0 },
    { id: 3, name: 'Zapatos', price: 59.99, image: '/api/placeholder/80/80', quantity: 0 },
    { id: 4, name: 'Gorra', price: 15.99, image: '/api/placeholder/80/80', quantity: 0 },
  ]);
  
  const [cart, setCart] = React.useState([]);
  const [showCart, setShowCart] = React.useState(false);
  
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };
  
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
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
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <div className="App">
      <header className="header">
        <h1>Mi Tienda Online</h1>
        <button 
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          {showCart ? 'Seguir comprando' : 'Ver carrito'} 
          {cartItemCount > 0 && (
            <span className="badge">{cartItemCount}</span>
          )}
        </button>
      </header>
      
      {!showCart ? (
        <div className="products-container">
          <h2>Nuestros Productos</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
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
              <div className="cart-footer">
                <div className="total">
                  <p>Total: ${calculateTotal()}</p>
                  <p className="taxes">Impuestos incluidos</p>
                </div>
                <button className="checkout-btn">
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