import "./style.scss";
import products from "./products.json";
import { showProductContainer } from "./homeProductsCards";
import { initAnimations, initSkeletons, rebindProductInteractionsAfterRender } from "./animations";

// Initialize global animations early
initAnimations();

// Show skeletons, then render products, then rebind interactions
initSkeletons();
showProductContainer(products);
rebindProductInteractionsAfterRender();
