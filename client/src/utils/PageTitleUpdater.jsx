import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PageTitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    let title = "Pluto Intero | Affordable Home Decor in India"; // default title

    if (path === "/") title = "Home | Pluto Intero - Affordable Home Decor";
    else if (path.startsWith("/auth")) title = "Login / Signup | Pluto Intero";
    else if (path.startsWith("/terms-condition"))
      title = "Terms & Conditions | Pluto Intero";
    else if (path.startsWith("/about")) title = "About Us | Pluto Intero";
    else if (path.startsWith("/contact")) title = "Contact Us | Pluto Intero";
    else if (path.startsWith("/products"))
      title = "Products | Pluto Intero - Explore Home Decor";
    else if (path.startsWith("/product/"))
      title = "Product Details | Pluto Intero";
    else if (path.startsWith("/cart")) title = "Your Cart | Pluto Intero";
    else if (path.startsWith("/checkout")) title = "Checkout | Pluto Intero";
    else if (path.startsWith("/profile")) title = "Your Profile | Pluto Intero";
    else if (path.startsWith("/payment-success"))
      title = "Payment Success | Pluto Intero";
    else if (path.startsWith("/payment-failed"))
      title = "Payment Failed | Pluto Intero";
    else if (path.startsWith("/admin"))
      title = "Admin Dashboard | Pluto Intero";
    else title = "Page Not Found | Pluto Intero";

    document.title = title;
  }, [location]);

  return null;
}

export default PageTitleUpdater;
