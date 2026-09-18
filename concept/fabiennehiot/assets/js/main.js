/* Fabienne Hiot · interactions */
(function(){
  "use strict";
  var d=document, root=d.documentElement;
  root.classList.remove("no-js");

  /* En-tête : ombre au défilement */
  var header=d.querySelector(".header");
  function onScroll(){ if(header) header.classList.toggle("scrolled", window.scrollY>8); }
  onScroll(); window.addEventListener("scroll", onScroll, {passive:true});

  /* Menu mobile */
  var burger=d.querySelector(".burger"), mnav=d.getElementById("mnav");
  function closeMenu(){ if(!burger) return; burger.setAttribute("aria-expanded","false"); mnav.classList.remove("open"); d.body.style.overflow=""; mnav.setAttribute("aria-hidden","true"); mnav.inert=true; }
  if(burger && mnav){
    mnav.inert=true;
    burger.addEventListener("click", function(){
      var open=burger.getAttribute("aria-expanded")!=="true";
      burger.setAttribute("aria-expanded", String(open));
      mnav.classList.toggle("open", open);
      mnav.setAttribute("aria-hidden", String(!open));
      mnav.inert=!open;
      d.body.style.overflow=open?"hidden":"";
      burger.setAttribute("aria-label", open?"Fermer le menu":"Ouvrir le menu");
    });
    d.addEventListener("keydown", function(e){ if(e.key==="Escape") closeMenu(); });
    window.addEventListener("resize", function(){ if(window.innerWidth>1180) closeMenu(); });
  }

  /* Sous-menu « Mes pratiques » : clic / clavier */
  d.querySelectorAll(".has-sub").forEach(function(li){
    var btn=li.querySelector(".sub-toggle");
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      var open=!li.classList.contains("open");
      li.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open));
    });
    d.addEventListener("click", function(e){ if(!li.contains(e.target)){ li.classList.remove("open"); btn.setAttribute("aria-expanded","false"); } });
    li.addEventListener("keydown", function(e){ if(e.key==="Escape"){ li.classList.remove("open"); btn.setAttribute("aria-expanded","false"); btn.focus(); } });
  });

  /* Apparitions au défilement */
  var reveals=d.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    },{rootMargin:"0px 0px -8% 0px",threshold:.08});
    reveals.forEach(function(el){ io.observe(el); });
  } else { reveals.forEach(function(el){ el.classList.add("in"); }); }

  /* Blocs « Lire la suite » */
  d.querySelectorAll(".more").forEach(function(box){
    var btn=box.querySelector(".more-btn"), label=btn.querySelector("span");
    var closed=label.textContent, opened=btn.getAttribute("data-less")||"Réduire";
    btn.addEventListener("click", function(){
      var open=!box.classList.contains("open");
      box.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      label.textContent=open?opened:closed;
    });
  });

  /* Galerie : visionneuse */
  var lb=d.querySelector("dialog.lightbox");
  if(lb && typeof lb.showModal==="function"){
    var lbImg=lb.querySelector("img"), lbCap=lb.querySelector("p");
    d.querySelectorAll("[data-lightbox]").forEach(function(b){
      b.addEventListener("click", function(){
        lbImg.src=b.getAttribute("data-lightbox");
        lbImg.alt=b.getAttribute("data-alt")||"";
        lbImg.classList.toggle("rot", b.hasAttribute("data-rot"));
        lbCap.textContent=b.getAttribute("data-alt")||"";
        lb.showModal();
      });
    });
    lb.querySelector(".lb-close").addEventListener("click", function(){ lb.close(); });
    lb.addEventListener("click", function(e){ if(e.target===lb) lb.close(); });
  }

  /* Carte : chargée seulement à la demande (respect de la vie privée) */
  d.querySelectorAll("[data-map]").forEach(function(btn){
    btn.addEventListener("click", function(){
      var box=btn.closest(".map"), f=d.createElement("iframe");
      f.src=btn.getAttribute("data-map"); f.title="Carte : cabinet de Fabienne Hiot à Agay"; f.loading="lazy"; f.referrerPolicy="no-referrer-when-downgrade";
      box.innerHTML=""; box.appendChild(f);
    });
  });

  /* Horaires : jour courant mis en avant */
  var today=(new Date().getDay()+6)%7;
  d.querySelectorAll(".hours").forEach(function(ul){ var li=ul.children[today]; if(li) li.classList.add("today"); });

  /* Formulaire de contact : ouvre la messagerie avec le message pré-rempli */
  var form=d.getElementById("contact-form");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if(!form.reportValidity()) return;
      var v=function(n){ return (form.elements[n].value||"").trim(); };
      var subject=(v("sujet")||"Demande d'information")+" · "+v("prenom")+" "+v("nom");
      var body="Bonjour Fabienne,\n\n"+v("message")+"\n\n"+v("prenom")+" "+v("nom")+"\nEmail : "+v("email")+(v("tel")?"\nTéléphone : "+v("tel"):"");
      window.location.href="mailto:"+form.getAttribute("data-to")+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
      var st=d.getElementById("form-status"); if(st){ st.classList.add("show"); }
    });
  }

  /* Barre d'action mobile : masquée au-dessus du pied de page */
  var bar=d.querySelector(".actionbar"), foot=d.querySelector(".footer");
  if(bar && foot && "IntersectionObserver" in window){
    new IntersectionObserver(function(en){ bar.classList.toggle("hide", en[0].isIntersecting); },{threshold:.15}).observe(foot);
  }

  /* Année */
  d.querySelectorAll("[data-year]").forEach(function(el){ el.textContent=new Date().getFullYear(); });
})();
