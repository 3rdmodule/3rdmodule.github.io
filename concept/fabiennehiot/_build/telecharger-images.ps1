# Telecharge les 26 photos encore servies par le CDN de Simplebo,
# pour que le site ne depende plus de Simplebo une fois le contrat resilie.
# Clic droit sur ce fichier > "Executer avec PowerShell".

$dest = Join-Path $PSScriptRoot "..\assets\img\cdn"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$images = @{
  "amma" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1736850399/5189506/1600/aromatherapie.jpeg"
  "amma2" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1736268574/5189519/1600/img_2281.jpeg"
  "baie" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1639692788/2220291/1600/ec36b3072df31c3e815c4706ef4e478be273e4d41bb318499df0_1920.jpeg"
  "bourgeon2" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1640629446/2241298/1600/reflexologie.jpeg"
  "champi" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1640248085/2241299/1600/reflexologie.jpeg"
  "ciste" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1639692751/2217863/1600/naturopathie.jpeg"
  "dienchan" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1683885737/2841967/1600/definition-et-bienfaits-de-la-reflexologie-faciale-dien-chan-loeti-reflexologue-2.jpeg"
  "dienchan_outils" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1736270592/2842035/1600/1630687208.jpeg"
  "dip_cfppa" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1738900656/2219859/1600/cfppa20211129-3978460-1uu9mx3.jpeg"
  "dip_dienchan1" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1781972114/10010009/1600/1000032294.jpeg"
  "dip_dienchan2" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1781972114/10010007/1600/1000032296.jpeg"
  "dip_ifsh" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1738900654/2219857/1600/diplome_de_naturopathe_00120211129-3978460-1sm68ao.jpeg"
  "dip_reflexo" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1738900652/2219855/1600/diplome_en_reflexologie_plantaire_00120211129-3978460-1oj03sc.jpeg"
  "esterel" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1639673404/2217861/1600/e1eb8b546f84785d5a8a20211126-576961-1yyn6cn.jpeg"
  "esterel2" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1639692473/2217862/1600/bienvenue-sur-le-site-de-fabienne-hiot.jpeg"
  "fleurs2" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1641380955/2241300/1600/reflexologie.jpeg"
  "he" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1641484923/2282788/1600/reflexologie.jpeg"
  "lavande" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1639149198/2241452/1600/e837b6062ef0023ecd0b4307e5454497fe76e6d318b2154092f3c7_1920.jpeg"
  "legumes" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1640212150/2241302/1600/image-demo.jpeg"
  "plantes" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1640212093/2241306/1600/image-demo.jpeg"
  "reflexo" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1639691836/2217865/1600/aromatherapie.jpeg"
  "reflexo3" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1736270538/2241654/1600/naturopathie.jpeg"
  "stress" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1640212747/2241304/1600/image-demo.jpeg"
  "visage1" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1774641845/7628056/1600/reflexologie.jpeg"
  "visage2" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1774642023/7628057/1600/reflexologie.jpeg"
  "visage4" = "https://files.sbcdnsb.com/images/K8kpRHTzjVHzMcMoHadfow/content/1774643073/7627213/1600/img_2281.jpeg"
}

foreach ($k in $images.Keys) {
  $out = Join-Path $dest ("{0}.jpg" -f $k)
  Write-Host "-> $k"
  try { Invoke-WebRequest -Uri $images[$k] -OutFile $out -UseBasicParsing }
  catch { Write-Host "   ECHEC : $k" -ForegroundColor Red }
}
Write-Host ""
Write-Host "Termine. Ouvrez ensuite _build\build.py et passez LOCAL_IMG a True, puis relancez le build." -ForegroundColor Green
Read-Host "Appuyez sur Entree pour fermer"