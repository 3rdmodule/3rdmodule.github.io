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
  d.querySelectorAll(".hours").forEach(function(ul){ var li=ul.children[today]; if(li && !li.classList.contains("off")){ li.classList.add("today"); var t=li.firstElementChild; if(t) t.insertAdjacentHTML("beforeend",' <em class="auj">aujourd\'hui</em>'); } });

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
      reflexo:["Réflexologie plantaire","Détente profonde, libération des tensions, détox","reflexologies/#plantaire"],
      dien:["Dien Chan","Réflexologie faciale, pour les douleurs et gênes","reflexologies/#dien-chan"],
      beaute:["Chan Beauté","Soin visage vietnamien : relaxant, drainant, anti-rides","reflexologies/#chan-beaute"],
      amma:["Massage assis AMMA","Relâchement immédiat des tensions, en 20 min","massages/#amma"],
      visage:["Massage japonais du visage","Lifting naturel, éclat, détente","massages/#visage"]
    };
    var MAP={
      stress:["stress","life","amma","reflexo"], sommeil:["life","naturo"],
      digestion:["nutri","life","naturo"], poids:["nutri","life","naturo"],
      douleurs:["life","dien","amma"], fatigue:["life","naturo"],
      emotions:["bach","life","stress"], detox:["plantes","reflexo","life","nutri"],
      visage:["visage","beaute"], tensions:["amma","reflexo","visage"],
      comprendre:["meta","naturo"], allergies:["life"]
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
        '<p class="guide-note">Ce ne sont que des pistes&nbsp;: n\'hésitez pas à m\'appeler, le premier contact est gratuit. Ces pratiques ne remplacent pas un avis médical.</p>';
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

/* ===== Questionnaire « Quel soin pour moi ? » =====
   Les correspondances besoin → soin reprennent uniquement ce que Fabienne écrit sur chaque soin. */
(function(){
  "use strict";
  var quiz=document.getElementById("quiz"); if(!quiz) return;
  var B=quiz.getAttribute("data-base");
  var SOINS={
    naturo:{n:"Naturopathie",d:"Un bilan par l'observation et le questionnement, puis des conseils d'hygiène de vie et d'alimentation, avec l'aide des plantes, bourgeons, hydrolats, fleurs de Bach et champignons.",m:"1re séance 1 h 30 · 80 € · suivi 65 € · enfant 40 €",u:"naturopathie/"},
    bio:{n:"Biorésonance",d:"Bilan et harmonisation énergétique : analyse des déséquilibres avec le Métatron Hospital, rééquilibrage des troubles identifiés par vibrations ciblées avec le L.I.F.E.",m:"1 h à 1 h 30 · 1re séance 80 € · suivi 65 € · enfant 40 €",u:"bioresonance/"},
    reflexo:{n:"Réflexologie plantaire",d:"Moderne, douce et équilibrante : détente profonde du corps et de l'esprit, libération des tensions, soin réflexe complet.",m:"45 min · 50 €",u:"reflexologies/#plantaire"},
    dien:{n:"Dien Chan, réflexologie faciale",d:"Une technique multiréflexe vietnamienne qui agit rapidement dans la prise en charge de douleurs ou de gênes.",m:"30 min · 35 €, ou 45 min · 50 €",u:"reflexologies/#dien-chan"},
    beaute:{n:"Soin visage vietnamien Chan Beauté",d:"Avec outils traditionnels Yin & Yang et acupressions : relaxant, drainant, anti-rides.",m:"30 min · 35 €",u:"reflexologies/#chan-beaute"},
    amma:{n:"Massage assis AMMA",d:"Relâchement immédiat des tensions : dos, cou, épaules, tête, bras, mains.",m:"20 min · 30 €",u:"massages/#amma"},
    visage:{n:"Massage visage japonais",d:"Kobido, shiatsu et reiki : lifting naturel, éclat, détente. Il soulage aussi les tensions du cou, de la nuque et de la mâchoire.",m:"30 ou 50 min, au choix",u:"massages/#visage"}
  };
  var BESOINS={
    stress:{naturo:2,bio:2,amma:2,reflexo:2}, sommeil:{bio:3,naturo:2}, fatigue:{bio:3,naturo:2},
    digestion:{naturo:3,bio:2}, poids:{naturo:3,bio:2}, douleurs:{dien:3,bio:2,amma:1},
    emotions:{naturo:2,bio:2}, detox:{naturo:2,reflexo:2,bio:1}, allergies:{bio:3}, memoire:{bio:3},
    tensions:{amma:3,visage:2,reflexo:1}, visage:{visage:3,beaute:3}
  };
  var ATTENTE={comprendre:{bio:3,naturo:2},habitudes:{naturo:4},detente:{reflexo:2,amma:2,visage:2,beaute:1},energie:{bio:3}};
  var ORDER=["naturo","bio","reflexo","dien","beaute","amma","visage"];
  var steps=[].slice.call(quiz.querySelectorAll(".q")), cur=0;
  var prev=quiz.querySelector(".q-prev"), next=quiz.querySelector(".q-next"), bar=quiz.querySelector(".quiz-bar span"), count=quiz.querySelector(".quiz-count b");
  var result=quiz.querySelector(".q-result"), nav=quiz.querySelector(".quiz-nav"), top=quiz.querySelector(".quiz-top");
  function answered(i){ return !!steps[i].querySelector("input:checked"); }
  function show(i){
    steps.forEach(function(s,k){ s.classList.toggle("active",k===i); s.hidden=k!==i; });
    cur=i; count.textContent=i+1; bar.style.width=((i)/steps.length*100)+"%";
    prev.hidden=i===0; next.disabled=!answered(i);
    next.firstChild.textContent=i===steps.length-1?"Voir mon résultat":"Suivant";
    var lg=steps[i].querySelector("legend"); if(lg){ lg.setAttribute("tabindex","-1"); lg.focus({preventScroll:true}); }
  }
  quiz.addEventListener("change",function(e){
    next.disabled=!answered(cur);
    if(e.target.type==="radio" && cur<steps.length-1){ setTimeout(function(){ show(cur+1); },350); }
  });
  next.addEventListener("click",function(){ if(!answered(cur)) return; if(cur<steps.length-1) show(cur+1); else finish(); });
  prev.addEventListener("click",function(){ if(cur>0) show(cur-1); });
  function val(n){ var c=quiz.querySelector('input[name="'+n+'"]:checked'); return c?c.value:null; }
  function finish(){
    var sc={}; ORDER.forEach(function(k){ sc[k]=0; });
    [].forEach.call(quiz.querySelectorAll('input[name="besoins"]:checked'),function(c){ var t=BESOINS[c.value]||{}; for(var k in t) sc[k]+=t[k]; });
    var a=ATTENTE[val("attente")]||{}; for(var k in a) sc[k]+=a[k];
    var allowed=ORDER.slice();
    if(val("lieu")==="distance") allowed=["naturo","bio"];
    if(val("pour")==="enfant") allowed=allowed.filter(function(k){ return k==="naturo"||k==="bio"; });
    if(val("ci")==="oui") allowed=allowed.filter(function(k){ return k!=="bio"; });
    if(!allowed.length) allowed=["naturo"];
    var ranked=allowed.slice().sort(function(x,y){ return (sc[y]-sc[x]) || (ORDER.indexOf(x)-ORDER.indexOf(y)); });
    var best=SOINS[ranked[0]];
    result.querySelector(".res-name").textContent=best.n;
    result.querySelector(".res-desc").textContent=best.d;
    var meta=best.m;
    if(ranked[0]==="bio" && val("lieu")==="distance") meta="À distance avec le L.I.F.E : 1 h 30 · 60 € (+ 5 € le flacon informé) · enfant 40 €";
    if(ranked[0]==="naturo" && val("lieu")==="distance") meta=best.m+" · conseils et suivi possibles par Skype";
    result.querySelector(".res-meta").textContent=meta;
    result.querySelector(".res-link").href=B+best.u;
    var also=ranked.slice(1).filter(function(k){ return sc[k]>0; }).slice(0,2);
    var el=result.querySelector(".res-also");
    el.innerHTML=also.length?("Également possible&nbsp;: "+also.map(function(k){ return '<a href="'+B+SOINS[k].u+'">'+SOINS[k].n+'</a>'; }).join(" · ")):"";
    steps.forEach(function(s){ s.hidden=true; s.classList.remove("active"); });
    nav.hidden=true; top.hidden=true; bar.style.width="100%";
    result.hidden=false; result.classList.remove("show"); void result.offsetWidth; result.classList.add("show");
    result.focus({preventScroll:true});
    quiz.scrollIntoView({behavior:"smooth",block:"start"});
  }
  quiz.querySelector(".res-restart").addEventListener("click",function(){
    quiz.querySelector("form").reset(); result.hidden=true; nav.hidden=false; top.hidden=false; show(0);
    quiz.scrollIntoView({behavior:"smooth",block:"start"});
  });
  steps.forEach(function(s,k){ s.hidden=k!==0; });
  show(0);
})();

/* ===== Réservation en ligne (agenda Cal.com, chargé au clic) ===== */
(function(){
  "use strict";
  var box=document.querySelector(".booking"); if(!box) return;
  var user=box.getAttribute("data-cal-user"), panel=box.querySelector(".book-panel");
  var empty=panel.innerHTML, btns=box.querySelectorAll(".book-list button");
  btns.forEach(function(b){
    b.addEventListener("click",function(){
      btns.forEach(function(x){ x.setAttribute("aria-pressed", x===b?"true":"false"); });
      var slug=b.getAttribute("data-slug"), label=b.querySelector("b").textContent;
      var url="https://cal.com/"+user+"/"+slug+"?embed=true&layout=month_view";
      panel.innerHTML='<div class="book-head"><strong>'+label+'</strong><a href="'+url.replace("&embed=true","")+'" target="_blank" rel="noopener">Ouvrir dans une nouvelle fenêtre</a></div><iframe title="Agenda de réservation : '+label+'" src="'+url+'" loading="lazy"></iframe>';
      if(window.innerWidth<960) panel.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
})();
