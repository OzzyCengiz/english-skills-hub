/**
 * Last Breath // Core Narrative & Atmospheric Telemetry System
 * Zero-dependency dark post-apocalyptic narrative engine
 */

export const BOOT_TELEMETRY = {
  kernel: 'TACTICAL TELEMETRY KERNEL v4.19-REL',
  geigerThreshold: '14.8 mSv/h [ATTENUATION COEFFICIENT: HIGH]',
  carrierFrequency: '142.85 MHz [CARRIER LOCKED]',
  radioIntercept: 'SEC-09 DEEP VAULT OPERATIONAL // AIRWAY SCRUBBERS STABLE // AUTONOMOUS SEAL IN T-MINUS 45 DAYS. SURVIVE THE TRAVERSE.',
};

export const ARCHETYPE_HOOKS = {
  scavenger: {
    title: 'The Silt Walker',
    hook_en: 'Your lungs remember the taste of every cellar between the coastline and the marshlands. You woke up under a collapsed zinc awning with two cracked ribs, a crowbar bent from prying rusted hatch-seals, and a radio spitting static into the mud.',
    hook_tr: 'Ciğerlerin, kıyı şeridi ile bataklıklar arasındaki her sığınağın zehirli tozunu hatırlar. İki çatlak kaburga, paslı ambar kapaklarını kanırtmaktan eğrilmiş bir levye ve çamura statik cızırtı kusan bir telsizle çökmüş çinko sundurmanın altında uyandın.',
  },
  soldier: {
    title: 'The Deserter',
    hook_en: 'The brass abandoned the checkpoint at 0400 hours, taking the clean diesel and leaving sixty conscripts to choke on sulfur dust. You stripped your unit insignia, pocketed your service sidearm with twelve rounds, and took to the tree lines.',
    hook_tr: 'Komuta kademesi saat 04:00\'te temiz mazotu alıp kaçtı; altmış eri kükürt tozunda boğulmaya terk etti. Üniforma forslarını söktün, hizmet tabancanı on iki mermiyle cebe indirdin ve orman hattına daldın.',
  },
  medic: {
    title: 'The Field Surgeon',
    hook_en: 'The last triage tag you tied was red, placed on a child with chemical pneumonitis whose parents gave you their last wedding ring for clean oxygen. You keep forty milligrams of morphine, two suture needles, and dry iodine in your waterproof kit.',
    hook_tr: 'Bağladığın son triyaj etiketi kırmızıydı; temiz oksijen için sana evlilik yüzüklerini veren ailenin kimyasal pnömonili çocuğuna aitti. Su geçirmez çantanda kırk miligram morfin, iki dikiş iğnesi ve kuru iyot saklıyorsun.',
  },
  survivor: {
    title: 'The Civilian Root',
    hook_en: 'Before the grid went black, you managed shipping ledgers in an air-conditioned office; now your entire life is measured in milliliters of boiled rainwater and dry socks. The voice on 142.85 MHz is the only human thing left in this graveyard.',
    hook_tr: 'Şebeke kararmadan önce klimalı bir ofiste sevkiyat defterlerini tutardın; şimdi tüm hayatın kaynatılmış yağmur suyu mililitreleri ve kuru çoraplarla ölçülüyor. 142.85 MHz frekansındaki ses bu mezarlıkta kalan tek insani şey.',
  },
  engineer: {
    title: 'The Grid Machinist',
    hook_en: 'You watched the transformer yards detonate during the high-altitude EMP. You know copper gauge, capacitor life, and which sub-station relays still hold dry sulfur hexafluoride. Your tools are the difference between life and suffocation.',
    hook_tr: 'Yüksek irtifa EMP patlamasında trafo merkezlerinin infilak edişini izledin. Bakır kesitlerini, kapasitör ömrünü ve hangi trafo rölelerinde kuru gaz kaldığını iyi bilirsin. Aletlerin, yaşam ile boğulma arasındaki tek ince çizgidir.',
  },
  veteran: {
    title: 'The Iron Guard',
    hook_en: 'Twenty-four years in mechanized armor battalions taught you that civilian panic spreads faster than nerve gas. Your knees creak in the morning frost, but your trigger finger hasn\'t forgotten how to double-tap.',
    hook_tr: 'Zırhlı mekanize taburlarında geçen yirmi dört yıl, sana sivil paniğinin sinir gazından daha hızlı yayıldığını öğretti. Sabah ayazında dizlerin sızlar ama tetik parmağın çift vuruş yapmayı asla unutmadı.',
  },
};

export const FIELD_LOGS = [
  {
    id: 'LOG_01',
    source: 'Torn Note / Clinic Ward 3',
    text_en: '[SCRAP: WARD 3 TRIAGE] "Do not waste alcohol on the patients in Ward 3; the sputum is already black. Captain Vural took the remaining epinephrine westward at sundown. Tell him his wife died at 03:15, cursing his uniform."',
    text_tr: '[NOT: 3. KOĞUŞ TRİYAJI] "3. Koğuştaki hastalar için alkolü ziyan etmeyin; balgamları çoktan kömür karası oldu. Yüzbaşı Vural kalan epinefrini alıp gün batımında batıya kaçtı. Görürseniz söyleyin, karısı saat 03:15\'te üniformasına lanet okuyarak öldü."',
  },
  {
    id: 'LOG_02',
    source: 'Thermal Paper Strip / Gendarmerie Radio',
    text_en: '[DISPATCH 74.20 MHz] "STATION 4 TO COMMAND: Out of riot foam. Refugee surge at river crossing reached critical density. Permission to withdraw pickets?" // COMMAND: "NEGATIVE. ENGAGE CROWD LEADERS WITH CONTROLLED SEMI-AUTOMATIC FIRE. BRIDGE MUST REMAIN CLEAR."',
    text_tr: '[TELSİZ ÇIKTISI 74.20 MHz] "KARAKOL 4\'TEN KOMUTAYA: İsyan köpüğü tükendi. Nehir geçişindeki sivil akını kritik eşiğe ulaştı. Geri çekilme izni?" // KOMUTA: "OLUMSUZ. ELEBAŞLARINA KONTROLLÜ YARI OTOMATİK ATEŞ AÇIN. KÖPRÜ ASKERİ KONVOYA AÇIK KALMALIDIR."',
  },
  {
    id: 'LOG_03',
    source: 'Scratched into Freight Car Bogie',
    text_en: '[CARVED IN STEEL] "Three days pinned in this freight wagon. Radio silent. Mehmet drank radiator runoff; his kidneys shut down. I have three cartridges left. One for the axle rust, one for what\'s scratching outside, the last stays in my pocket."',
    text_tr: '[ÇELİĞE KAZINMIŞ] "Yük vagonunda üç gündür mahsuruz. Telsiz çekmiyor. Mehmet radyatör suyu içti; böbrekleri iflas etti. Üç mermim kaldı. Biri paslı aks yayına, biri dışarıda tırmalayan şeye, sonuncusu gömlek cebimde kalacak."',
  },
  {
    id: 'LOG_04',
    source: 'MET-SURV Weather Station Buffer',
    text_en: '[BUFFER #08] AIR PARTICULATE: 840 PPM [LETHAL TO UNFILTERED TISSUE]. ASH-LUNG MARKER: 91% CONFIDENCE MATCH. RECIRCULATION FANS FAILED. MECHANICAL OVERRIDE CORRUPTED. DISPENSING HALON INERT GAS.',
    text_tr: '[İSTASYON #08 BELLEĞİ] HAVA PARTİKÜLÜ: 840 PPM [FİLTRESİZ DOKU İÇİN ÖLÜMCÜL]. KÜL CİĞER GÖSTERGESİ: %91 POZİTİF. SİRKÜLASYON FANLARI ÇÖKTÜ. MANUEL KİLİT BOZULDU. HALON GAZI BOŞALTILIYOR.',
  },
  {
    id: 'LOG_05',
    source: 'Child\'s Stained Exercise Notebook',
    text_en: '[NOTEBOOK] "Baba says the rain isn\'t water anymore, it\'s angry dust from the clouds that broke. We only breathe through the wet towel. Baba told me to count to ten thousand while he traded the watch. I am at forty-two thousand now."',
    text_tr: '[DEFTER YAPRAĞI] "Babam artık yağmurun su olmadığını, kırılan bulutların öfkeli külü olduğunu söyledi. Islak havlunun ardından nefes alıyoruz. Babam saati takas etmeye giderken ona kadar saymamı istedi. Şimdi kırk iki bindeyim."',
  },
  {
    id: 'LOG_06',
    source: 'Classified Perimeter Cleanse Directive',
    text_en: '[OMEGA DIRECTIVE] "Evacuation infrastructure insufficient by factor of 82:1. Directing civilian mass into coastal corridors will serve as kinetic buffer. Allow pulmonary agent to run natural course. Maintain radio beacon 142.85 MHz to funnel high-utility survivors."',
    text_tr: '[OMEGA DİREKTİFİ] "Tahliye altyapısı 82:1 oranında yetersizdir. Sivil kitlenin sahil sektörlerine yönlendirilmesi tampon görevi görecektir. Biyolojik ajanın seyrine müdahale edilmeyecektir. 142.85 MHz frekansı açık tutularak vasıflı hayatta kalanlar Bozkır tesisine çekilmelidir."',
  },
];

export const TRAUMA_ALERTS = {
  tension_pneumothorax: {
    en: 'ALERT: Tension pneumothorax imminent. Trachea displaced, pleural cavity hyper-pressurized. 14G needle decompression urgently required.',
    tr: 'UYARI: Basınçlı pnömotoraks tehlikesi. Trakea kayması ve plevral basınç. Acilen 14G dekompresyon iğnesi gerekir.',
  },
  arterial_bleed: {
    en: 'ALERT: Pulsatile arterial hemorrhage (-120 mL/min). Blood pressure crashing. Windlass C-A-T tourniquet must be applied high & tight.',
    tr: 'UYARI: Atardamar fışkırmalı kanaması (-120 mL/dk). Tansiyon çöküyor. C-A-T turnikeyi ivedilikle yukarıdan ve sıkıca uygulayın.',
  },
  ash_lung_flare: {
    en: 'ALERT: Acute chemical alveolitis flare. Sputum dark, alveoli ulcerating. Replace N95/GOST filter and inhale mucolytic aerosol.',
    tr: 'UYARI: Akut kimyasal alveolit krizi. Balgam koyulaşıyor, doku erimesi. N95/GOST filtrenizi yenileyin ve mukolitik aerosol soluyun.',
  },
};

export const PROTOCOL_47 = {
  title: 'Protocol 47 Archival Core',
  summary_en: 'The Black Sea EMP was not an enemy first strike. It was an automated domestic containment protocol to immobilize 40 million civilians before they overwhelmed the deep limestone shelters of Bozkır (Sector 09).',
  summary_tr: 'Karadeniz EMP patlaması düşman saldırısı değildi. Bozkır (Sektör 09) derin kireçtaşı sığınakları dolup taşmadan önce 40 milyon sivili hareketsiz kılmak için devreye sokulan dahili bir imha protokolüydü.',
};

export const CAMPAIGN_ENDINGS = {
  endingA: {
    id: 'ASSET_REQUISITION',
    title_en: 'Ending A: The Requisitioned Asset',
    title_tr: 'Son A: Zimmetli Envanter',
    text_en: 'The blast doors lock behind you with guillotine finality. Your boots and knife are incinerated. You stand in a paper smock as a barcode is inked on your forearm. You are Asset #1184. You have a warm bunk and nutrient paste; outside, hundreds pound on the steel in the dark.',
    text_tr: 'Ağır çelik kapılar ardınızdan giyotin kesinliğiyle kilitlendi. Botlarınız ve bıçağınız fırında yakıldı. Kolunuza mavi barkod basılırken kağıt önlükle duruyorsunuz. Artık 1184 Nolu Zimmetlisiniz. Sıcak yatağınız ve tayınınız var; dışarıda ise yüzlerce insan karanlıkta kapıya vuruyor.',
  },
  endingB: {
    id: 'ATMOSPHERIC_EQUALIZER',
    title_en: 'Ending B: The Atmospheric Equalizer',
    title_tr: 'Son B: Atmosferik Dengeleyici',
    text_en: 'You jammed the crowbar into the scrubber bypass and blew the intake valves. The toxic steppe wind roared down into the sanitized halls, teaching the generals what coughing blood feels like. The refugees outside breached the food vaults. The world is broken, but today it is broken equally.',
    text_tr: 'Levyeyi hava filtrelerinin baypas vanasına sıkıştırıp emiş kanallarını havaya uçurdun. Bozkırın zehirli kül fırtınası steril koridorlara hücum etti; generallere kan tükürmenin ne demek olduğunu öğretti. Dışarıdaki aç kitle ambarları yağmaladı. Dünya mahvoldu, ama bugün en azından eşit şekilde mahvoldu.',
  },
  endingC: {
    id: 'BASTION_CHALK',
    title_en: 'Ending C: The Bastion on the Chalk',
    title_tr: 'Son C: Kireçtaşındaki Tabya',
    text_en: 'You tapped the bunker\'s auxiliary geothermal line, bleeding heat and water into the surface barracks. Seventeen froze in the first winter, but the children wear no barcodes. The radio mast on 142.85 MHz now broadcasts weather warnings and clean water coordinates across the steppe.',
    text_tr: 'Sığınağın yardımcı jeotermal hattını yüzey kışlalarına bağlayarak ısı ve su sağladın. İlk kışta on yedi kişi dondu ama çocuklar asla barkod taşımıyor. 142.85 MHz kulesi artık bozkıra infaz çağrıları değil, hava durumu uyarıları ve temiz kuyu koordinatları yayıyor.',
  },
};

/**
 * Returns a random field log for scavenge discovery.
 */
export function getRandomFieldLog(rng) {
  if (!rng || !FIELD_LOGS.length) return FIELD_LOGS[0];
  const idx = rng.int(0, FIELD_LOGS.length - 1);
  return FIELD_LOGS[idx];
}

