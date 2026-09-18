#!/usr/bin/env python3
"""Génère le site statique de Fabienne Hiot.

Usage : python3 build.py   (écrit les pages HTML dans le dossier parent)
Chaque fichier de pages/ commence par un en-tête « clé: valeur » puis une ligne ---.
Balises disponibles dans les pages : {{B}} (chemin de base), {{I:clé:largeur}} (URL d'image),
{{ic:nom}} (icône SVG), {{CTA}} (bandeau de prise de rendez-vous), {{RESALIB}}, {{TEL}}, {{TEL_HREF}}.
"""
import os, re, json, html

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
B = "/concept/fabiennehiot/"
SITE = "https://3rdmodule.com" + B

TEL = "06 42 44 25 50"
TEL_HREF = "tel:+33642442550"
EMAIL = "fabienne.hiot@gmail.com"
RESALIB = "https://www.resalib.fr/praticien/46854-fabienne-hiot-naturopathe-saint-raphael"
MAPS_EMBED = "https://maps.google.com/maps?q=Les%20Mas%20de%20l%27Esterel%2C%20Boulevard%20de%20l%27Esterel%2C%2083530%20Agay&z=14&output=embed"
MAPS_LINK = "https://maps.google.com/maps?q=Les%20Mas%20de%20l%27Esterel%2C%20Boulevard%20de%20l%27Esterel%2C%2083530%20Agay"
FONTS = "https://fonts.bunny.net/css?family=fraunces:400,400i,500,500i|figtree:400,500,600,700|parisienne:400&display=swap"

CDN = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/"
IMG = {
  "portrait":      "1736262473/5189524/{w}/fabienne-hiot-naturopathe-reflexologue-et-praticienne-de-bioresonance-a-saint-raphael.png",
  "consult":       "1640210504/2220304/{w}/onsultation-en-naturopathie-coaching-de-vie-coach-en-alimentation.jpeg",
  "cabinet":       "1640211232/2219862/{w}/naturopathie.jpeg",
  "machines":      "1644262805/2217864/{w}/coherence-cardiaque.jpeg",
  "bioconsult":    "1640210546/2241456/{w}/consultation-de-naturopathie-bionergtique.jpeg",
  "esterel":       "1639673404/2217861/{w}/e1eb8b546f84785d5a8a20211126-576961-1yyn6cn.jpeg",
  "esterel2":      "1639692473/2217862/{w}/bienvenue-sur-le-site-de-fabienne-hiot.jpeg",
  "baie":          "1639692788/2220291/{w}/ec36b3072df31c3e815c4706ef4e478be273e4d41bb318499df0_1920.jpeg",
  "lavande":       "1639149198/2241452/{w}/e837b6062ef0023ecd0b4307e5454497fe76e6d318b2154092f3c7_1920.jpeg",
  "ciste":         "1639692751/2217863/{w}/naturopathie.jpeg",
  "reflexo":       "1639691836/2217865/{w}/aromatherapie.jpeg",
  "reflexo2":      "1736270324/2241702/{w}/consultation-distance-avec-le-life-systme-image.jpeg",
  "reflexo3":      "1736270538/2241654/{w}/naturopathie.jpeg",
  "amma":          "1736850399/5189506/{w}/aromatherapie.jpeg",
  "amma2":         "1736268574/5189519/{w}/img_2281.jpeg",
  "life":          "1640211592/2241650/{w}/reflexologie.jpeg",
  "legumes":       "1640212150/2241302/{w}/image-demo.jpeg",
  "plantes":       "1640212093/2241306/{w}/image-demo.jpeg",
  "bourgeons":     "1640247446/2241305/{w}/image-demo.jpeg",
  "champi_dessin": "1640212529/2241307/{w}/image-demo.png",
  "fleurs":        "1640212710/2241303/{w}/image-demo.jpeg",
  "stress":        "1640212747/2241304/{w}/image-demo.jpeg",
  "salade":        "1640247856/2219901/{w}/reflexologie.jpeg",
  "course":        "1640605030/2268402/{w}/reflexologie.jpeg",
  "frigo":         "1640624396/2268437/{w}/reflexologie.jpeg",
  "tisane":        "1640628423/2241297/{w}/reflexologie.jpeg",
  "he":            "1641484923/2282788/{w}/reflexologie.jpeg",
  "bourgeon2":     "1640629446/2241298/{w}/reflexologie.jpeg",
  "champi":        "1640248085/2241299/{w}/reflexologie.jpeg",
  "fleurs2":       "1641380955/2241300/{w}/reflexologie.jpeg",
  "respire":       "1640248159/2241301/{w}/reflexologie.jpeg",
  "meditation":    "1641731459/2282947/{w}/reflexologie.jpeg",
  "dienchan_outils":"1736270592/2842035/{w}/1630687208.jpeg",
  "dienchan":      "1683885737/2841967/{w}/definition-et-bienfaits-de-la-reflexologie-faciale-dien-chan-loeti-reflexologue-2.jpeg",
  "dienchan_carte":"1683885083/3069179/{w}/consultation-distance-avec-le-life-systme-image.png",
  "visage1":       "1774641845/7628056/{w}/reflexologie.jpeg",
  "visage2":       "1774642023/7628057/{w}/reflexologie.jpeg",
  "visage3":       "1774642142/7628058/{w}/reflexologie.png",
  "visage4":       "1774643073/7627213/{w}/img_2281.jpeg",
  "distance":      "1640210677/2241457/{w}/consultation-distance-avec-le-life-systme-image.jpeg",
  "dip_cfppa":     "1738900656/2219859/{w}/cfppa20211129-3978460-1uu9mx3.jpeg",
  "dip_ifsh":      "1738900654/2219857/{w}/diplome_de_naturopathe_00120211129-3978460-1sm68ao.jpeg",
  "dip_reflexo":   "1738900652/2219855/{w}/diplome_en_reflexologie_plantaire_00120211129-3978460-1oj03sc.jpeg",
  "dip_dienchan1": "1781972114/10010009/{w}/1000032294.jpeg",
  "dip_dienchan2": "1781972114/10010007/{w}/1000032296.jpeg",
}
def img(key, w="1200"):
    return CDN + IMG[key].format(w=w)

ICONS = {
 "phone":'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 "calendar":'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/>',
 "pin":'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 "clock":'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "leaf":'<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19c3-4 6-7 10-9"/>',
 "star":'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 "arrow":'<path d="M5 12h14M13 6l6 6-6 6"/>',
 "chev":'<path d="M6 9l6 6 6-6"/>',
 "info":'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
 "home":'<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
 "screen":'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 "wave":'<path d="M2 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0 2 3 2 3"/>',
 "foot":'<path d="M8 21c-2 0-3-2-3-5 0-4 1-7 3-9 1.5-1.4 4-1 4.5 1.5.6 3-1 5-1 8 0 3-1.5 4.5-3.5 4.5z"/><circle cx="14" cy="4" r="1.3"/><circle cx="17" cy="5.5" r="1.1"/><circle cx="19" cy="8" r="1"/>',
 "hand":'<path d="M7 11V6a1.5 1.5 0 0 1 3 0v5M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L3.5 14a1.6 1.6 0 0 1 2.6-1.8L7 13.5"/>',
 "sparkle":'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
 "mail":'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 "shield":'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
 "flower":'<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C10 6 10 3.5 12 3c2 .5 2 3 0 6.5zM12 14.5c2 3.5 2 6 0 6.5-2-.5-2-3 0-6.5zM9.5 12C6 14 3.5 14 3 12c.5-2 3-2 6.5 0zM14.5 12c3.5-2 6-2 6.5 0-.5 2-3 2-6.5 0z"/>',
 "drop":'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
 "heart":'<path d="M12 20s-7.5-4.6-9-9.5C2 7 4.5 4.5 7.5 4.5c2 0 3.5 1.2 4.5 2.8 1-1.6 2.5-2.8 4.5-2.8 3 0 5.5 2.5 4.5 6-1.5 4.9-9 9.5-9 9.5z"/>',
 "user":'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"/>',
 "child":'<circle cx="12" cy="6" r="3"/><path d="M8 21v-6l-2-3 3-2h6l3 2-2 3v6"/>',
 "euro":'<path d="M17 6.5A7 7 0 1 0 17 17.5M4 10.5h9M4 13.5h9"/>',
 "chat":'<path d="M4 5h16v11H9l-5 4z"/>',
 "check":'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 "car":'<path d="M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2M19 16v2"/><circle cx="8" cy="13.5" r=".8"/><circle cx="16" cy="13.5" r=".8"/>',
 "moon":'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 "globe":'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18"/>',
 "quote":'<path d="M9 7H5v6h4v4H5M19 7h-4v6h4v4h-4"/>',
 "bowl":'<path d="M3 11h18a9 9 0 0 1-18 0zM8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',
}
def icon(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<svg{c} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>'

# Logo de Fabienne : arbre (vectorisé depuis son logo, feuilles séparées pour l'animation) + signature
TREE = open(os.path.join(HERE, "tree.svg"), encoding="utf-8").read().replace('<svg ', '<svg class="tree-mark" aria-hidden="true" ', 1)
AMMA = open(os.path.join(HERE, "amma.svg"), encoding="utf-8").read()
def brand(sub, cls=""):
    return (f'<span class="brand-tree">{TREE}</span>' if cls == "" else '<span class="brand-tree mask-tree"></span>') + \
           f'<span class="brand-name"><span class="sig" role="img" aria-label="Fabienne Hiot"></span><small>{sub}</small></span>'

NAV = [
  ("accueil", "Accueil", ""),
  ("pratiques", "Mes pratiques", None),
  ("seances", "Séances & tarifs", "seances-et-tarifs/"),
  ("parcours", "Mon parcours", "parcours/"),
  ("avis", "Avis", "avis/"),
  ("rdv", "Infos pratiques", "rendez-vous/"),
]
PRATIQUES = [
  ("naturopathie", "Naturopathie", "naturopathie/", "Alimentation, plantes, remèdes naturels"),
  ("bioresonance", "Biorésonance", "bioresonance/", "Métatron Hospital et L.I.F.E Système"),
  ("reflexologie", "Réflexologies", "reflexologies/", "Plantaire et faciale Dien Chan"),
  ("massages", "Massages", "massages/", "Massage assis AMMA, massage japonais du visage"),
]

CUR = ' aria-current="page"'

def header(active):
    items = []
    for key, label, path in NAV:
        if key == "accueil":
            continue
        if path is None:
            cur = " is-current" if active in [p[0] for p in PRATIQUES] else ""
            sub = "".join(
                f'<li><a href="{B}{p}"{CUR if active==k else ""}>{l}<span>{d}</span></a></li>'
                for k, l, p, d in PRATIQUES)
            items.append(f'<li class="has-sub{cur}"><button class="sub-toggle" aria-expanded="false" aria-haspopup="true">{label}{icon("chev")}</button><ul class="sub">{sub}</ul></li>')
        else:
            ac = ' aria-current="page"' if active == key else ""
            items.append(f'<li><a href="{B}{path}"{ac}>{label}</a></li>')
    msub = "".join(f'<li><a href="{B}{p}"{CUR if active==k else ""}>{l}</a></li>' for k, l, p, d in PRATIQUES)
    mitems = []
    for key, label, path in NAV:
        if path is None:
            mitems.append(f'<li><span class="mnav-label">{label}</span><ul class="mnav-sub">{msub}</ul></li>')
        else:
            ac = ' aria-current="page"' if active == key else ""
            mitems.append(f'<li><a href="{B}{path}"{ac}>{label}</a></li>')
    return f'''<a class="skip" href="#contenu">Aller au contenu</a>
<div class="topbar"><div class="wrap">
  <div class="tb-left"><span>{icon("pin")}Cabinet à Agay · Saint-Raphaël (83)</span><span>{icon("clock")}Du lundi au vendredi, 14 h – 18 h</span><span>{icon("sparkle")}Experte en biorésonance</span></div>
  <span>{icon("phone")}<a href="{TEL_HREF}">{TEL}</a></span>
</div></div>
<header class="header"><div class="wrap">
  <a class="brand" href="{B}" aria-label="Fabienne Hiot, naturopathe : accueil">{brand("Naturopathe · Biorésonance")}</a>
  <nav aria-label="Navigation principale"><ul class="menu">{"".join(items)}</ul></nav>
  <div class="nav-cta">
    <a class="btn" href="{RESALIB}" target="_blank" rel="noopener">{icon("calendar")}Rendez-vous</a>
    <button class="burger" aria-expanded="false" aria-controls="mnav" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
  </div>
</div></header>
<div class="mnav" id="mnav" aria-hidden="true">
  <ul>{"".join(mitems)}</ul>
  <div class="mnav-contact">
    <p><strong>Cabinet à Agay, Saint-Raphaël</strong></p>
    <p>Du lundi au vendredi, 14 h – 18 h</p>
    <p><a href="{TEL_HREF}">{TEL}</a></p>
  </div>
</div>'''

def footer():
    prat = "".join(f'<li><a href="{B}{p}">{l}</a></li>' for k, l, p, d in PRATIQUES)
    return f'''<footer class="footer"><div class="wrap">
  <div class="f-grid">
    <div>
      <a class="brand" href="{B}" aria-label="Fabienne Hiot : accueil">{brand("Naturopathe, réflexologue &amp; masseuse faciale", "f")}</a>
      <p>Vibrez en harmonie pour votre bien-être.</p>
      <p class="f-disclaimer">Les conseils d'hygiène vitale et le rééquilibrage énergétique ne sauraient en aucun cas remplacer les conseils et soins de votre médecin traitant.</p>
    </div>
    <div><h4>Mes pratiques</h4><ul>{prat}<li><a href="{B}seances-et-tarifs/">Séances & tarifs</a></li></ul></div>
    <div><h4>Découvrir</h4><ul>
      <li><a href="{B}parcours/">Mon parcours</a></li>
      <li><a href="{B}avis/">Avis</a></li>
      <li><a href="{B}rendez-vous/">Rendez-vous & infos pratiques</a></li>
      <li><a href="{B}mentions-legales/">Mentions légales</a></li>
    </ul></div>
    <div><h4>Cabinet</h4>
      <p>Les Mas de l'Esterel<br>Centre de vacances Pro BTP · Centre bien-être<br>Boulevard de l'Esterel, Agay<br>83530 Saint-Raphaël</p>
      <p><a href="{TEL_HREF}"><strong style="color:#fff">{TEL}</strong></a><br>Du lundi au vendredi, 14 h – 18 h</p>
    </div>
  </div>
  <div class="f-bottom"><span>© <span data-year>2026</span> Fabienne Hiot · Naturopathe à Saint-Raphaël</span><span><a href="{B}mentions-legales/">Mentions légales</a></span></div>
</div></footer>
<nav class="actionbar" aria-label="Contact rapide">
  <a href="{TEL_HREF}">{icon("phone")}Appeler</a>
  <a class="primary" href="{RESALIB}" target="_blank" rel="noopener">{icon("calendar")}Rendez-vous</a>
</nav>'''

CTA = f'''<section class="section tight"><div class="wrap">
<div class="cta-band reveal">
  <div><p class="hand">À bientôt au cabinet,</p><h2>Augmentez votre vitalité, <em>baissez votre stress.</em></h2>
  <p>Réservez votre séance en ligne sur Resalib ou appelez-moi : le premier échange téléphonique est gratuit (15 min maximum). Des séances individuelles, pour un bien-être sur mesure.</p></div>
  <div class="btn-row">
    <a class="btn btn-light" href="{RESALIB}" target="_blank" rel="noopener">{icon("calendar")}Prendre rendez-vous</a>
    <a class="btn btn-ghost" href="{TEL_HREF}">{icon("phone")}{TEL}</a>
  </div>
</div></div></section>'''

JSONLD = {
  "@context": "https://schema.org", "@type": "HealthAndBeautyBusiness",
  "name": "Fabienne Hiot, naturopathe", "telephone": "+33642442550",
  "address": {"@type": "PostalAddress", "streetAddress": "Les Mas de l'Esterel, Boulevard de l'Esterel, Agay",
              "postalCode": "83530", "addressLocality": "Saint-Raphaël", "addressCountry": "FR"},
  "openingHours": "Mo-Fr 14:00-18:00",
  "aggregateRating": {"@type": "AggregateRating", "ratingValue": "5", "reviewCount": "31"},
  "url": SITE,
}

def layout(meta, body):
    title = meta["title"]; desc = meta["description"]; active = meta.get("nav", "")
    canon = SITE + meta["path"]
    og = SITE + "assets/img/" + meta.get("og", "cabinet-soin-large") + ".jpg"
    jsonld = f'<script type="application/ld+json">{json.dumps(JSONLD, ensure_ascii=False)}</script>' if meta["path"] == "" else ""
    return f'''<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:image" content="{og}">
<meta name="theme-color" content="#FBF7F3">
<link rel="icon" href="{B}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.bunny.net">
<link rel="preconnect" href="https://files.sbcdnsb.com">
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{B}assets/css/style.css">
{jsonld}
</head>
<body>
{header(active)}
<main id="contenu">
{body}
</main>
{footer()}
<script src="{B}assets/js/main.js" defer></script>
</body>
</html>
'''

def crumbs(items):
    lis = [f'<li><a href="{B}">Accueil</a></li>']
    for label, path in items[:-1]:
        lis.append(f'<li><a href="{B}{path}">{label}</a></li>')
    lis.append(f'<li aria-current="page">{items[-1][0]}</li>')
    return f'<nav aria-label="Fil d’Ariane"><ol class="crumbs">{"".join(lis)}</ol></nav>'

def render(text):
    text = text.replace("{{CTA}}", CTA).replace("{{AMMA}}", AMMA).replace("{{TREE}}", TREE)
    text = re.sub(r"\{\{I:([a-z0-9_]+):?(\d+)?\}\}", lambda m: img(m.group(1), m.group(2) or "1200"), text)
    text = re.sub(r"\{\{L:([a-z0-9-]+)(?::(jpg))?\}\}", lambda m: B + "assets/img/" + m.group(1) + "." + (m.group(2) or "webp"), text)
    text = re.sub(r"\{\{ic:([a-z]+)\}\}", lambda m: icon(m.group(1)), text)
    text = re.sub(r"\{\{CRUMBS:(.+?)\}\}", lambda m: crumbs([tuple(x.split("|")) for x in m.group(1).split(";")]), text)
    text = re.sub(r"\{\{MORE:(.+?)\}\}", lambda m: f'<button class="more-btn" type="button" aria-expanded="false"><span>{m.group(1)}</span>{icon("chev")}</button>', text)
    return (text.replace("{{B}}", B).replace("{{RESALIB}}", RESALIB).replace("{{TEL}}", TEL)
                .replace("{{TEL_HREF}}", TEL_HREF).replace("{{EMAIL}}", EMAIL)
                .replace("{{MAPS_EMBED}}", MAPS_EMBED).replace("{{MAPS_LINK}}", MAPS_LINK))

def main():
    pages = sorted(f for f in os.listdir(os.path.join(HERE, "pages")) if f.endswith(".html"))
    for f in pages:
        raw = open(os.path.join(HERE, "pages", f), encoding="utf-8").read()
        head, body = raw.split("\n---\n", 1)
        meta = {}
        for line in head.strip().splitlines():
            k, v = line.split(":", 1); meta[k.strip()] = v.strip()
        out_dir = os.path.join(OUT, meta["path"])
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as fh:
            fh.write(layout(meta, render(body)))
        print("✓", B + meta["path"])

if __name__ == "__main__":
    main()
