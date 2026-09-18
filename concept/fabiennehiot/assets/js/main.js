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
    window.addEventListener("resize", function(){ if(window.innerWidth>1300) closeMenu(); });
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

/* ===== V2 : parallaxe, guide, respiration, compteurs, carrousel ===== */
(function(){
  "use strict";
  var d=document, reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Parallaxe douce sur les photos d'Agay */
  var par=[].slice.call(d.querySelectorAll("[data-parallax]"));
  if(par.length && !reduce){
    var ticking=false;
    function upd(){
      par.forEach(function(img){
        var r=img.parentElement.getBoundingClientRect(), vh=window.innerHeight;
        if(r.bottom<0||r.top>vh) return;
        var p=(r.top+r.height/2-vh/2)/vh; img.style.transform="translate3d(0,"+(p*-parseFloat(img.getAttribute("data-parallax")||40))+"px,0)";
      }); ticking=false;
    }
    window.addEventListener("scroll",function(){ if(!ticking){ requestAnimationFrame(upd); ticking=true; } },{passive:true});
    upd();
  }

  /* Compteurs animés */
  var nums=d.querySelectorAll("[data-count]");
  if("IntersectionObserver" in window){
    var co=new IntersectionObserver(function(es){ es.forEach(function(e){
      if(!e.isIntersecting) return; co.unobserve(e.target);
      var el=e.target, end=parseFloat(el.getAttribute("data-count")), suf=el.getAttribute("data-suffix")||"", t0=null;
      if(reduce){ el.textContent=end+suf; return; }
      function step(t){ if(!t0) t0=t; var k=Math.min(1,(t-t0)/1400), v=Math.round(end*(1-Math.pow(1-k,3))); el.textContent=v+suf; if(k<1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }); },{threshold:.6});
    nums.forEach(function(n){ co.observe(n); });
  }

  /* Guide « Quelle pratique pour moi ? » */
  var guide=d.querySelector("[data-guide]");
  if(guide){
    var B=guide.getAttribute("data-base");
    var P={
      naturo:["Naturopathie","Bilan, alimentation, plantes et hygiène de vie","naturopathie/"],
      nutri:["Coaching alimentaire","Un suivi alimentaire individualisé","naturopathie/#nutrition"],
      stress:["Gestion du stress","Respiration, cohérence cardiaque, mode de vie","naturopathie/#stress"],
      bach:["Fleurs de Bach","Pour accompagner l'émotionnel","naturopathie/#fleurs"],
      champi:["Mycothérapie","Les champignons, pour soutenir l'organisme","naturopathie/#champignons"],
      plantes:["Plantes et hydrolats","Détox, drainage, détente du système nerveux","naturopathie/#plantes"],
      meta:["Biorésonance Métatron","Un bilan très précis pour trouver l'origine des troubles","bioresonance/#metatron"],
      life:["Biorésonance L.I.F.E","Un rééquilibrage ciblé, aussi à distance","bioresonance/#life"],
      reflexo:["Réflexologie plantaire","Détente profonde, détox, harmonisation","reflexologies/#plantaire"],
      dien:["Dien Chan","Réflexologie faciale, pour les douleurs et gênes","reflexologies/#dien-chan"],
      beaute:["Chan Beauté","Soin visage vietnamien : relaxant, drainant, anti-rides","reflexologies/#chan-beaute"],
      amma:["Massage assis AMMA","Relâchement immédiat des tensions, en 20 min","massages/#amma"],
      visage:["Massage japonais du visage","Lifting naturel, éclat, détente","massages/#visage"]
    };
    var MAP={
      stress:["stress","life","amma","bach","reflexo"], sommeil:["life","naturo","stress","reflexo"],
      digestion:["nutri","meta","naturo","champi"], poids:["nutri","life","naturo"],
      douleurs:["life","dien","reflexo","amma"], fatigue:["life","naturo","champi","reflexo"],
      emotions:["bach","life","stress"], detox:["plantes","reflexo","life","nutri"],
      visage:["visage","beaute"], tensions:["amma","reflexo","visage"],
      comprendre:["meta","naturo"], allergies:["life","naturo"]
    };
    var chips=guide.querySelectorAll(".guide-chips button"), out=guide.querySelector(".guide-out");
    var empty=out.innerHTML;
    function render(){
      var sel=[].filter.call(chips,function(c){ return c.getAttribute("aria-pressed")==="true"; }).map(function(c){ return c.getAttribute("data-need"); });
      if(!sel.length){ out.innerHTML=empty; return; }
      var score={}, order=[];
      sel.forEach(function(n){ (MAP[n]||[]).forEach(function(k,i){ if(!(k in score)){ score[k]=0; order.push(k); } score[k]+= (4-i); }); });
      order.sort(function(a,b){ return score[b]-score[a]; });
      var html='<ul class="guide-list">'+order.slice(0,4).map(function(k,i){ var p=P[k]; return '<li style="--i:'+i+'"><a href="'+B+p[2]+'"><b>'+p[0]+'</b><span>'+p[1]+'</span></a></li>'; }).join("")+'</ul>'+
        '<p class="guide-note">Ce ne sont que des pistes&nbsp;: lors de notre premier échange, gratuit, je vous oriente vers la séance la plus adaptée. Ces pratiques ne remplacent pas un avis médical.</p>';
      out.innerHTML=html;
    }
    chips.forEach(function(c){ c.addEventListener("click",function(){ c.setAttribute("aria-pressed", c.getAttribute("aria-pressed")==="true"?"false":"true"); render(); }); });
  }

  /* Respiration guidée : cohérence cardiaque (5 s / 5 s) */
  d.querySelectorAll("[data-breath]").forEach(function(box){
    var orb=box.querySelector(".breath-orb"), label=orb.querySelector("span"), btn=box.querySelector("[data-breath-start]"), timer=null, left=0, phase=0, tick=null;
    var idle=label.innerHTML;
    function stop(){ clearInterval(timer); clearInterval(tick); timer=null; orb.classList.remove("in"); label.innerHTML=idle; btn.textContent="Commencer (3 min)"; }
    function cycle(){ phase=1-phase; orb.classList.toggle("in", phase===1); label.innerHTML=(phase===1?"Inspirez":"Expirez")+'<small>'+Math.floor(left/60)+" min "+("0"+left%60).slice(-2)+" s</small>"; }
    btn.addEventListener("click",function(){
      if(timer){ stop(); return; }
      left=180; phase=0; btn.textContent="Arrêter"; cycle();
      timer=setInterval(cycle,5000);
      tick=setInterval(function(){ left--; var s=label.querySelector("small"); if(s) s.textContent=Math.floor(left/60)+" min "+("0"+left%60).slice(-2)+" s"; if(left<=0){ stop(); label.innerHTML="Bravo&nbsp;!<small>Comment vous sentez-vous&nbsp;?</small>"; } },1000);
    });
  });

  /* Carrousel d'avis */
  d.querySelectorAll(".carousel").forEach(function(c){
    var track=c.querySelector(".car-track"), items=track.children, dots=c.querySelector(".car-dots");
    function per(){ return Math.max(1,Math.round(track.clientWidth/items[0].getBoundingClientRect().width)); }
    function pages(){ return Math.max(1,items.length-per()+1); }
    function build(){ dots.innerHTML=""; for(var i=0;i<pages();i++) dots.appendChild(d.createElement("i")); mark(); }
    function idx(){ var w=items[0].getBoundingClientRect().width+24; return Math.round(track.scrollLeft/w); }
    function mark(){ var k=idx(); [].forEach.call(dots.children,function(x,i){ x.classList.toggle("on",i===k); }); }
    function go(dir){ var w=items[0].getBoundingClientRect().width+24; track.scrollBy({left:dir*w,behavior:reduce?"auto":"smooth"}); }
    c.querySelector("[data-prev]").addEventListener("click",function(){ go(-1); });
    c.querySelector("[data-next]").addEventListener("click",function(){ go(1); });
    track.addEventListener("scroll",function(){ window.requestAnimationFrame(mark); },{passive:true});
    window.addEventListener("resize",build); build();
  });
})();

/* ===== V3 : branches dessinées, image au survol de l'index ===== */
(function(){
  "use strict";
  var d=document;
  var br=d.querySelectorAll(".reveal-branch");
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); },{threshold:.4});
    br.forEach(function(b){ io.observe(b); });
  } else br.forEach(function(b){ b.classList.add("in"); });

  var idx=d.querySelector(".index");
  if(idx && window.matchMedia("(hover:hover) and (min-width:961px)").matches){
    var box=d.createElement("div"); box.className="hover-img"; box.setAttribute("aria-hidden","true");
    var im=d.createElement("img"); im.alt=""; box.appendChild(im); d.body.appendChild(box);
    var x=0,y=0,cx=0,cy=0,raf=null;
    function loop(){ cx+=(x-cx)*.16; cy+=(y-cy)*.16; box.style.left=cx+"px"; box.style.top=cy+"px"; raf=requestAnimationFrame(loop); }
    idx.querySelectorAll("a[data-img]").forEach(function(a){
      a.addEventListener("mouseenter",function(e){ im.src=a.getAttribute("data-img"); x=cx=e.clientX+150; y=cy=e.clientY; box.classList.add("on"); if(!raf) loop(); });
      a.addEventListener("mousemove",function(e){ x=e.clientX+150; y=e.clientY; });
      a.addEventListener("mouseleave",function(){ box.classList.remove("on"); });
    });
    idx.addEventListener("mouseleave",function(){ cancelAnimationFrame(raf); raf=null; });
  }
})();

/* ===== V5 : titres mot à mot, images dévoilées ===== */
(function(){
  "use strict";
  var d=document, reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  d.querySelectorAll(".split-in").forEach(function(h){
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g," ").trim());
    var i=0;
    (function walk(node){
      [].slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var frag=d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(part){
            if(!part) return;
            if(/^\s+$/.test(part)){ frag.appendChild(d.createTextNode(part)); return; }
            var w=d.createElement("span"); w.className="w"; w.setAttribute("aria-hidden","true");
            var inner=d.createElement("span"); inner.style.setProperty("--i", i++); inner.textContent=part;
            w.appendChild(inner); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag,n);
        } else if(n.nodeType===1){ walk(n); }
      });
    })(h);
  });
  var targets=d.querySelectorAll(".split-in,.wipe");
  if(reduce || !("IntersectionObserver" in window)){ targets.forEach(function(t){ t.classList.add("go","in"); }); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("go","in"); io.unobserve(e.target); } }); },{threshold:.2});
  targets.forEach(function(t){ io.observe(t); });
})();
