/**
 * ArenaOS Semantic NLP Engine - FIFA World Cup 2026
 * Processes ticket details, selected language, and user text to simulate a context-aware Large Language Model.
 */

const KNOWLEDGE_BASE = {
  en: {
    greeting: "Hello, I am your ArenaOS Assistant. I see your ticket is for Section {sec}, Row {row}, Seat {seat}. How can I assist you on matchday?",
    no_ticket: "Welcome to ArenaOS. Please enter your ticket details above so I can give you personalized routing and concessions info! How can I help you?",
    concessions: "Based on your seat in Section {sec}, your closest concession is '{shop}' near Gate {gate} (just {dist} meters away). The current queue wait time is {time} minutes. You can also pre-order directly in the 'Concessions' panel!",
    restroom: "The nearest restroom to Section {sec} is located just to the {dir} of Gate {gate}. It includes baby changing facilities and is wheelchair accessible. Wait time is approx. {time} mins.",
    accessibility: "For Section {sec}, the nearest elevator is at Gate {gate}. Wheelchair-accessible seating is at the top of Section {sec}, Row A. We also have sensory rooms located near Gate B and assistive listening headsets available at the Fan Services desk (Gate A).",
    transit: "To leave the stadium, use Gate {gate} which is closest to {transit_type}. Current train platform queues are {train_q} mins. We recommend departing at {dep_time} for a faster, less congested journey.",
    security: "For security assistance, you can click the red SOS button. Rest assured, first-aid stewards are stationed in Section {sec} and Gate {gate}. Prohibited items include bags larger than A4 size, umbrellas, and professional cameras.",
    sustainability: "Help us keep the stadium green! Recycle your beverage cups in the green bins located near Section {sec} to earn 50 EcoPoints. Drinking water refill stations are available next to the restrooms at Gate {gate}.",
    not_understood: "I understand you are asking about '{topic}', but I need a bit more detail. You can ask about: gate paths, closest food, accessibility, restrooms, parking/transit, or stadium rules."
  },
  es: {
    greeting: "Hola, soy tu asistente ArenaOS. Veo que tu boleto es para la Sección {sec}, Fila {row}, Asiento {seat}. ¿Cómo te puedo ayudar hoy?",
    no_ticket: "Bienvenido a ArenaOS. ¡Por favor ingresa los datos de tu boleto arriba para darte rutas y puestos de comida personalizados! ¿Cómo te ayudo?",
    concessions: "Según tu asiento en la Sección {sec}, la comida más cercana es '{shop}' cerca de la Puerta {gate} (a solo {dist} metros). La espera actual es de {time} minutos. ¡Puedes pre-ordenar en el panel de Concesiones!",
    restroom: "El baño más cercano a la Sección {sec} está a la {dir} de la Puerta {gate}. Cuenta con cambiador de bebés y acceso para sillas de ruedas. La espera es de {time} mins.",
    accessibility: "Para la Sección {sec}, el ascensor más cercano está en la Puerta {gate}. Los asientos accesibles están en la Fila A. Las salas sensoriales están en la Puerta B, y hay audífonos de asistencia en Servicios al Fanático (Puerta A).",
    transit: "Para salir, usa la Puerta {gate}, la más cercana a {transit_type}. La espera del tren es de {train_q} mins. Te sugerimos salir a las {dep_time} para evitar multitudes.",
    security: "Si necesitas seguridad, presiona el botón rojo SOS. Hay personal médico en la Sección {sec} y Puerta {gate}. Se prohíben mochilas grandes, paraguas y cámaras profesionales.",
    sustainability: "¡Ayúdanos a cuidar el estadio! Recicla tus vasos en los contenedores verdes de la Sección {sec} y gana 50 EcoPuntos. Hay recarga de agua junto a los baños de la Puerta {gate}.",
    not_understood: "Entiendo que preguntas sobre '{topic}', pero necesito más detalles. Pregúntame sobre: rutas de puertas, comida cercana, accesibilidad, baños, transporte o reglas del estadio."
  },
  fr: {
    greeting: "Bonjour, je suis votre assistant ArenaOS. Votre billet est pour la Section {sec}, Rang {row}, Siège {seat}. Comment puis-je vous aider?",
    no_ticket: "Bienvenue sur ArenaOS. Veuillez saisir votre billet ci-dessus pour obtenir des itinéraires et des infos personnalisés. Comment puis-je vous aider?",
    concessions: "D'après votre siège Section {sec}, le stand le plus proche est '{shop}' près de la Porte {gate} (à {dist} mètres). L'attente est de {time} minutes. Pré-commandez via le panneau 'Restauration'!",
    restroom: "Les toilettes les plus proches de la Section {sec} sont à {dir} de la Porte {gate}. Elles disposent de tables à langer et sont accessibles en fauteuil. Attente : {time} min.",
    accessibility: "Pour la Section {sec}, l'ascenseur est à la Porte {gate}. Les places PMR sont au rang A. Une salle sensorielle se trouve à la Porte B, et des casques d'assistance au service client (Porte A).",
    transit: "Pour quitter le stade, passez par la Porte {gate}, la plus proche de {transit_type}. File d'attente du train : {train_q} min. Départ conseillé à {dep_time}.",
    security: "Pour toute urgence, cliquez sur le bouton rouge SOS. Des secouristes sont en Section {sec} et Porte {gate}. Sacs > A4, parapluies et caméras pro sont interdits.",
    sustainability: "Protégeons le stade ! Recyclez vos gobelets dans les bacs verts Section {sec} pour gagner 50 EcoPoints. Des fontaines d'eau sont situées près des toilettes Porte {gate}.",
    not_understood: "J'ai compris votre question sur '{topic}', mais j'ai besoin de précisions. Vous pouvez demander : accès aux portes, nourriture, accessibilité, toilettes, transports ou règlement."
  },
  pt: {
    greeting: "Olá, sou o seu Assistente ArenaOS. O seu ingresso é para a Seção {sec}, Fileira {row}, Assento {seat}. Como posso ajudar?",
    no_ticket: "Bem-vindo ao ArenaOS. Insira o seu ingresso acima para receber rotas e opções de comida personalizadas! Como posso ajudar?",
    concessions: "Com base na Seção {sec}, a lanchonete mais próxima é '{shop}' perto do Portão {gate} (a {dist} metros). Tempo de espera: {time} min. Você pode pedir no painel 'Alimentação'!",
    restroom: "Os banheiros perto da Seção {sec} ficam à {dir} do Portão {gate}. Acessíveis para cadeirantes e com fraldário. Espera: {time} min.",
    accessibility: "Para a Seção {sec}, o elevador fica no Portão {gate}. Assentos acessíveis na Fileira A. Salas sensoriais no Portão B e fones assistivos no Serviço ao Torcedor (Portão A).",
    transit: "Para sair do estádio, use o Portão {gate}, próximo ao {transit_type}. Fila do trem: {train_q} min. Recomendamos sair às {dep_time} para evitar trânsito.",
    security: "Para segurança, clique no botão SOS. Socorristas estão na Seção {sec} e Portão {gate}. Proibido bolsas grandes, guarda-chuvas e câmeras profissionais.",
    sustainability: "Ajude-nos com a sustentabilidade! Recicle copos nas lixeiras verdes da Seção {sec} e ganhe 50 EcoPontos. Bebedouros estão ao lado dos banheiros no Portão {gate}.",
    not_understood: "Entendi que você pergunta sobre '{topic}', mas preciso de detalhes. Pergunte sobre: portões, lanchonetes, acessibilidade, banheiros, transporte ou regras."
  },
  de: {
    greeting: "Hallo, ich bin Ihr ArenaOS-Assistent. Ihr Ticket gilt für Sektor {sec}, Reihe {row}, Platz {seat}. Wie kann ich Ihnen heute helfen?",
    no_ticket: "Willkommen bei ArenaOS. Bitte geben Sie oben Ihr Ticket ein, um personalisierte Routen zu erhalten. Wie kann ich helfen?",
    concessions: "Für Sektor {sec} ist der nächste Imbiss '{shop}' an Tor {gate} (nur {dist} Meter entfernt). Wartezeit beträgt {time} Minuten. Vorbestellung im Menü möglich!",
    restroom: "Die nächsten WCs für Sektor {sec} befinden sich {dir} von Tor {gate}. Barrierefrei und mit Wickeltisch. Wartezeit: ca. {time} Min.",
    accessibility: "Für Sektor {sec} ist der nächste Aufzug an Tor {gate}. Rollstuhlplätze befinden sich in Reihe A. Sensorikräume an Tor B, Hörhilfen beim Fan-Service (Tor A).",
    transit: "Zum Verlassen nutzen Sie Tor {gate} nahe {transit_type}. Wartezeit an der Bahn: {train_q} Min. Empfohlene Abreisezeit: {dep_time} Uhr.",
    security: "Für Hilfe nutzen Sie den SOS-Knopf. Sanitäter finden Sie in Sektor {sec} und an Tor {gate}. Rucksäcke größer als A4, Schirme und Profikameras verboten.",
    sustainability: "Halten Sie das Stadion sauber! Becher in grüne Behälter bei Sektor {sec} werfen und 50 EcoPunkte sichern. Trinkwasserstationen an Tor {gate}.",
    not_understood: "Ich verstehe die Frage zu '{topic}', benötige aber mehr Details. Fragen Sie nach: Wegen, Essen, Barrierefreiheit, WCs, Verkehr oder Stadionordnung."
  },
  ar: {
    greeting: "مرحباً، أنا مساعد ArenaOS الخاص بك. تذكرتك في القسم {sec}، الصف {row}، المقعد {seat}. كيف يمكنني مساعدتك اليوم؟",
    no_ticket: "مرحباً بك في ArenaOS. يرجى إدخال تفاصيل تذكرتك أعلاه للحصول على توجيهات ومطاعم مخصصة! كيف أستطيع مساعدتك؟",
    concessions: "بناءً على مقعدك في القسم {sec}، أقرب مطعم هو '{shop}' بالقرب من البوابة {gate} (على بعد {dist} أمتار). الانتظار الحالي هو {time} دقائق. يمكنك الطلب مسبقاً!",
    restroom: "أقرب دورة مياه للقسم {sec} تقع على {dir} البوابة {gate}. مهيأة للكراسي المتحركة وتضم طاولة غيار للأطفال. وقت الانتظار {time} دقائق.",
    accessibility: "للقسم {sec}، أقرب مصعد في البوابة {gate}. مقاعد الكراسي المتحركة في الصف A. الغرف الحسية في البوابة B، وسماعات المساعدة في مكتب خدمة المشجعين (البوابة A).",
    transit: "لمغادرة الاستاد، استخدم البوابة {gate} القريبة من {transit_type}. طوابير القطار تستغرق {train_q} دقيقة. ننصح بالمغادرة الساعة {dep_time} لتفادي الزحام.",
    security: "للمساعدة الأمنية، اضغط على زر SOS الأحمر. يتواجد المسعفون في القسم {sec} والبوابة {gate}. يُمنع إدخال الحقائب الكبيرة والمظلات والكاميرات الاحترافية.",
    sustainability: "ساعدنا في الحفاظ على بيئة الاستاد! أعد تدوير أكوابك في الحاويات الخضراء بالقسم {sec} لكسب 50 نقطة بيئية. تتوفر برادات مياه الشرب بجوار الحمامات عند البوابة {gate}.",
    not_understood: "لقد فهمت استفسارك حول '{topic}'، لكني أحتاج إلى مزيد من التفاصيل. يمكنك الاستفسار عن: الطرق، الطعام، التسهيلات، الحمامات، النقل، أو القوانين."
  }
};

class ArenaAiEngine {
  constructor() {
    this.currentLanguage = 'en';
  }

  setLanguage(lang) {
    if (KNOWLEDGE_BASE[lang]) {
      this.currentLanguage = lang;
    }
  }

  /**
   * Generates a conversational AI response based on ticket context and user queries.
   */
  processQuery(queryText, ticket, simulationState) {
    const lang = this.currentLanguage;
    const text = queryText.toLowerCase().trim();
    
    // Default context fallback if no ticket is supplied
    const sec = ticket.section || "105";
    const row = ticket.row || "M";
    const seat = ticket.seat || "14";
    const hasTicket = !!ticket.section;

    // Build template variables
    const variables = this.getDynamicVariables(sec, row, seat, simulationState);

    if (!hasTicket && text.includes("hello") || text.includes("hi")) {
      return this.replaceTemplate(KNOWLEDGE_BASE[lang].no_ticket, variables);
    }

    // Intent routing
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return this.replaceTemplate(KNOWLEDGE_BASE[lang].greeting, variables);
    }

    if (text.includes("food") || text.includes("eat") || text.includes("drink") || text.includes("beer") || text.includes("hungry") || text.includes("concession") || text.includes("shop") || text.includes("taco") || text.includes("burger")) {
      return this.replaceTemplate(KNOWLEDGE_BASE[lang].concessions, variables);
    }

    if (text.includes("restroom") || text.includes("toilet") || text.includes("bathroom") || text.includes("wc") || text.includes("washroom") || text.includes("lavatory")) {
      return this.replaceTemplate(KNOWLEDGE_BASE[lang].restroom, variables);
    }

    if (text.includes("wheelchair") || text.includes("disabled") || text.includes("accessible") || text.includes("elevator") || text.includes("lift") || text.includes("sensory") || text.includes("stair")) {
      return this.replaceTemplate(KNOWLEDGE_BASE[lang].accessibility, variables);
    }

    if (text.includes("transit") || text.includes("bus") || text.includes("train") || text.includes("rail") || text.includes("parking") || text.includes("station") || text.includes("leave") || text.includes("exit")) {
      return this.replaceTemplate(KNOWLEDGE_BASE[lang].transit, variables);
    }

    if (text.includes("security") || text.includes("police") || text.includes("emergency") || text.includes("bag") || text.includes("rule") || text.includes("camera") || text.includes("umbrella") || text.includes("prohibit")) {
      return this.replaceTemplate(KNOWLEDGE_BASE[lang].security, variables);
    }

    if (text.includes("sustainability") || text.includes("green") || text.includes("recycle") || text.includes("eco") || text.includes("water refill") || text.includes("refill") || text.includes("point")) {
      return this.replaceTemplate(KNOWLEDGE_BASE[lang].sustainability, variables);
    }

    // Keyword matching fallback (tries to isolate the main word to feedback)
    const keywords = ["food", "toilet", "elevator", "parking", "train", "baggage", "recycle", "gate"];
    let detectedTopic = "matchday options";
    for (let word of keywords) {
      if (text.includes(word)) {
        detectedTopic = word;
        break;
      }
    }
    
    return this.replaceTemplate(KNOWLEDGE_BASE[lang].not_understood, { ...variables, topic: detectedTopic });
  }

  /**
   * Determines nearest services dynamically based on seat section
   */
  getDynamicVariables(sec, row, seat, state) {
    const sectionNum = parseInt(sec) || 100;
    
    // Mock spatial math to make the output feel 100% realistic
    let nearestGate = "A";
    let closestShop = "Burgers & Brews";
    let shopDist = 35;
    let shopWait = 4;
    let restroomDir = "left";
    let transitType = "MetLife Rail Station Line 1";
    let trainQ = 22;
    let depTime = "21:45";

    if (sectionNum >= 101 && sectionNum <= 110) {
      nearestGate = "A";
      closestShop = "El Taco Loco";
      shopDist = 28;
      shopWait = state.concessionsWait.tacos || 3;
      restroomDir = "right";
      transitType = "North Parking Lot Shuttle";
      trainQ = 15;
      depTime = "22:00";
    } else if (sectionNum >= 111 && sectionNum <= 120) {
      nearestGate = "B";
      closestShop = "Pitch Grill & Beer";
      shopDist = 45;
      shopWait = state.concessionsWait.grill || 6;
      restroomDir = "left";
      transitType = "East Hub Rideshare Gate B";
      trainQ = 20;
      depTime = "21:50";
    } else if (sectionNum >= 121 && sectionNum <= 130) {
      nearestGate = "C";
      closestShop = "Green Vegan Stadium Foods";
      shopDist = 18;
      shopWait = state.concessionsWait.vegan || 2;
      restroomDir = "right";
      transitType = "Express Metro Line 4";
      trainQ = 28;
      depTime = "21:40";
    } else {
      nearestGate = "D";
      closestShop = "Souvenir Snacks";
      shopDist = 50;
      shopWait = state.concessionsWait.snacks || 5;
      restroomDir = "left";
      transitType = "South Bus Terminus";
      trainQ = 10;
      depTime = "22:10";
    }

    return {
      sec: sec,
      row: row,
      seat: seat,
      gate: nearestGate,
      shop: closestShop,
      dist: shopDist,
      time: shopWait,
      dir: restroomDir,
      transit_type: transitType,
      train_q: trainQ,
      dep_time: depTime
    };
  }

  replaceTemplate(str, obj) {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return obj[key] !== undefined ? obj[key] : match;
    });
  }
}

// Export instance
window.arenaAiEngine = new ArenaAiEngine();
