import './App.css';
import { CollectionsProvider } from './components/context/CollectionsContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CollectionProducts from './components/products/CollectionProducts';
import { CartProvider } from './components/context/CartContext';
import ProductGrid from './components/products/ProductGrid';
import ProductDetail from './components/products/ProductDetail';
import CartPage from './components/CartPage';
import AboutUs from './components/AboutUs';
import ContactForm from './components/ContactForm';
import PrivacyPolicy from './components/PrivacyPolicy';
import ReturnPolicy from './components/ReturnPolicy';
import FAQs from './components/FAQs';

const App = () => {
  return (
    <div>
      <CollectionsProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductGrid />} />
              <Route path="/collection/:collectionHandle" element={<CollectionProducts />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/About-us" element={<AboutUs />} />
              <Route path="/Contact-us" element={<ContactForm />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/faqs" element={<FAQs />} />

            </Routes>
          </BrowserRouter>
        </CartProvider>
      </CollectionsProvider>
    </div>
  );
};

export default App;
