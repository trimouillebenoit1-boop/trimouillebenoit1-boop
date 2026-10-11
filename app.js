const products = [
 {id:1,name:"Moto tout-terrain électrique 10 000 W – 72 V",category:"moto",price:3999,icon:"🏍",tag:"PRODUIT PHARE",description:"Fiche illustrative : puissance, autonomie, homologation et disponibilité à confirmer auprès du fabricant."},
 {id:2,name:"Moto électrique tout-terrain – modèle 6 000 W",category:"moto",price:2499,icon:"🏍",tag:"SÉLECTION",description:"Modèle de démonstration. Spécifications et usage légal à vérifier."},
 {id:3,name:"Casque tout-terrain",category:"equipement",price:149,icon:"⛑",tag:"ÉQUIPEMENT",description:"Exemple de fiche : vérifier la certification applicable et la taille avant toute vente."},
 {id:4,name:"Lunettes de protection",category:"equipement",price:49,icon:"🥽",tag:"ÉQUIPEMENT",description:"Accessoire de démonstration. Compatibilité et normes à confirmer."},
 {id:5,name:"Gants tout-terrain",category:"equipement",price:39,icon:"🧤",tag:"ÉQUIPEMENT",description:"Tailles et protections à confirmer auprès du fournisseur."},
 {id:6,name:"Chargeur compatible 72 V",category:"accessoire",price:129,icon:"🔌",tag:"ACCESSOIRE",description:"Exemple fictif. Tension, connectique et sécurité doivent être vérifiées avant vente."},
 {id:7,name:"Batterie de remplacement 72 V",category:"accessoire",price:799,icon:"🔋",tag:"ACCESSOIRE",description:"Exemple fictif. Compatibilité, transport et conformité à vérifier impérativement."},
 {id:8,name:"Support d'entretien",category:"accessoire",price:89,icon:"🛠",tag:"ATELIER",description:"Accessoire de démonstration pour l'entretien et le rangement."}
];
let cart = JSON.parse(localStorage.getItem("emoto-cart") || "[]");
const euro = n => n.toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
const grid = document.getElementById("productGrid");
function renderProducts(){
 const q=document.getElementById("search").value.trim().toLowerCase();
 const cat=document.getElementById("category").value;
 const sort=document.getElementById("sort").value;
 let list=products.filter(p=>(cat==="all"||p.category===cat)&&(p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)));
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-art"><span class="tag">${p.tag}</span><span class="symbol" aria-hidden="true">${p.icon}</span></div><div class="product-info"><span class="product-category">${p.category==="moto"?"Motos électriques":p.category==="equipement"?"Équipements":"Accessoires"}</span><h3>${p.name}</h3><div class="product-price">${euro(p.price)}</div><p class="fine">${p.description}</p><button class="button button-red add" data-id="${p.id}">Ajouter au panier +</button></div></article>`).join(""):'<p class="no-results">Aucun produit trouvé. Essaie une autre recherche.</p>';
 grid.querySelectorAll(".add").forEach(b=>b.addEventListener("click",()=>addToCart(Number(b.dataset.id))));
}
function saveCart(){localStorage.setItem("emoto-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();openCart();}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0);document.getElementById("cartCount").textContent=count;
 const el=document.getElementById("cartItems");
 if(!cart.length){el.innerHTML='<p class="empty-cart">Ton panier est vide pour le moment.</p>';}
 else{el.innerHTML=cart.map(x=>{const p=products.find(p=>p.id===x.id);return `<div class="cart-line"><div><h3>${p.name}</h3><p>${euro(p.price)}</p><div class="quantity"><button data-action="minus" data-id="${p.id}" aria-label="Retirer une unité">−</button><span>${x.qty}</span><button data-action="plus" data-id="${p.id}" aria-label="Ajouter une unité">+</button></div></div><button class="remove" data-action="remove" data-id="${p.id}">Retirer</button></div>`}).join("");}
 el.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>{const id=Number(b.dataset.id);if(b.dataset.action==="minus")changeQty(id,-1);if(b.dataset.action==="plus")changeQty(id,1);if(b.dataset.action==="remove")removeItem(id);}));
 document.getElementById("cartTotal").textContent=euro(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartBackdrop").classList.add("open");}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartBackdrop").classList.remove("open");}
document.getElementById("cartOpen").addEventListener("click",openCart);document.getElementById("cartClose").addEventListener("click",closeCart);document.getElementById("cartBackdrop").addEventListener("click",closeCart);
document.getElementById("search").addEventListener("input",renderProducts);document.getElementById("category").addEventListener("change",renderProducts);document.getElementById("sort").addEventListener("change",renderProducts);
document.getElementById("checkout").addEventListener("click",()=>{document.getElementById("checkoutNote").textContent="Démo uniquement : aucun paiement, aucune commande et aucune donnée client ne sont envoyés. Active une solution de paiement et ajoute les pages légales avant toute vente.";});
document.getElementById("contactForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("contactFeedback").textContent="Merci ! Démonstration uniquement : ce formulaire n'envoie pas de message.";e.target.reset();});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
