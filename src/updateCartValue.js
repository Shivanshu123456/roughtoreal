import gsap from "gsap";

const cartValue = document.querySelector("#cartValue");

export const updateCartValue = (cartProducts) => {
  const count = cartProducts.length;
  const html = ` <i class="fa-solid fa-cart-shopping"> ${count} </i>`;
  if (cartValue) {
    cartValue.innerHTML = html;
    // bounce animation on update
    const icon = cartValue.querySelector("i");
    if (icon) {
      gsap.fromTo(icon, { y: -4, scale: 1.05 }, { y: 0, scale: 1, duration: 0.25, ease: "power2.out" });
    }
  }
  return html;
};