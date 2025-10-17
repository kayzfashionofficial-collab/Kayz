import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";

// Components
import TopStrip from "../TopStrip";
import Navigation from "../Navigation/Navigation";
import MobileNav from "../Navigation/MobileNav";

import logoImg from "../../assets/logo.jpg";

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev);

  const navData = {
    logo: {
      src: logoImg,
      alt: "Kayz",
    },
    navLinks: [
      { label: "Home", to: "/" },
      { label: "Shop By Category", hasDropdown: true },
      { label: "About", to: "/About-Us" },
      { label: "Contact", to: "/Contact-us" },
    ],
    icons: [
      { icon: <ShoppingBag size={18} />, label: "Cart", to: "/cart" },
    ],
  };

  return (
    <>
   
      <TopStrip />

    
      <Navigation
        data={navData}
        isMobileNavOpen={isMobileNavOpen}
        toggleMobileNav={toggleMobileNav}
      />

   
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={toggleMobileNav}
        links={navData.navLinks}
      />
    </>
  );
};

export default Header;