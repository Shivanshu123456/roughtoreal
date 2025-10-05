import "./style.scss";
import products from "./products.json";
import { showProductContainer } from "./homeProductsCards";
<<<<<<< HEAD
import viteLogo from "/vite.svg";
import javascriptLogo from "./javascript.svg";
=======
import { initAnimations, initSkeletons, rebindProductInteractionsAfterRender } from "./animations";

// Initialize global animations early
initAnimations();

// Show skeletons, then render products, then rebind interactions
initSkeletons();
>>>>>>> main
showProductContainer(products);
rebindProductInteractionsAfterRender();
