/**
/**
 * Last Breath // Comprehensive Location Stories & Regional Lore Database
 * Handcrafted atmospheric post-apocalyptic narratives and sector intelligence
 * for all global travel destinations, with dynamic biome fallbacks.
 */

export const LOCATION_STORIES = {
  // ==========================================
  // EUROPE & NEAR EAST
  // ==========================================
  istanbul: {
    subtitle_tr: 'Boğaz Çöküş Hattı // Çift Kıta Barikatları',
    subtitle_en: 'Bosphorus Fall Line // Dual-Continent Barricades',
    tag_tr: 'Kıyı Metropolü • Asit Sisi • Tehdit: ▲▲',
    tag_en: 'Coastal Metropolis • Acid Mist • Threat: ▲▲',
    story_tr: 'Boğaziçi Köprüleri\'nin devasa çelik halatları paslı sulara gömülmüş. Sisler arasından yükselen minarelerin ve gökdelen iskeletlerinin tepesinde leş kargaları dönüyor. Eski vapur iskeleleri artık haydutların barikatlı geçiş noktaları. Haliç\'ten esen tuzlu ve kimyasal rüzgar, bir zamanlar kıtaları bağlayan bu mega kentin artık devasa bir beton mezarlık olduğunu fısıldıyor.',
    story_en: 'The colossal cables of the Bosphorus bridges lie submerged in rust-tainted waters. Scavenger crows circle broken minarets and skyscraper skeletons rising through chemical fog. Ferry terminals are now fortified raider tollgates. The brackish wind carries the silence of a mega-city that once bridged worlds.',
    landmarks_tr: 'Boğaziçi Köprü Enkazı, Tarihi Yarımada Sığınakları, Haliç Mavna Barikatı',
    landmarks_en: 'Bosphorus Bridge Remains, Peninsula Deep Vaults, Golden Horn Barge Fortress'
  },
  ankara: {
    subtitle_tr: 'İç Anadolu Savunma Kuşağı // Kanyon Sığınağı',
    subtitle_en: 'Central Anatolian Defense Belt // Canyon Redoubt',
    tag_tr: 'Bozkır / Yarı Kırsal • Karasal Soğuk • Tehdit: ▲▲',
    tag_en: 'Steppe / Suburban • Continental Frost • Threat: ▲▲',
    story_tr: 'Karasal ayazın vurduğu bozkır vadisinde, beton bakanlık sığınakları ve çökmüş askeri kışlalar rüzgarla dövülüyor. Şehre inen kanyon yolları devrilmiş otobüs barikatlarıyla kapatılmış. Çorak tepelerden aşağıya bakıldığında, harabelerin derinliklerinden sızan dumanlar ve gece nöbeti ateşleri göze çarpıyor. Burada tek geçer akçe temiz mermi ve kuru yakacak.',
    story_en: 'In the wind-swept steppe valley, brutalist bunker complexes and collapsed military garrisons endure bitter frost. Canyon arteries are barricaded with burned-out bus hulls. From the barren ridges, solitary watchfires flicker amidst the gray concrete cemetery.',
    landmarks_tr: 'Bakanlıklar Yeraltı Sığınakları, Kanyon Barikat Hattı, Paslı Tren Garı',
    landmarks_en: 'Ministry Deep Bunkers, Canyon Barricade Line, Rusted Rail Terminal'
  },
  athens: {
    subtitle_tr: 'Akropol Kül Havzası // Ege Harabeleri',
    subtitle_en: 'Acropolis Ash Basin // Aegean Ruins',
    tag_tr: 'Kıyı / Kayalık • Yakıcı Güneş • Tehdit: ▲▲',
    tag_en: 'Coastal / Rocky • Scorching Glare • Threat: ▲▲',
    story_tr: 'Mermer sütunlar binlerce yıl sonra bu kez nükleer kül ve asit rüzgarlarıyla karardı. Pire Limanı\'nda karaya vurmuş yüzlerce kuru yük gemisi, göçebe balıkçıların ve hurda tüccarlarının derme çatma kalesine dönüşmüş. Güneş kavurucu, hava ise tuz ve yanık lastik kokuyor.',
    story_en: 'Ancient marble pillars stand scorched by fallout and acid winds. In Piraeus Harbor, beached freighters form a sprawling shantytown of nomad scavengers and cutthroats. The sun is blistering, and the air reeks of dried salt and burning tire rubber.',
    landmarks_tr: 'Kararmış Parthenon Sütunları, Pire Batık Filosu, Plaka Yeraltı Sarnıçları',
    landmarks_en: 'Blackened Parthenon Colonnade, Piraeus Graveyard Fleet, Plaka Cisterns'
  },
  sofia: {
    subtitle_tr: 'Vitoşa Yamaç Hattı // Doğu Bloku Koridoru',
    subtitle_en: 'Vitosha Ridge // Eastern Bloc Corridor',
    tag_tr: 'Yarı Kırsal • Dağ Esintisi • Tehdit: ▲▲',
    tag_en: 'Suburban • Mountain Draft • Threat: ▲▲',
    story_tr: 'Vitoşa Dağı\'nın karlı zirvelerinden inen dondurucu hava, Sovyet dönemi devasa beton blokların arasında yankılanıyor. Şehrin tramvay rayları sökülerek barikat çitlerine dönüştürülmüş. Vadide gizlenen yeraltı sığınaklarında hala çalışan birkaç dizel jeneratörün boğuk gürültüsü duyuluyor.',
    story_en: 'Frigid drafts cascading from Mount Vitosha whistle through monolithic concrete housing projects. Tramway rails have been torn up to form perimeter spikes. Deep in the subterranean vaults, the muffled thrum of a surviving diesel generator still echoes.',
    landmarks_tr: 'Vitoşa Dağ Gözetleme Noktası, Tramvay Ray Barikatları, Metro Yeraltı Pazarı',
    landmarks_en: 'Vitosha Mountain Outpost, Rail Barricades, Subterranean Metro Bazaar'
  },
  bucharest: {
    subtitle_tr: 'Karpat Kapısı // Parlamento Monoliti',
    subtitle_en: 'Carpathian Gate // The Parliament Monolith',
    tag_tr: 'Şehir Harabesi • Çamurlu Ovalar • Tehdit: ▲▲▲',
    tag_en: 'Urban Ruin • Mud Plains • Threat: ▲▲▲',
    story_tr: 'Dünyanın en ağır beton binası olan Parlamento Sarayı, kıyametin merkezinde devasa bir lahit gibi yükseliyor. Sarayın altındaki kilometrelerce uzunluktaki tünel labirenti, vahşi haydut çetelerinin ve kaçakçı klanlarının ana üssü haline gelmiş. Dışarıdaki geniş bulvarlar ise paslı otomobil enkazlarıyla kaplı.',
    story_en: 'The colossal Palace of Parliament rises like a stone mountain above flooded boulevards. Its vast nuclear catacombs are now occupied by ruthless scavenger syndicates. Outside, avenues stretch into silence choked with thousands of rusted vehicular carcasses.',
    landmarks_tr: 'Parlamento Lahiti, Dâmbovița Kuru Kanalı, Çavuşesku Kaçış Tünelleri',
    landmarks_en: 'Parliament Megastructure, Dâmbovița Dry Canal, Ceaușescu Escape Tunnels'
  },
  kyiv: {
    subtitle_tr: 'Dinyeper Radyasyon Kuşağı // Askeri Karantina',
    subtitle_en: 'Dnipro Radiation Belt // Military Quarantine',
    tag_tr: 'Askeri Harabe • Yüksek Radyasyon • Tehdit: ▲▲▲▲',
    tag_en: 'Military Ruin • High Radiation • Threat: ▲▲▲▲',
    story_tr: 'Dinyeper Nehri boyunca uzanan köprüler dinamitlerle havaya uçurulmuş. Çernobil\'den güneye sürüklenen radyoaktif toz fırtınaları, Peçersk Manastırı\'nın altın kubbelerini soluk bir griye bürümüş. Sektör, askeri mühimmat depolarını yağmalamak isteyen ağır silahlı lejyonerlerin çatışma sahası.',
    story_en: 'Bridges across the wide Dnipro were severed with demolition charges. Radioactive ash fronts drifting from the north coat golden church domes in dead gray. The city is a contested battlefield for heavily armed deserter cadres fighting over deep military depots.',
    landmarks_tr: 'Çökmüş Dinyeper Köprüleri, Lavra Yeraltı Mahzenleri, Fabrika 410 Radar Kulesi',
    landmarks_en: 'Severed Dnipro Bridges, Lavra Catacombs, Plant 410 Radar Spire'
  },
  vienna: {
    subtitle_tr: 'Tuna Taşkın Bölgesi // Flakturm Kaleleri',
    subtitle_en: 'Danube Silt Basin // The Flakturm Forts',
    tag_tr: 'Şehir Harabesi • Nehir Kokuşması • Tehdit: ▲▲▲',
    tag_en: 'Urban Ruin • Silt Odor • Threat: ▲▲▲',
    story_tr: 'İkinci Dünya Savaşı\'ndan kalma devasa beton Flakturm kuleleri, modern binalar çökerken bile ayakta kalmış ve bağımsız hayatta kalma kantonlarına dönüşmüş. Bir zamanların operaları ve sarayları artık çamur ve moloz yığını. Tuna Nehri kıyısında göçebe tekneler devriye geziyor.',
    story_en: 'Massive WWII Flak Towers survived the collapse while steel towers fell, serving as impenetrable fortress-communes. The imperial palaces are filled with silt and shattered glass. Armored scows patrol the gray sludge of the Danube.',
    landmarks_tr: 'Augarten Flakturm Kalesi, Çökmüş Hofburg Sarayı, Tuna Kanal İskelesi',
    landmarks_en: 'Augarten Flak Citadel, Collapsed Hofburg Palace, Danube Canal Wharf'
  },
  berlin: {
    subtitle_tr: 'Spree Çöküntüsü // Bölünmüş Sektörler',
    subtitle_en: 'Spree Wasteland // Partitioned Zones',
    tag_tr: 'Şehir Harabesi • Sanayi Dumanı • Tehdit: ▲▲▲▲',
    tag_en: 'Urban Ruin • Industrial Haze • Threat: ▲▲▲▲',
    story_tr: 'Brandenburg Kapısı\'nın önü üç katlı dikenli teller ve hurda zırh plakalarıyla çevrili. Şehir yeniden bölünmüş: Doğu yakasında demir yumruklu hurda baronları, batıda ise terk edilmiş metro istasyonlarında yaşayan tünel klanları hakim. Radyasyon detektörleri her köşede huzursuzca cızırdayıp duruyor.',
    story_en: 'Barbed wire and welded plating once again sever the thoroughfares around the Brandenburg Gate. The ruins are split between brutal scrap syndicates in the east and feral metro dwellers in the subterranean western U-Bahn corridors.',
    landmarks_tr: 'Brandenburg Hurda Barikatı, Alexanderplatz Kulesi Kalıntısı, U-Bahn Tünel Hattı',
    landmarks_en: 'Brandenburg Scrap Gate, Alexanderplatz Spire Stub, Subterranean U-Bahn Line'
  },
  paris: {
    subtitle_tr: 'Seine Asit Vadisi // Yeraltı Katakompları',
    subtitle_en: 'Seine Acid Valley // The Bone Catacombs',
    tag_tr: 'Şehir Harabesi • Toksik Sis • Tehdit: ▲▲▲▲',
    tag_en: 'Urban Ruin • Toxic Smog • Threat: ▲▲▲▲',
    story_tr: 'Eyfel Kulesi\'nin üst üçte biri bükülerek Seine Nehri\'nin zehirli çamuruna batmış. Şehrin yüzeyi solunamaz gaz tabakasıyla kaplı olduğu için yaşam tamamen yüz milyon kemiğin bulunduğu antik katakomplara çekilmiş. Yeraltındaki karanlık tünellerde kurulan fener ışıklı takas pazarları şehrin tek nabzı.',
    story_en: 'The top third of the Eiffel Tower collapsed into the caustic mud of the Seine. Surface air is thick with corrosive haze, driving all life down into the six-million-skeleton catacombs where lantern-lit black markets trade in bullets and clean marrow.',
    landmarks_tr: 'Bükülmüş Eyfel İskeleti, Kemik Katakompları, Notre-Dame Kül Yığını',
    landmarks_en: 'Twisted Eiffel Spine, The Bone Catacombs, Notre-Dame Ash Shell'
  },
  london: {
    subtitle_tr: 'Thames Gelgit Bataklığı // Asit Sisi Dokları',
    subtitle_en: 'Thames Tidal Bog // Acid Fog Docks',
    tag_tr: 'Şehir Harabesi • Zehirli Yağmur • Tehdit: ▲▲▲▲',
    tag_en: 'Urban Ruin • Toxic Rainfall • Threat: ▲▲▲▲',
    story_tr: 'Big Ben kulesi kırık bir diş gibi eğilmiş, saati çöküş anında durmuş. Thames Nehri taşarak metro tünellerini bataklığa çevirmiş. Şehri saran sarı asit sisi içinde yüz maskesi olmadan yürümek ciğerleri dakikalar içinde eritir. Şehirde yalnızca sızdırmaz sığınaklardaki çelik klanları hayatta kalabiliyor.',
    story_en: 'Big Ben leans like a jagged tooth, clock face forever frozen at the hour of fire. The Thames breached its embankments, drowning the Tube into an oily quagmire. The suffocating yellow fog melts unprotected lung tissue within minutes.',
    landmarks_tr: 'Kırık Big Ben Saati, Westminster Çamur İskelesi, Tower Köprüsü Hisarı',
    landmarks_en: 'Broken Big Ben Dial, Westminster Silt Barricade, Tower Bridge Bastion'
  },
  madrid: {
    subtitle_tr: 'Merkezi İber Platosu // Güneş Yanığı Harabe',
    subtitle_en: 'Central Iberian Plateau // Sun-Bleached Ruin',
    tag_tr: 'Yarı Kırsal • Aşırı Kuraklık • Tehdit: ▲▲▲',
    tag_en: 'Suburban • Extreme Aridity • Threat: ▲▲▲',
    story_tr: 'Kavurucu İber güneşi altında çatlamış asfalt yollar ve kuruyan Gran Via bulvarı. Su kuyularının etrafında makineli tüfekli paralı askerler nöbet tutuyor. Şehrin banliyölerinde göçebe kervanlar yakıt ve tuz takası yapmak için kısa molalar verip hızla uzaklaşıyor.',
    story_en: 'Under an unforgiving sun, the asphalt of the Gran Vía has buckled into dust. Mercenaries with belt-fed machine guns guard the few deep groundwater bores. Nomad convoys trade fuel and crude salts before fleeing the desert heat.',
    landmarks_tr: 'Gran Via Hurda Vadisi, Prado Müzesi Tahkimatı, Retiro Kuru Havuzu',
    landmarks_en: 'Gran Vía Canyon, Prado Museum Redoubt, Retiro Dry Basin'
  },
  lisbon: {
    subtitle_tr: 'Atlantik Fırtına Burnu // Rüzgarlı Yalılar',
    subtitle_en: 'Atlantic Gale Headland // Wind-Whipped Bluffs',
    tag_tr: 'Kıyı • Şiddetli Fırtına • Tehdit: ▲▲',
    tag_en: 'Coastal • Severe Tempest • Threat: ▲▲',
    story_tr: 'Tajo Nehri\'nin okyanusla buluştuğu noktada tuzlu fırtınalar dik sokakları dövüyor. Yedi tepeye kurulmuş eski kaleler ve manastırlar, okyanustan gelen korsan baskınlarına karşı çelik plakalarla tahkim edilmiş. Balık ve tuz bolluğu burayı nadir bir ticaret limanı yapıyor.',
    story_en: 'Brutal salt gales blast through the cobblestones where the Tagus meets the ocean. Hilltop fortresses have been clad in naval armor against oceanic raider cutters. Salt-cured fish and sea salvaging make this a prized trading shore.',
    landmarks_tr: 'Belem Kulesi Gözetleme Bataryası, 25 Nisan Köprü İskelesi, Alfama Hisarı',
    landmarks_en: 'Belém Tower Battery, 25 de Abril Suspension Ruins, Alfama Stronghold'
  },
  reykjavik: {
    subtitle_tr: 'Jeotermal Buzul Vahası // Kutup Sığınağı',
    subtitle_en: 'Geothermal Glacial Oasis // Arctic Vault',
    tag_tr: 'Kutup / Buzul • Dondurucu Kar • Tehdit: ▲▲',
    tag_en: 'Arctic / Glacial • Freezing Blizzard • Threat: ▲▲',
    story_tr: 'Dış dünyadaki nükleer kışın ortasında, yeraltından fışkıran sıcak su ve gayzerler bu küçük kenti hayatta tutmuş. Seralarda yetiştirilen nadir sebzeler ve jeotermal enerji santralleri burayı kuzeyin en değerli vahası kılıyor. Ancak limana yanaşmaya çalışan çaresiz göçmen gemileri kıyılarda donmuş enkazlar bırakıyor.',
    story_en: 'Amidst global nuclear winter, volcanic geothermal steam keeps this outpost breathing. Glass greenhouses yield fresh produce powered by sub-crust heat. Along the icy fjords, frozen derelict migrant vessels stand as silent tombstones.',
    landmarks_tr: 'Hallgrimskirkja Jeotermal Bacası, Liman Buz Kapanı, Perlan Sıcak Su Kubbesi',
    landmarks_en: 'Hallgrímskirkja Geothermal Spire, Harbor Ice Trap, Perlan Water Dome'
  },
  moscow: {
    subtitle_tr: 'Kremlin Nükleer Krateri // Metro Cumhuriyeti',
    subtitle_en: 'Kremlin Impact Crater // The Metro Republic',
    tag_tr: 'Askeri Harabe • Aşırı Radyasyon • Tehdit: ▲▲▲▲▲',
    tag_en: 'Military Ruin • Extreme Radiation • Threat: ▲▲▲▲▲',
    story_tr: 'Kızıl Meydan\'ın ortasında suyla dolmuş devasa bir nükleer çarpma krateri yatıyor. Yüzeydeki radyasyon seviyesi kurşun zırh olmadan birkaç dakikada insanı öldürecek düzeyde. Hayat, yerin 80 metre altındaki devasa nükleer sığınaklı Metro istasyonlarında; istasyon devletçikleri demir parayla değil mantar ve çelik fişekle ticaret yapıyor.',
    story_en: 'A flooded nuclear impact crater yawns where Red Square once stood. Surface radiation kills within minutes without heavy lead plating. Humanity survives eighty meters underground in the cavernous Metro system, trading in hand-rolled tobacco and military-grade cartridges.',
    landmarks_tr: 'Kızıl Meydan Krateri, Metro Polis İstasyonu, Ostankino Kırık Kulesi',
    landmarks_en: 'Red Square Crater, Polis Station Bastion, Ostankino Broken Mast'
  },
  tbilisi: {
    subtitle_tr: 'Kafkas Geçit Hisarı // Vadi Barikatları',
    subtitle_en: 'Caucasian Defile // The Gorge Bastions',
    tag_tr: 'Kırsal / Dağlık • Dağ Fırtınası • Tehdit: ▲▲',
    tag_en: 'Rural / Mountain • Gorge Tempest • Threat: ▲▲',
    story_tr: 'Kura Nehri\'nin iki yakasındaki sarp kanyon duvarları, şehri doğal bir kaleye çevirmiş. Eski Narikala Kalesi tepeden vadiyi gözetleyen ağır tüfekli klanların elinde. Kafkas dağlarından gelen avcılar burada ayı postu, kurutulmuş et ve el yapımı barut satıyor.',
    story_en: 'Sheer canyon bluffs flanking the Kura River form a natural fortress. The ancient Narikala citadel bristle with long-range heavy rifles. Mountain hunters descend from the high crags to trade cured bear tallow, hides, and corrosive black powder.',
    landmarks_tr: 'Narikala Hisarı, Kura Kanyon Köprüsü, Rustaveli Yeraltı Ambarı',
    landmarks_en: 'Narikala Citadel, Kura Canyon Bridge, Rustaveli Deep Armory'
  },
  tehran: {
    subtitle_tr: 'Elburz Çorak Havzası // Dağaltı Barınakları',
    subtitle_en: 'Alborz Wastes // Sub-Mountain Shelters',
    tag_tr: 'Çorak / Wasteland • Kuru Toz Fırtınası • Tehdit: ▲▲▲',
    tag_en: 'Wasteland • Dry Dust Squalls • Threat: ▲▲▲',
    story_tr: 'Elburz Dağları\'nın eteklerinde kızıl toz bulutları gökyüzünü kapatıyor. Şehrin devasa beton kuleleri kum fırtınalarıyla aşınmış. Eski askeri kışlalardan ve uranyum zenginleştirme tesislerinden yağmalanan malzemeler, yerel savaş beylerinin koruması altındaki kanyon pazarlarında satılıyor.',
    story_en: 'Red dust storms blot out the sun beneath the barren Alborz peaks. Skyscraper frames are eroded by endless abrasive winds. Military salvage from deep mountain facilities is bartered in fortress bazaars ruled by warlord syndicates.',
    landmarks_tr: 'Azadi Kulesi İskeleti, Elburz Tünel Tahkimatı, Büyük Çarşı Mahzeni',
    landmarks_en: 'Azadi Tower Skeleton, Alborz Tunnel Bastion, Grand Bazaar Vaults'
  },
  beirut: {
    subtitle_tr: 'Doğu Akdeniz Harabesi // Liman Kraterleri',
    subtitle_en: 'Levantine Blast Zone // Crater Port',
    tag_tr: 'Kıyı • Kimyasal Serpinti • Tehdit: ▲▲▲',
    tag_en: 'Coastal • Chemical Fallout • Threat: ▲▲▲',
    story_tr: 'Eski liman patlamasının açtığı dev krater, kıyamet dalgalarıyla deniz suyuna karışmış. Beton siloların kalıntıları arkasında kaçakçılar sürat tekneleriyle Levant kıyılarını yağmalıyor. Şehrin lüks otellerinin mermer lobilerinde artık silahlı bekçiler ve kurutulmuş tuz tezgahları duruyor.',
    story_en: 'The legendary blast crater at the docks is drowned in murky seawater. Behind ruined grain silos, smugglers pilot armored speedboats scouring the Levantine coast. Dilapidated marble lobbies now host armed guards and drying salt-flats.',
    landmarks_tr: 'Tahıl Silosu Enkazı, Korniş Barikat Hattı, Hamra Hurda Pazarı',
    landmarks_en: 'Silo Blast Remains, Corniche Defense Wall, Hamra Scrap Souk'
  },

  // ==========================================
  // AFRICA
  // ==========================================
  cairo: {
    subtitle_tr: 'Nil Çöl Mezarlığı // Piramit Gözetleme Hattı',
    subtitle_en: 'Nile Silt Graveyard // The Pyramid Pickets',
    tag_tr: 'Çöl / Çorak • Kum Fırtınası • Tehdit: ▲▲▲',
    tag_en: 'Wasteland • Sandstorm • Threat: ▲▲▲',
    story_tr: 'Gize Piramitleri binlerce yıldır olduğu gibi bu medeniyetin de çöküşünü izledi; taş blokların üzerine ağır makineli tüfek mevzileri kurulmuş. Kuruyan Nil yatağı çatlak bir çamura dönüşmüş. Şehrin milyonluk mezarlığı "Ölüler Şehri", şimdi hayatta kalan klanların en kalabalık yerleşimi.',
    story_en: 'The Pyramids watched another empire crumble; heavy machine guns now crown their ancient limestone blocks. The parched Nile bed has baked into cracked clay. The City of the Dead cemetery is now the densest settlement of desperate clan dwellers.',
    landmarks_tr: 'Gize Piramit Bataryası, Nil Kuru Yatağı, Tahrir Meydanı Siperleri',
    landmarks_en: 'Giza Pyramid Outpost, Dry Nile Riverbed, Tahrir Trench Network'
  },
  tangier: {
    subtitle_tr: 'Cebelitarık Kapısı // Boğaz Gözetleme Burcu',
    subtitle_en: 'Gibraltar Strait Gate // Strait Overlook',
    tag_tr: 'Kıyı • Okyanus Rüzgarı • Tehdit: ▲▲',
    tag_en: 'Coastal • Ocean Gale • Threat: ▲▲',
    story_tr: 'Akdeniz ile okyanusun birleştiği stratejik geçit. Beyaz badanalı Kasbah surları demir plakalarla takviye edilmiş. Boğazdan geçmeye çalışan her gemi, surlardaki eski sahil bataryalarının hedefi oluyor.',
    story_en: 'The strategic choke-point where the Mediterranean meets the Atlantic. White-washed Kasbah bastions have been reinforced with rusted plate. Any ship attempting the strait must pay heavy tribute to the shore gunners.',
    landmarks_tr: 'Kasbah Hisarı, Cebelitarık Gözetleme Burnu, Liman Dalgakıranı',
    landmarks_en: 'Kasbah Strongpoint, Gibraltar Overlook, Port Wavebreak Citadel'
  },
  lagos: {
    subtitle_tr: 'Gine Körfezi Su Şehri // Yüzen Lagün',
    subtitle_en: 'Gulf of Guinea Sump // Floating Lagoon',
    tag_tr: 'Tropik / Şehir • Bataklık Havası • Tehdit: ▲▲▲▲',
    tag_en: 'Urban / Tropical • Swamp Heat • Threat: ▲▲▲▲',
    story_tr: 'Yükselen deniz seviyesi şehri dev bir mangrov bataklığına çevirmiş. Paslı petrol tankerlerinin ve dökme yük gemilerinin güvertelerinde binlerce insan yaşıyor. Ham petrol sızıntıları suya karışırken, kanolarla çalışan korsan filoları körfezi kontrol altında tutuyor.',
    story_en: 'Rising waters transformed the coastal metropolis into an oily mangrove labyrinth. Surviving clans live atop the rusting superstructures of grounded supertankers. Pirate skiffs patrol the maze of rotting highway overpasses.',
    landmarks_tr: 'Tanker Şehri Kolonisi, Üçüncü Anakara Köprüsü Enkazı, Lagün Pazarı',
    landmarks_en: 'Super-Tanker Flotilla, Third Mainland Bridge Ruins, Lagoon Stilt Market'
  },
  johannesburg: {
    subtitle_tr: 'Witwatersrand Altın Havzası // Maden Siperleri',
    subtitle_en: 'Witwatersrand Gold Basin // Mine Redoubts',
    tag_tr: 'Sanayi • Maden Tozu • Tehdit: ▲▲▲▲',
    tag_en: 'Industrial • Heavy Dust • Threat: ▲▲▲▲',
    story_tr: 'Derin altın madenleri kilometrelerce derine inen yeraltı şehirlerine dönüştürüldü. Yüzeydeki maden atık tepeleri silahlı çetelerin keskin nişancı kuleleri haline gelmiş. Çelik, patlayıcı ve eski endüstriyel sondaj aletleri için kanlı çatışmalar yaşanıyor.',
    story_en: 'Deep-level gold mines have been turned into multi-tiered underground redoubts. Tailings heaps are crowned with heavy sniper platforms. Savage skirmishes erupt daily over industrial drills, drill-bits, and blasting charges.',
    landmarks_tr: 'Ponte Şehri Kulesi Kalesi, Derin Maden Şaftları, Sanayi Barikatı',
    landmarks_en: 'Ponte City Fortress, Deep Mine Shafts, Industrial Barrier'
  },
  cape_town: {
    subtitle_tr: 'Ümit Burnu Hisarı // Masa Dağı Sığınağı',
    subtitle_en: 'Cape of Good Hope // Table Mountain Bluff',
    tag_tr: 'Kıyı • Sert Okyanus Akıntısı • Tehdit: ▲▲▲',
    tag_en: 'Coastal • Violent Ocean Swell • Threat: ▲▲▲',
    story_tr: 'Masa Dağı\'nın bulutlarla kaplı düz zirvesi, okyanustan esen vahşi rüzgarları kesiyor. Limandaki konteyner terminalleri devasa bir labirent gibi dizilerek aşılması imkansız bir kale inşa edilmiş. Güney kutbundan gelen soğuk akıntılar kıyılarda bol balık sağlıyor.',
    story_en: 'The flat precipice of Table Mountain shields the shoreline from Antarctic gales. Thousands of shipping containers have been stacked three-high to seal the harbor into an unbreachable bastion fed by icy, rich ocean currents.',
    landmarks_tr: 'Masa Dağı Radar Üssü, Konteyner Şehir Duvarı, Robben Adası Gözetleme Kulesi',
    landmarks_en: 'Table Mountain Radar Post, Container City Wall, Robben Island Watchtower'
  },
  nairobi: {
    subtitle_tr: 'Büyük Rift Vadisi // Vahşi Savana Koridoru',
    subtitle_en: 'Great Rift Valley // Wild Savanna Outpost',
    tag_tr: 'Kırsal • Yüksek Rakım • Tehdit: ▲▲▲',
    tag_en: 'Rural • High Altitude • Threat: ▲▲▲',
    story_tr: 'Yüksek irtifadaki serin savana rüzgarları, devrilmiş haberleşme kulelerinin arasından geçiyor. Şehrin etrafındaki milli parklardan yayılan yırtıcı hayvan sürüleri ve silahlı avcı çeteleri terk edilmiş otoyolları paylaşıyor.',
    story_en: 'Cool highland winds howl through collapsed cell towers across the savanna. Feral predators and nomadic ranger clans contest the cracked tarmac of the Trans-African highway.',
    landmarks_tr: 'Rift Vadisi Barikatı, Uhuru Parkı Sığınağı, Demiryolu Atölyeleri',
    landmarks_en: 'Rift Valley Choke, Uhuru Park Bunker, Rail Scrap Workshops'
  },

  // ==========================================
  // ASIA & OCEANIA
  // ==========================================
  tokyo: {
    subtitle_tr: 'Kanto Çöküş Ovası // Sönmüş Neon Labirenti',
    subtitle_en: 'Kanto Blast Plain // Dark Neon Catacombs',
    tag_tr: 'Metropol Harabesi • Asit Yağmuru • Tehdit: ▲▲▲▲',
    tag_en: 'Urban Ruin • Corrosive Rain • Threat: ▲▲▲▲',
    story_tr: 'Shinjuku ve Shibuya\'nın gökdelenleri kırık cam kuleler gibi göğe yükseliyor; sönmüş reklam panoları paslı demirler üzerinde sallanıyor. Yeraltı tren istasyonları ve sığınak tünellerinde mikro-jeneratörlerle beslenen teknoloji klanları, kıyamet öncesi mikroçipleri ve robotik parçaları altın değerinde saklıyor.',
    story_en: 'Broken glass towers of Shinjuku rise into perpetual smog, dead holographic screens rattling in the wind. In the labyrinthine subway vaults, tech clans powered by micro-dynamos hoard pre-collapse silicone wafers and robotic actuators.',
    landmarks_tr: 'Shibuya Çapraz Barikatı, Tokyo Kulesi İskeleti, Shinjuku Yeraltı Çarşısı',
    landmarks_en: 'Shibuya Crossing Barricade, Tokyo Tower Spire, Shinjuku Underground Market'
  },
  beijing: {
    subtitle_tr: 'Yasak Şehir Monoliti // Çorak Başkent',
    subtitle_en: 'Forbidden Megalith // Barren Capital',
    tag_tr: 'Metropol Harabesi • Kömür Külü • Tehdit: ▲▲▲▲▲',
    tag_en: 'Urban Ruin • Coal Ash Storms • Threat: ▲▲▲▲▲',
    story_tr: 'Yasak Şehir\'in kırmızı surları, nükleer kışın siyah kül fırtınalarıyla kararmış. Tiananmen Meydanı\'nda tank enkazları ve kum torbası siperleri uzanıyor. Ağır zırhlı askeri bürokrat kalıntıları, yüzeyin altındaki devasa sığınak komplekslerinde otoriteyi zorla korumaya çalışıyor.',
    story_en: 'The crimson ramparts of the Forbidden City are caked in coal ash and radioactive soot. Tiananmen Square is a graveyard of rusted battle tanks and trenches. Deep subterranean government bunkers house dogmatic military cadres.',
    landmarks_tr: 'Yasak Şehir Tahkimatı, Tiananmen Siper Hattı, Kuş Yuvası Hurda Arenası',
    landmarks_en: 'Forbidden City Stronghold, Tiananmen Trench Belt, Bird\'s Nest Scrap Arena'
  },
  seoul: {
    subtitle_tr: 'Han Nehri Kuşağı // Askeri Bölge Kalıntıları',
    subtitle_en: 'Han River Perimeter // DMZ Overrun',
    tag_tr: 'Metropol • Toksik Nehir • Tehdit: ▲▲▲▲',
    tag_en: 'Urban • Toxic Water • Threat: ▲▲▲▲',
    story_tr: 'Han Nehri üzerindeki köprüler yıkılmış, nehir yatağı endüstriyel atıklarla parıldıyor. Kuzeyden gelen topçu kraterleri şehri köstebek yuvasına çevirmiş. Yüksek teknolojiye sahip sığınak kapılarında otomatik savunma taretleri hala yetkisiz her hareketi tarıyor.',
    story_en: 'Bridges across the Han lie broken, the water iridescent with chemical sludge. Artillery craters dot the downtown high-rises. Automated sentry guns at private corporate bunker gates still fire on thermal signatures.',
    landmarks_tr: 'Han Nehri Batık Köprüleri, Gangnam Yeraltı Tesisleri, Namsan Kulesi Gözetlemesi',
    landmarks_en: 'Han River Sunken Spans, Gangnam Bunkers, Namsan Tower Post'
  },
  delhi: {
    subtitle_tr: 'Yamuna Çamur Havzası // Yoğun Nüfus Mezarlığı',
    subtitle_en: 'Yamuna Silt Sump // The Dense Graveyard',
    tag_tr: 'Aşırı Kalabalık Harabe • Zehirli Toz • Tehdit: ▲▲▲▲▲',
    tag_en: 'Dense Ruin • Toxic Particulate • Threat: ▲▲▲▲▲',
    story_tr: 'Kızıl Kale\'nin antik kumtaşı duvarları, çöküşün kaosunda yüz binlerce insanın sığındığı bir iç kaleye dönüşmüş. Yamuna Nehri tamamen zehirli gri bir kükürt çamuruna dönmüş durumda. Havada solunum filtrelerini dakikalar içinde tıkayan ağır bir duman tabakası asılı duruyor.',
    story_en: 'The sandstone ramparts of the Red Fort shelter an overcrowded shanty garrison. The Yamuna River has congealed into sulfurous gray sludge. A perpetual haze hanging over the ruins clogs standard filtration respirators within an hour.',
    landmarks_tr: 'Kızıl Kale Tahkimatı, Yamuna Kükürt Yatağı, Chandni Chowk Çarşısı',
    landmarks_en: 'Red Fort Citadel, Yamuna Sulfur Bed, Chandni Chowk Ruins'
  },
  bangkok: {
    subtitle_tr: 'Chao Phraya Taşkın Bataklığı // Yüzen Kanal Şehri',
    subtitle_en: 'Chao Phraya Swamp // Sunken Canal Venice',
    tag_tr: 'Kıyı / Tropik • Boğucu Nem • Tehdit: ▲▲▲',
    tag_en: 'Coastal / Tropical • Suffocating Humidity • Threat: ▲▲▲',
    story_tr: 'Tapınakların altın pagodaları sular altında kalmış caddelerin üzerinde yapayalnız yükseliyor. Hayatta kalanlar birbirine iplerle bağlanmış uzun kuyruklu teknelerde ve tapınak çatılarında yaşıyor. Nem boğucu, sivrisinek sürüleri ise salgın hastalık saçıyor.',
    story_en: 'Gilded pagoda spires rise out of flooded avenues choked with water hyacinth. Clans inhabit interconnected longtail boats and elevated temple rooftops. The tropical humidity is stifling, and bloodborne fevers thrive.',
    landmarks_tr: 'Wat Arun Yüzen Pazarı, Chao Phraya Batık Otoyolu, Çatı Şehirler',
    landmarks_en: 'Wat Arun Floating Stalls, Submerged Expressway, Rooftop Shanties'
  },
  sydney: {
    subtitle_tr: 'Port Jackson Boğazı // Paslı Yelkenler',
    subtitle_en: 'Port Jackson Strait // The Rusted Sails',
    tag_tr: 'Kıyı • Okyanus Fırtınası • Tehdit: ▲▲▲',
    tag_en: 'Coastal • Ocean Gale • Threat: ▲▲▲',
    story_tr: 'Sydney Opera Binası\'nın ikonik beton kabukları, Pasifik korsanlarının gözetleme kulesi ve silah deposuna çevrilmiş. Liman Köprüsü\'nün ortasında devasa bir zırhlı kontrol noktası bulunuyor. Çorak Avustralya taşrasından gelen toz fırtınaları limanı kızıla boyuyor.',
    story_en: 'The concrete shells of the Opera House have been turned into fortified cannon emplacements and armories. The Harbour Bridge serves as a heavily mined tollgate. Red inland dust storms regularly blanket the saltwater bay.',
    landmarks_tr: 'Opera Binası Bataryası, Liman Köprüsü Kapısı, Darling Hurda Rıhtımı',
    landmarks_en: 'Opera House Gun Deck, Harbour Bridge Gate, Darling Scrap Pier'
  },
  darwin: {
    subtitle_tr: 'Kuzey Toprakları Çöl Kapısı // Tropik Çoraklık',
    subtitle_en: 'Northern Territory Outpost // The Scorched Edge',
    tag_tr: 'Çorak / Kıyı • Aşırı Sıcak • Tehdit: ▲▲',
    tag_en: 'Wasteland / Coastal • Scorching Heat • Threat: ▲▲',
    story_tr: 'Kırmızı kumların turkuaz denizle buluştuğu bu sıcak sınır karakolunda, hurda kamyonlar ve zırhlı arazi araçları hüküm sürüyor. Timsahlarla dolu nehir ağızları ve çöl kanyonları arasında tuz, akaryakıt ve su ticareti yapılıyor.',
    story_en: 'Red sands meet the Timor Sea in this sun-blasted frontier redoubt. Armored utes and flatbed trucks roar along the perimeter. Salt, crude ethanol, and drilled water are the sole currencies in this unforgiving territory.',
    landmarks_tr: 'Liman Yakıt Tankları, Kırmızı Kum Savunma Hattı, Tuz Havuzları',
    landmarks_en: 'Harbor Fuel Depots, Red Sand Defense Perimeter, Coastal Salt Pits'
  },

  // ==========================================
  // THE AMERICAS
  // ==========================================
  new_york: {
    subtitle_tr: 'Manhattan Çöküş Adası // Beton Kanyonlar',
    subtitle_en: 'Manhattan Fall Basin // The Concrete Canyons',
    tag_tr: 'Metropol Harabesi • Asit Suları • Tehdit: ▲▲▲▲▲',
    tag_en: 'Urban Ruin • Acidic Floodwaters • Threat: ▲▲▲▲▲',
    story_tr: 'Tüm köprüleri ve tünelleri havaya uçurulmuş Manhattan Adası, dünyanın en tehlikeli harabe labirentidir. Gökdelenlerin alt katları zehirli deniz suyuyla su altında; hayatta kalan klanlar binalar arasına gerdikleri çelik halat hatlarıyla gökyüzünde seyahat ediyor. Central Park artık vahşi köpek sürülerinin avlandığı bataklık bir orman.',
    story_en: 'Every bridge severed and tunnel dynamited, Manhattan is an isolated urban fortress. Lower stories drown in toxic harbor water; factions travel high above along cables strung between shattered skyscrapers. Central Park has reverted to a feral wolf-pack swamp.',
    landmarks_tr: 'Empire State Gözetleme Noktası, Central Park Bataklığı, Wall Street Barikatı',
    landmarks_en: 'Empire State Watchspire, Central Park Swampland, Wall Street Barricade'
  },
  chicago: {
    subtitle_tr: 'Michigan Buzul Çanağı // Rüzgarlı Şehir Mezarlığı',
    subtitle_en: 'Michigan Glacial Bowl // The Windy Graveyard',
    tag_tr: 'Şehir Harabesi • Dondurucu Tipi • Tehdit: ▲▲▲▲',
    tag_en: 'Urban Ruin • Glacial Blizzards • Threat: ▲▲▲▲',
    story_tr: 'Michigan Gölü\'nün donmuş kıyılarından esen dondurucu rüzgar, gökdelen iskeletlerinde devasa buz sarkıtları oluşturuyor. Şehrin yer altındaki yük treni tünelleri, dondurucu yüzeyden kaçan toplulukların yeraltı pazarlarına ev sahipliği yapıyor.',
    story_en: 'Glacial winds sweeping across the frozen expanse of Lake Michigan encase skyscraper ruins in massive ice columns. Deep subterranean freight tunnels house soot-stained survivor communities huddled around barrel stoves.',
    landmarks_tr: 'Willis Kulesi İskeleti, Donmuş Göl Rıhtımları, Yeraltı Tünel Hattı',
    landmarks_en: 'Willis Tower Skeleton, Frozen Harbor Docks, Freight Tunnel Line'
  },
  los_angeles: {
    subtitle_tr: 'Pasifik Kül Havzası // Otoyol Labirenti',
    subtitle_en: 'Pacific Ash Basin // The Highway Labyrinth',
    tag_tr: 'Metropol • Yangın Dumanı • Tehdit: ▲▲▲▲▲',
    tag_en: 'Urban Ruin • Toxic Fire Smog • Threat: ▲▲▲▲▲',
    story_tr: 'Sonsuz otoyol kavşakları ve viyadükler, yüzbinlerce yanmış otomobilin oluşturduğu aşılmaz barikatlarla dolu. Tepelerdeki lüks malikaneler nükleer yangınlarla kül olmuş. Vadideki petrol kuyuları kontrolsüzce yanarak gökyüzünü zifiri karanlığa boğuyor.',
    story_en: 'Infinite multi-tier freeway interchanges are choked with miles of burned-out vehicular wreckage. The hills are barren ash. Uncapped oil wells across the basin burn perpetually, staining the Pacific horizon with pitch-black smoke plumes.',
    landmarks_tr: '405 Otoyolu Mezarlığı, Yanan Petrol Havzası, Sahil Barikat Hattı',
    landmarks_en: '405 Freeway Graveyard, Burning Basin Wells, Coastal Defense Line'
  },
  san_francisco: {
    subtitle_tr: 'Altın Kapı Boğazı // Paslı Halatlar',
    subtitle_en: 'Golden Gate Strait // The Rusted Cables',
    tag_tr: 'Kıyı • Yoğun Asit Sisi • Tehdit: ▲▲▲▲',
    tag_en: 'Coastal • Dense Acid Fog • Threat: ▲▲▲▲',
    story_tr: 'Golden Gate Köprüsü\'nün güney kulesi ayakta kalsa da asma yolu sulara batmış. Körfezi saran ağır kimyasal sis, dik yokuşlardaki binaları çürütüyor. Eski hapishane adası Alcatraz, körfezin en güvenli ve en karanlık takas kalesi olarak işletiliyor.',
    story_en: 'The Golden Gate\'s southern tower still stands, though its deck broke into the tides. Toxic Pacific fog rots Victorian row houses along steep grades. Alcatraz Island operates as an impenetrable fortress-bazaar for offshore scows.',
    landmarks_tr: 'Kırık Golden Gate Kulesi, Alcatraz Takas Kalesi, Transamerica Dikili Taşı',
    landmarks_en: 'Severed Golden Gate Tower, Alcatraz Trade Bastion, Transamerica Obelisk'
  },
  mexico_city: {
    subtitle_tr: 'Zócalo Batık Krateri // Yanardağ Külü',
    subtitle_en: 'Zócalo Caldera // The Volcanic Ash Sump',
    tag_tr: 'Metropol Harabesi • Aşırı Kalabalık • Tehdit: ▲▲▲▲▲',
    tag_en: 'Urban Ruin • Dense Population • Threat: ▲▲▲▲▲',
    story_tr: 'Eski göl tabanına kurulan şehir, sarsıntılar ve çatışmalarla bataklığa gömülmüş; katedral ve saraylar yan yatmış. Popocatépetl Yanardağı\'ndan püsküren kül gökyüzünü kırmızıya boyuyor. Şehrin kanalları ve yeraltı su depoları uğruna amansız kartel savaşları sürüyor.',
    story_en: 'Built upon a dry lakebed, the monumental center has sunk into sulfurous mud; cathedrals lean precariously over cracked plazas. Volcanic ash from Popocatépetl tints the gloom rust-red. Cartel factions wage unending warfare over the remaining freshwater deep wells.',
    landmarks_tr: 'Eğik Katedral, Zócalo Siperleri, Xochimilco Kanal Tahkimatı',
    landmarks_en: 'Leaning Cathedral, Zócalo Redoubt, Xochimilco Fortified Canals'
  },
  buenos_aires: {
    subtitle_tr: 'Río de la Plata Deltası // Paslı Doklar',
    subtitle_en: 'Río de la Plata Delta // Rusted Waterfront',
    tag_tr: 'Şehir Harabesi • Nehir Rüzgarları • Tehdit: ▲▲▲▲',
    tag_en: 'Urban Ruin • River Gales • Threat: ▲▲▲▲',
    story_tr: 'Geniş nehir deltası terk edilmiş kargo gemileriyle tıkanmış. Geniş 9 de Julio Bulvarı boyunca tank barikatları ve çadır kentler uzanıyor. Pampa ovalarından şehre inen sığır çobanları ve akıncılar burada kurşun ve tuz takas ediyor.',
    story_en: 'The broad delta is choked with grounded ocean freighters. The massive 9 de Julio boulevard is a sprawl of shanty strongholds and anti-tank caltrops. Gaucho raiders descend from the pampas to barter dried beef and ammunition.',
    landmarks_tr: 'Dikilitaş Barikatı, Puerto Madero Batık İskelesi, San Telmo Pazarı',
    landmarks_en: 'The Obelisk Outpost, Puerto Madero Sunken Basin, San Telmo Bazaar'
  },
  ushuaia: {
    subtitle_tr: 'Dünyanın Sonu // Kutup Fırtınası Barınağı',
    subtitle_en: 'The Edge of the Earth // Polar Storm Shelter',
    tag_tr: 'Kutup • Dondurucu Buzul • Tehdit: ▲▲',
    tag_en: 'Arctic • Glacial Frost • Threat: ▲▲',
    story_tr: 'Gezegenin en güneyindeki yerleşim birimi. Beagle Kanalı\'nın dondurucu sularında dev balina iskeletleri ve karaya oturmuş araştırma gemileri yatıyor. Rüzgar acımasız ve fırtınalı; ancak buradaki küçük denizci topluluğu, dünyanın nükleer yangınlarından en uzak kalabilmiş şanslı azınlık.',
    story_en: 'The southernmost human redoubt on Earth. In the icy waters of the Beagle Channel, whale skeletons and grounded research vessels weather savage sub-polar gales. It is brutal and freezing, yet far from the atomic fires that consumed the north.',
    landmarks_tr: 'Beagle Kanalı İskelesi, Deniz Feneri Gözetlemesi, Balina Avcıları Hangarı',
    landmarks_en: 'Beagle Channel Wharf, Lighthouse Lookout, Whalers\' Drydock'
  }
};

/**
 * Returns a high-flavor post-apocalyptic narrative for a given location ID,
 * falling back gracefully to procedurally generated biome/country lore.
 */
export function getLocationStory(locationId, locale = 'tr', node = null) {
  const isTr = locale === 'tr';
  const custom = LOCATION_STORIES[locationId];

  if (custom) {
    return {
      id: locationId,
      subtitle: isTr ? custom.subtitle_tr : custom.subtitle_en,
      tag: isTr ? custom.tag_tr : custom.tag_en,
      story: isTr ? custom.story_tr : custom.story_en,
      landmarks: isTr ? custom.landmarks_tr : custom.landmarks_en,
    };
  }

  // Fallback: Procedurally generate narrative based on node biome & country
  const biome = node?.biome || 'urban';
  const country = node?.country || 'Bilinmeyen Bölge';
  const danger = node?.danger || 2;
  const dangerPills = '▲'.repeat(danger);

  const biomeFlavor = {
    urban: {
      tr: 'Yıkılmış beton bloklar, cam kırıklarıyla kaplı caddeler ve paslı otomobil enkazları. Şehrin eski silüeti artık çürüyen bir anıt gibi gökyüzüne uzanıyor. Harabelerin altından sızan rüzgar ve dumanlar, bu metropolde dikkatli adımlar atılması gerektiğini hatırlatıyor.',
      en: 'Collapsed concrete towers, glass-strewn boulevards, and rusted motor carcasses. The skyline stands like a decayed monument against the ash sky. Wind howling through empty elevator shafts warns that scavengers must tread lightly.'
    },
    suburban: {
      tr: 'Yarı çökmüş bahçeli konutlar, yağmalanmış süpermarketler ve devrilmiş elektrik direkleri. Doğa yavaşça asfaltı yarıp yükseliyor. Barikat kurmuş birkaç yerel klan çatılardan yolu gözetliyor.',
      en: 'Half-collapsed residential tracts, gutted grocery depots, and toppled utility lines. Vegetation claws its way through cracked pavement while rooftop lookouts track any motion along the perimeter.'
    },
    coastal: {
      tr: 'Karaya oturmuş dev yük gemileri ve paslı konteyner yığınları kıyıyı kaplamış. Tuzlu ve asitli okyanus rüzgarı metali kemiriyor. Kıyı şeridinde balık ve temiz su arayan göçebe tayfalar konuşlanmış.',
      en: 'Grounded cargo freighters and salt-eaten container heaps litter the shoreline. Corrosive ocean gales gnaw at exposed metal. Nomad beachcombers scavenge the tideline for edible mollusks and clean condensers.'
    },
    military: {
      tr: 'Ağır zırhlı sığınaklar, patlatılmış cephanelikler ve devrilmiş radar kuleleri. Topçu kraterleriyle delik deşik olmuş bu garnizonda hala patlamamış mühimmat ve yağmacı lejyonerler kol geziyor.',
      en: 'Armored blast revetments, detonated ordnance bays, and toppled radar arrays. Heavily cratered by heavy shells, this garrison remains lethal with unexploded ordnance and heavily armed deserter cadres.'
    },
    rural: {
      tr: 'Geniş çorak tarlalar, yanmış ambarlar ve terk edilmiş traktör gövdeleri. Ufuk çizgisi alabildiğine açık; bu da pusu kurmak isteyen haydutlar için açık bir av sahası yaratıyor.',
      en: 'Broad barren fields, burned-out grain silos, and rusted tractor frames. The horizon is wide open, making any solitary traveler an easy target for mounted raiders.'
    },
    wasteland: {
      tr: 'Kavurucu kuru rüzgarlar, kızıl toz fırtınaları ve çatlamış toprak. Gökyüzü radyasyon sisiyle sararmış. Bu çoraklıkta tek bir damla su dahi bir insanın hayatına bedel.',
      en: 'Scorching thermal squalls, red dust fronts, and fissured hardpan. The sky is stained a sickly yellow by fallout. Out in these wastes, a single canteen of potable water is worth a human life.'
    },
    arctic: {
      tr: 'Kemikleri donduran buzul fırtınaları ve kar yığınları altında gömülü yapılar. Soğuk saniyeler içinde zayıfları yere serer; barınak bulmak ve donmaktan kurtulmak hayati önem taşır.',
      en: 'Bone-snapping subzero gales and drifts burying entire structures in ice. The cold claims the weak within minutes; finding insulated thermal shelter is the difference between survival and death.'
    },
    forest: {
      tr: 'Radyasyonla mutasyona uğramış sık bitki örtüsü, devrilmiş ağaçlar ve sisli patikalar. Ağaç dallarının arasından gelen sesler vahşi yırtıcıların veya pusuya yatmış tuzakçıların varlığını ele veriyor.',
      en: 'Mutated overgrowth, fallen timber, and fog-drenched logging tracks. Eerie clicks and branches snapping in the canopy signal the presence of feral apex predators or camouflaged trappers.'
    },
    industrial: {
      tr: 'Paslı kimyasal tankları, dev vinç iskeletleri ve dumanı tüten cüruf tepeleri. Zehirli sızıntılar zemini eritirken, hurda ve alet parçaları için bu tesisler paha biçilmez bir hazinedir.',
      en: 'Rusted chemical cracking towers, broken gantry cranes, and smoking slag heaps. Corrosive runoffs eat through boot leather, yet these complexes hold priceless industrial toolstock and copper.'
    }
  };

  const genericStory = biomeFlavor[biome] || biomeFlavor.urban;

  return {
    id: locationId,
    subtitle: isTr
      ? `${country.toUpperCase()} // ${biome.toUpperCase()} SEKTÖRÜ`
      : `${country.toUpperCase()} // ${biome.toUpperCase()} SECTOR`,
    tag: isTr
      ? `${country} • Biyom: ${biome.toUpperCase()} • Tehdit: ${dangerPills}`
      : `${country} • Biome: ${biome.toUpperCase()} • Threat: ${dangerPills}`,
    story: isTr ? genericStory.tr : genericStory.en,
    landmarks: isTr ? 'Bölgesel Harabeler, Sığınak Girişi, Otoyol Kontrol Noktası' : 'Regional Ruins, Shelter Hatch, Highway Checkpoint',
  };
}

