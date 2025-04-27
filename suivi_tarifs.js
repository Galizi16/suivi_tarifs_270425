// ==========================================================================
// ==                      CONFIGURATION & DATA SUIVI                      ==
// ==========================================================================
const SUIVI_API_CONFIG = {
    // !! IMPORTANT !!
    // REMPLACE CETTE URL PAR CELLE OBTENUE APRÈS LE DÉPLOIEMENT DE TON *NOUVEAU* SCRIPT GOOGLE APPS SUIVI
    // Le format sera : https://script.google.com/macros/s/VOTRE_ID_DEPLOIEMENT_SUIVI/exec
    apiUrl: 'https://script.google.com/macros/s/AKfycbyCOC47muFct7GYvN1tn7Teiyz18BT5FyC6z6FJJZFaTKY8moyaV0q2k-iJtNFc3pXcqg/exec', // <--- METS LA NOUVELLE URL ICI !
};
const sheetDataCacheSuivi = {
    timestamp: null,
    data: null, // Contiendra { baseRates:{}, travcoBaseRates:{}, tariffStructure:[], partners:[] }
    ttl: 15 * 60 * 1000 // Cache de 15 minutes en millisecondes
};

// Références pour calculs (copiées de script.js)
const ABSOLUTE_BASE_CATEGORY_NAME = 'Double Classique';
const BASE_RATE_PLAN_NAME = 'OTA-RO-FLEX';
const TRAVCO_BASE_CATEGORY = 'Double Classique';
const TRAVCO_BASE_PLAN = 'TRAVCO-BB-FLEX-NET';

// Descriptions des plans pour l'aide contextuelle (copiées de script.js)
const ratePlanDescriptions = {
    'OTA-RO-FLEX': 'Chambre Seule, Flexible',
    'OTA-RO-NANR': 'Chambre Seule, Non-Annulable',
    'OTA-BB-FLEX-1P': 'Petit Déj. inclus (1p), Flexible',
    'OTA-BB-FLEX-2P': 'Petit Déj. inclus (2p), Flexible',
    'OTA-BB-FLEX-4P': 'Petit Déj. inclus (4p), Flexible',
    'OTA-BB-NANR-1P': 'Petit Déj. inclus (1p), Non-Annulable',
    'OTA-BB-NANR-2P': 'Petit Déj. inclus (2p), Non-Annulable',
    'OTA-BB-NANR-4P': 'Petit Déj. inclus (4p), Non-Annulable',
    'MOBILE-RO-FLEX': 'Mobile - Chambre Seule, Flexible',
    'MOBILE-RO-NANR': 'Mobile - Chambre Seule, Non-Annulable',
    'MOBILE-BB-FLEX-1-P': 'Mobile - Petit Déj. inclus (1p), Flexible', // Vérifier si utile
    'MOBILE-BB-FLEX-1P': 'Mobile - Petit Déj. inclus (1p), Flexible',
    'MOBILE-BB-FLEX-2P': 'Mobile - Petit Déj. inclus (2p), Flexible',
    'MOBILE-BB-FLEX-4P': 'Mobile - Petit Déj. inclus (4p), Flexible',
    'MOBILE-BB-NANR-1P': 'Mobile - Petit Déj. inclus (1p), Non-Annulable',
    'MOBILE-BB-NANR-2P': 'Mobile - Petit Déj. inclus (2p), Non-Annulable',
    'MOBILE-BB-NANR-4P': 'Mobile - Petit Déj. inclus (4p), Non-Annulable',
    'VIP-RATE-FLEX': 'VIP - Chambre Seule, Flexible', // Vérifier si utile
    'VIP-RO-FLEX': 'VIP - Chambre Seule, Flexible',
    'VIP-RO-NANR': 'VIP - Chambre Seule, Non-Annulable',
    'VIP-BB-FLEX-1P': 'VIP - Petit Déj. inclus (1p), Flexible',
    'VIP-BB-FLEX-2P': 'VIP - Petit Déj. inclus (2p), Flexible',
    'VIP-BB-FLEX-4P': 'VIP - Petit Déj. inclus (4p), Flexible',
    'VIP-BB-NANR-1P': 'VIP - Petit Déj. inclus (1p), Non-Annulable',
    'VIP-BB-NANR-2P': 'VIP - Petit Déj. inclus (2p), Non-Annulable',
    'VIP-BB-NANR-4P': 'VIP - Petit Déj. inclus (4p), Non-Annulable',
    'HB-RO-FLEX-BRUT': 'Hotelbeds RO Flex Brut',
    'TO-RO-FLEX-NET': 'TO RO Flex Net',
    'TO-RO-NANR-BRUT': 'TO RO NANR Brut',
    'TO-RO-NANR-NET': 'TO RO NANR Net',
    'TO-BB-FLEX-BRUT-1P': 'TO BB Flex Brut 1P',
    'TO-BB-FLEX-BRUT-2P': 'TO BB Flex Brut 2P',
    'TO-BB-FLEX-BRUT-4P': 'TO BB Flex Brut 4P',
    'TO-BB-NANR-BRUT-1P': 'TO BB NANR Brut 1P',
    'TO-BB-NANR-BRUT-2P': 'TO BB NANR Brut 2P',
    'TO-BB-NANR-BRUT-4P': 'TO BB NANR Brut 4P',
    'TO-BB-FLEX-NET-1P': 'TO BB Flex Net 1P',
    'TO-BB-FLEX-NET-2P': 'TO BB Flex Net 2P',
    'TO-BB-FLEX-NET-4P': 'TO BB Flex Net 4P',
    'TO-BB-NANR-NET-1P': 'TO BB NANR Net 1P',
    'TO-BB-NANR-NET-2P': 'TO BB NANR Net 2P',
    'TO-BB-NANR-NET-4P': 'TO BB NANR Net 4P',
    'HOTUSA-RO-FLEX': 'Hotusa RO Flex',
    'HOTUSA-RO-NANR': 'Hotusa RO NANR',
    'HOTUSA-BB-FLEX-1P': 'Hotusa BB Flex 1P',
    'HOTUSA-BB-FLEX-2P': 'Hotusa BB Flex 2P',
    'HOTUSA-BB-FLEX-4P': 'Hotusa BB Flex 4P',
    'HOTUSA-BB-NANR-1P': 'Hotusa BB NANR 1P',
    'HOTUSA-BB-NANR-2P': 'Hotusa BB NANR 2P',
    'HOTUSA-BB-NANR-4P': 'Hotusa BB NANR 4P',
    'FB-CORPO-RO-FLEX': 'FB Corpo RO Flex',
    'FB-CORPO-BB-FLEX-1P': 'FB Corpo BB Flex 1P',
    'FB-CORPO-BB-FLEX-2P': 'FB Corpo BB Flex 2P',
    'FB-CORPO-BB-FLEX-4P': 'FB Corpo BB Flex 4P',
    'AMEX-GBT': 'AMEX GBT',
    'AMEX-GBT - AMEX GBT': 'AMEX GBT (Alt)', // Vérifier si utile
    'CWT-BB-FLEX': 'CWT BB Flex',
    'PKG-EXP-RO-FLEX': 'Package Expedia RO Flex',
    'PKG-EXP-RO-NANR': 'Package Expedia RO NANR',
    'PKG-EXP-BB-FLEX-1P': 'Package Expedia BB Flex 1P',
    'PKG-EXP-BB-FLEX-2P': 'Package Expedia BB Flex 2P',
    'PKG-EXP-BB-FLEX-4P': 'Package Expedia BB Flex 4P',
    'PKG-EXP-BB-NANR-1P': 'Package Expedia BB NANR 1P',
    'PKG-EXP-BB-NANR-2P': 'Package Expedia BB NANR 2P',
    'PKG-EXP-BB-NANR-4P': 'Package Expedia BB NANR 4P',
    'PROMO-TO-RO-FLEX': 'Promo TO RO Flex',
    'PROMO-TO-RO-NANR': 'Promo TO RO NANR',
    'PROMO-TO-BB-1-FLEX': 'Promo TO BB 1P Flex', // Vérifier si utile
    'PROMO-TO-BB-1P-FLEX': 'Promo TO BB 1P Flex',
    'PROMO-TO-BB-1P-NANR': 'Promo TO BB 1P NANR',
    'PROMO-TO-BB-2P-FLEX': 'Promo TO BB 2P Flex',
    'PROMO-TO-BB-2P-NANR': 'Promo TO BB 2P NANR',
    'PROMO-TO-BB-4P-FLEX': 'Promo TO BB 4P Flex',
    'PROMO-TO-BB-4P-NANR': 'Promo TO BB 4P NANR',
    'PROMO-HB-RO-FLEX': 'Promo HB RO Flex',
    'PROMO-HB-RO-NANR': 'Promo HB RO NANR',
    'PROMO-HB-BB-FLEX-1P': 'Promo HB BB Flex 1P',
    'PROMO-HB-BB-FLEX-2P': 'Promo HB BB Flex 2P',
    'PROMO-HB-BB-FLEX-4P': 'Promo HB BB Flex 4P',
    'PROMO-HB-BB-NANR-1P': 'Promo HB BB NANR 1P',
    'PROMO-HB-BB-NANR-2P': 'Promo HB BB NANR 2P',
    'PROMO-HB-BB-NANR-4P': 'Promo HB BB NANR 4P',
    'TRAVCO-BB-FLEX-NET': 'Travco BB Flex Net',
    'TRAVCO-BB-NANR-NET': 'Travco BB NANR Net',
};

// --- Structures globales pour les données chargées ---
let baseRatesByDate = new Map(); // Map: 'YYYY-MM-DD' -> rate (OTA-RO-FLEX Double Classique)
let travcoBaseRatesByDate = new Map(); // Map: 'YYYY-MM-DD' -> rate (TRAVCO-BB-FLEX-NET Double Classique)
let partnerToPlansMap = new Map(); // Map: PartnerName -> Set<PlanCode>
let planToCategoriesMap = new Map(); // Map: PlanCode -> Set<CategoryName>
let categoryToPlansMap = new Map(); // Map: CategoryName -> Set<PlanCode>
let allPartners = new Set();
let allCategories = new Set();
let allPlans = new Set();
let originalPlanOrder = {}; // Map: CategoryName -> Array<PlanCode> (pour conserver l'ordre d'affichage)

// --- État de l'interface dynamique ---
let comparisonBlockCounter = 0; // Compteur pour les blocs partenaire/plan
let tarifsChart = null; // Instance de Chart.js


// ==========================================================================
// ==                         FONCTIONS UTILITAIRES                        ==
// ==========================================================================

function showAlert(message, type = 'info', duration = 7000) {
    const alertDiv = document.getElementById('suivi-alertContainer');
     if (!alertDiv) { console.error("Element 'suivi-alertContainer' introuvable."); return; }
    const alertClass = {
        info: 'bg-blue-900/30 border-blue-500 text-blue-200',
        error: 'bg-red-900/30 border-red-500 text-red-200',
        success: 'bg-green-900/30 border-green-500 text-green-200',
        warning: 'bg-yellow-900/30 border-yellow-500 text-yellow-200'
    }[type];
    const icon = {
        info: 'fa-info-circle',
        error: 'fa-exclamation-triangle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle' // Warning utilise aussi triangle
    }[type];
    const alertId = `suivi-alert-${Date.now()}`;

    const alertHtml = `
        <div id="${alertId}" class="border-l-4 ${alertClass} p-4 rounded-lg mb-4 fade-in" role="alert">
            <div class="flex items-center">
                <div class="flex-shrink-0 text-xl mr-3">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="flex-grow">
                    <p class="text-sm">${message.replace(/\n/g, '<br>')}</p>
                </div>
                 <button type="button" class="ml-auto -mx-1.5 -my-1.5 text-gray-300 hover:text-white close-alert-button" aria-label="Close">
                     <span class="sr-only">Close</span><i class="fas fa-times"></i>
                 </button>
            </div>
        </div>
    `;

    alertDiv.insertAdjacentHTML('beforeend', alertHtml);
     const alertElement = alertDiv.querySelector(`#${alertId}`);
     if (alertElement) {
         const closeButton = alertElement.querySelector(`.close-alert-button`);
         if (closeButton) { closeButton.addEventListener('click', () => alertElement.remove()); }
         if (duration > 0) { setTimeout(() => { alertElement.style.opacity = '0'; setTimeout(() => alertElement.remove(), 300); }, duration); }
     }
}


function formatDateYYYYMMDD(date) {
    // Fonction copiée de script.js
    if (!(date instanceof Date) || isNaN(date.getTime())) { return null; }
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateLocale(date) {
     // Fonction copiée de script.js
    if (!(date instanceof Date) || isNaN(date.getTime())) { return "Date invalide"; }
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' };
    try { return date.toLocaleDateString('fr-FR', options); }
    catch (e) { return formatDateYYYYMMDD(date) || "Date invalide"; }
}

function generateStayDates(arrivalDateString, nights) {
    // Fonction copiée de script.js
    if (!arrivalDateString) { throw new Error("Date d'arrivée manquante."); }
    const nightsInt = parseInt(nights, 10);
    if (isNaN(nightsInt) || nightsInt < 1) { throw new Error("Nombre de nuits invalide."); }

    const startDate = new Date(arrivalDateString + 'T00:00:00Z'); // Utilise Z pour UTC
    if (isNaN(startDate.getTime())) { throw new Error("Format de date d'arrivée incorrect ou invalide."); }

    const dates = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < nightsInt; i++) {
        dates.push(new Date(currentDate)); // Ajoute copie de la date du jour
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Passe au jour suivant (UTC)
    }
    return dates;
}

function getElementValue(id) {
    const element = document.getElementById(id);
    if (!element) { console.warn(`getElementValue: Element ID '${id}' non trouvé.`); return null; }
    return element.value;
}
function getElementValueAsInt(id) {
    const value = getElementValue(id);
    const parsed = value ? parseInt(value, 10) : NaN;
    return isNaN(parsed) ? null : parsed;
}


// --- Fonctions de Récupération & Traitement des Données ---

async function fetchAndProcessSuiviData() {
    const now = Date.now();
    // Désactiver le cache pour le développement/debug si besoin, sinon l'activer
    // if (sheetDataCacheSuivi.data && sheetDataCacheSuivi.timestamp && (now - sheetDataCacheSuivi.timestamp < sheetDataCacheSuivi.ttl)) {
    //     console.log("SUIVI: Utilisation données cache.");
    //     return sheetDataCacheSuivi.data;
    // }

    console.log("SUIVI: Appel Apps Script pour toutes les données...");
    showAlert("Chargement des données de tarifs...", "info", 0); // 0 = pas de disparition auto

    if (!SUIVI_API_CONFIG.apiUrl || SUIVI_API_CONFIG.apiUrl.includes('URL_DE_TON_NOUVEAU_GAS_SUIVI')) {
        const errorMsg = "URL API SUIVI non configurée dans suivi_tarifs.js ! Déploie ton nouveau script Google Apps et colle l'URL.";
        showAlert(errorMsg, 'error', 0);
        throw new Error(errorMsg);
    }

    try {
        const url = `${SUIVI_API_CONFIG.apiUrl}?action=getAllData&t=${Date.now()}`; // Ajout timestamp pour éviter cache navigateur agressif
        console.log(`SUIVI: Fetching: ${url}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // Timeout 45s

        const response = await fetch(url, { method: 'GET', signal: controller.signal });
        clearTimeout(timeoutId);

        // Enlève le message "Chargement..."
         const loadingMessage = document.querySelector('#suivi-alertContainer .alert-info');
         if (loadingMessage) { loadingMessage.remove(); }


        if (!response.ok) {
            let errorText = `Erreur ${response.status} ${response.statusText}`;
            try {
                const errorBody = await response.text(); console.error("SUIVI: Réponse erreur brute:", errorBody.substring(0, 300));
                errorText += ` - ${errorBody.substring(0, 300)}`;
            } catch (e) { /* ignore si lecture body échoue */ }
            throw new Error(`SUIVI: Erreur API (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log("SUIVI: Données brutes reçues:", JSON.stringify(data).substring(0, 500) + '...');

        if (data.error) { throw new Error(data.message || "SUIVI: Erreur renvoyée par le Google Apps Script."); }

        // Validation basique de la structure attendue
        if (!data || typeof data !== 'object' || typeof data.baseRates !== 'object' || typeof data.travcoBaseRates !== 'object' || !Array.isArray(data.tariffStructure) || !Array.isArray(data.partners)) {
            console.error("SUIVI: Format de données invalide reçu:", data);
            throw new Error("SUIVI: Format des données (baseRates/travcoBaseRates/tariffStructure/partners) invalide.");
        }

        console.log(`SUIVI: Données chargées: OTA=${Object.keys(data.baseRates).length}, Travco=${Object.keys(data.travcoBaseRates).length}, Structure=${data.tariffStructure.length}, Partenaires=${data.partners.length}`);

        processFetchedSuiviData(data); // Traite et stocke les données
        sheetDataCacheSuivi.data = data; // Met en cache
        sheetDataCacheSuivi.timestamp = now;

        showAlert("Données de tarifs chargées avec succès.", "success", 5000);
        return data;

    } catch (error) {
        console.error("SUIVI: Erreur détaillée fetch/process:", error);
        const loadingMessage = document.querySelector('#suivi-alertContainer .alert-info');
        if (loadingMessage) { loadingMessage.remove(); }
        // Affiche message erreur persistant
        showAlert(`Erreur critique chargement données: ${error.message}. Vérifie la configuration et la console (F12). Recharge la page ou contacte le support.`, 'error', 0);
        // Réinitialise tout en cas d'erreur critique
        clearProcessedSuiviData();
        sheetDataCacheSuivi.data = null; sheetDataCacheSuivi.timestamp = null;
         // Désactive les formulaires si chargement échoue
         disableSuiviForm();
        throw error; // Propage l'erreur
    }
}

function clearProcessedSuiviData() {
    baseRatesByDate.clear();
    travcoBaseRatesByDate.clear();
    partnerToPlansMap.clear();
    planToCategoriesMap.clear();
    categoryToPlansMap.clear();
    allPartners.clear();
    allCategories.clear();
    allPlans.clear();
    originalPlanOrder = {};
     console.log("SUIVI: Données globales effacées.");
}

function processFetchedSuiviData(data) {
    console.log("SUIVI: Début du traitement des données reçues...");
    clearProcessedSuiviData(); // Vide les structures avant de remplir

    // 1. Process Base Rates (OTA)
    if (data.baseRates && typeof data.baseRates === 'object') {
         baseRatesByDate = new Map(Object.entries(data.baseRates));
    } else {
         console.warn("SUIVI: Données baseRates (OTA) manquantes ou invalides.");
    }

    // 2. Process Base Rates (Travco)
    if (data.travcoBaseRates && typeof data.travcoBaseRates === 'object') {
         travcoBaseRatesByDate = new Map(Object.entries(data.travcoBaseRates));
    } else {
         console.warn("SUIVI: Données travcoBaseRates manquantes ou invalides.");
    }

    // 3. Process Tariff Structure [Category, PlanCode]
    const structureData = data.tariffStructure || [];
    if (structureData.length > 0) {
        structureData.forEach(row => {
            if (!row || row.length < 2) return;
            const category = String(row[0] || '').trim();
            const plan = String(row[1] || '').trim();

            if (category && plan) {
                allCategories.add(category);
                allPlans.add(plan);

                if (!categoryToPlansMap.has(category)) {
                    categoryToPlansMap.set(category, new Set());
                    originalPlanOrder[category] = [];
                }
                if (!categoryToPlansMap.get(category).has(plan)) {
                    categoryToPlansMap.get(category).add(plan);
                    originalPlanOrder[category].push(plan);
                }

                if (!planToCategoriesMap.has(plan)) {
                    planToCategoriesMap.set(plan, new Set());
                }
                planToCategoriesMap.get(plan).add(category);
            }
        });
    }
     console.log(`SUIVI: ${allCategories.size} Catégories, ${allPlans.size} Plans trouvés.`);


    // 4. Process Partner Data [PartnerName, PlanCode]
    const partnerData = data.partners || [];
    let missingPlanWarnings = new Set(); // Pour éviter répétition console
    if (partnerData.length > 0) {
        partnerData.forEach(row => {
             if (!row || row.length < 2) return;
             const partnerName = String(row[0] || '').trim();
             const planCode = String(row[1] || '').trim();

             if (partnerName && planCode) {
                 allPartners.add(partnerName);

                 if (!partnerToPlansMap.has(partnerName)) {
                     partnerToPlansMap.set(partnerName, new Set());
                 }

                 if (allPlans.has(planCode)) { // Vérifie si le plan existe dans la structure globale
                    partnerToPlansMap.get(partnerName).add(planCode);
                 } else {
                     if (!missingPlanWarnings.has(planCode)) {
                         console.warn(`SUIVI: Plan '${planCode}' (associé à '${partnerName}') non trouvé dans la structure tarifs globale. Association ignorée.`);
                         missingPlanWarnings.add(planCode);
                     }
                 }
             }
        });
    }
     if (missingPlanWarnings.size > 0) {
         showAlert(`Avertissement: ${missingPlanWarnings.size} plan(s) tarifaire(s) mentionné(s) dans les partenaires n'existent pas dans la structure tarifaire globale. Voir console (F12).`, 'warning', 10000);
     }
    console.log(`SUIVI: ${allPartners.size} Partenaires trouvés.`);
    console.log("SUIVI: Traitement des données terminé.");
}


// --- Fonctions de Mise à Jour des Dropdowns (Adaptées pour Suivi) ---

function populateDropdown(selectElement, optionsSet, defaultText, addAllOption = false, allOptionValue = "", allOptionText = "Tous") {
    if (!selectElement) { console.error(`SUIVI: Dropdown introuvable.`); return; }

    const currentVal = selectElement.value; // Sauvegarde valeur actuelle
    selectElement.innerHTML = ''; // Vide les options
    selectElement.disabled = true; // Désactive pendant remplissage

    // Option par défaut (placeholder)
    const defaultOpt = document.createElement('option');
    defaultOpt.value = "";
    defaultOpt.textContent = defaultText;
    defaultOpt.disabled = true;
    defaultOpt.selected = true; // Sélectionnée par défaut
    selectElement.appendChild(defaultOpt);

    // Option "Tous" si demandée (rare dans la comparaison plan par plan, mais gardé au cas où)
    if (addAllOption) {
        const allOpt = document.createElement('option');
        allOpt.value = allOptionValue;
        allOpt.textContent = allOptionText;
        selectElement.appendChild(allOpt);
    }

    // Tri des options (alphabétique pour partenaires/catégories)
    let sortedOptions = [...optionsSet];
     // Pour les plans, on utilisera l'ordre original ou alpha si pas d'ordre spécifique, le tri sera fait avant l'appel
    if (selectElement.id.includes('partner') || selectElement.id.includes('category')) {
         sortedOptions.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
    } else { // Plans
         // Le tri des plans est géré dans updateRatePlanOptionsSuivi
    }

    // Ajout des options triées (seulement pour les types non plans ici)
    if (!selectElement.id.includes('plan')) {
        sortedOptions.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
    }


    // Ré-sélectionne l'ancienne valeur si elle existe toujours
    if (selectElement.querySelector(`option[value="${currentVal}"]`)) {
        selectElement.value = currentVal;
    } else {
        selectElement.value = ""; // Sinon, sélectionne le placeholder
    }

    // Réactive le select SI il y a des options (ou si c'est le partenaire avec "Tous")
    selectElement.disabled = optionsSet.size === 0 && !addAllOption;
    // Le select Catégorie sera activé/désactivé par le listener du partenaire
}

function updateRoomCategoryOptionsSuivi() {
     const categorySelect = document.getElementById('suivi-room-category');
     if (!categorySelect) return;
     const sortedCategories = [...allCategories].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
     populateDropdown(categorySelect, new Set(sortedCategories), "Sélectionnez une catégorie");
     categorySelect.disabled = allCategories.size === 0;
     if (allCategories.size > 0 && !categorySelect.value) {
          // Tente de sélectionner la catégorie de base par défaut si elle existe
          if (allCategories.has(ABSOLUTE_BASE_CATEGORY_NAME)) {
               categorySelect.value = ABSOLUTE_BASE_CATEGORY_NAME;
          }
     }
      // La sélection d'une catégorie déclenche la mise à jour des plans dans les blocs
     updateAllComparisonPlanOptions();
}


function updateComparisonPlanOptionsSuivi(comparisonBlockElement) {
    const partnerSelect = comparisonBlockElement.querySelector('.partner-select-suivi');
    const planSelect = comparisonBlockElement.querySelector('.plan-select-suivi');
    const helpTextElement = comparisonBlockElement.querySelector('.rate-plan-help-suivi');

    if (!partnerSelect || !planSelect) { console.error("SUIVI: Éléments select partner/plan introuvables dans le bloc."); return; }

    const selectedPartner = partnerSelect.value;
    const selectedCategory = getElementValue('suivi-room-category');

    let availablePlans = new Set();
    let placeholder = "Sélectionnez Plan...";
    let orderSourceCategory = null; // Pour tri

    if (!selectedCategory) {
        placeholder = "Sélectionnez Catégorie d'abord...";
        availablePlans = new Set();
    } else {
        orderSourceCategory = selectedCategory; // Tri basé sur cette catégorie
        const plansForCategory = categoryToPlansMap.get(selectedCategory) || new Set();

        if (!selectedPartner) { // Si un partenaire est sélectionné, filtre par partenaire
            availablePlans = plansForCategory; // Si "Tous Partenaires" est géré ici, ce serait plansForCategory
            // Mais dans ce formulaire, on sélectionne un PARTENAIRE spécifique par bloc
            // Donc si selectedPartner est vide, c'est une erreur de logique ou le placeholder du select partenaire
             placeholder = "Sélectionnez Partenaire d'abord...";
             availablePlans = new Set(); // Pas de partenaire sélectionné -> pas de plans
             orderSourceCategory = null;
        } else { // Partenaire spécifique ET catégorie sélectionnée
            const plansForPartner = partnerToPlansMap.get(selectedPartner) || new Set();
            // Intersection des plans pour la catégorie ET le partenaire
            availablePlans = new Set([...plansForCategory].filter(plan => plansForPartner.has(plan)));
            if (availablePlans.size === 0) {
                placeholder = "Aucun plan pour cette combinaison";
            } else {
                placeholder = "Sélectionnez Plan...";
            }
        }
    }

     // Tri des plans selon l'ordre original de la catégorie source, puis alpha
    let orderedPlans = [];
    if (orderSourceCategory && originalPlanOrder[orderSourceCategory]) {
        orderedPlans = originalPlanOrder[orderSourceCategory].filter(plan => availablePlans.has(plan));
        const remainingPlans = [...availablePlans].filter(plan => !orderedPlans.includes(plan));
        remainingPlans.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
        orderedPlans = [...orderedPlans, ...remainingPlans];
         // console.log(`SUIVI: Tri plans basé sur ordre catégorie '${orderSourceCategory}'.`);
    } else {
        orderedPlans = [...availablePlans].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
         // console.log(`SUIVI: Tri plans en mode fallback (alphabétique).`);
    }


    // Peuplement du dropdown du plan
    const currentVal = planSelect.value;
    planSelect.innerHTML = ''; // Vide

    const defaultOpt = document.createElement('option');
    defaultOpt.value = "";
    defaultOpt.textContent = placeholder;
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    planSelect.appendChild(defaultOpt);

    orderedPlans.forEach(planCode => {
        const option = document.createElement('option');
        option.value = planCode;
        option.textContent = planCode; // Affiche le code
        planSelect.appendChild(option);
    });

    // Restaure sélection
    if (planSelect.querySelector(`option[value="${currentVal}"]`)) {
        planSelect.value = currentVal;
    } else {
        planSelect.value = "";
    }

    // Active/désactive le select plan
    planSelect.disabled = orderedPlans.length === 0;

    // Met à jour aide (initiale ou après sélection)
    updateRatePlanHelpSuivi(planSelect.value, helpTextElement);

    // Ajoute le listener si pas déjà présent
    if (planSelect.dataset.listenerAttached !== 'true') {
        planSelect.addEventListener('change', (e) => {
             updateRatePlanHelpSuivi(e.target.value, helpTextElement);
        });
        planSelect.dataset.listenerAttached = 'true';
    }

}

function updateAllComparisonPlanOptions() {
     // Appelle updateComparisonPlanOptionsSuivi pour chaque bloc partenaire/plan
     const comparisonBlocks = document.querySelectorAll('#partnerComparisonsContainer .partner-comparison-block');
     comparisonBlocks.forEach(block => {
          updateComparisonPlanOptionsSuivi(block);
     });
}


function updateRatePlanHelpSuivi(planCode, helpTextElement) {
    if (helpTextElement) {
        const description = ratePlanDescriptions[planCode];
        helpTextElement.textContent = description || (planCode ? '' : ''); // Affiche description ou rien
    }
}


// --- Fonctions de Calcul des Tarifs (Copiées de script.js) ---

/**
 * Trouve le tarif de base OTA (Double Classique) pour une date donnée.
 * @param {Date} requestedDate Objet Date UTC.
 * @returns {number|null} Le tarif ou null si non trouvé/invalide.
 */
function findAbsoluteOtaBaseRate(requestedDate) {
    if (!(requestedDate instanceof Date) || isNaN(requestedDate.getTime())) { return null; }
    const requestedDateStr = formatDateYYYYMMDD(requestedDate);
    if (!requestedDateStr || !baseRatesByDate.has(requestedDateStr)) {
        return null; // Pas de date ou pas de tarif trouvé pour cette date
    }
    const rate = baseRatesByDate.get(requestedDateStr);
    // Vérifie si la valeur est un nombre valide et positif
    if (rate !== null && typeof rate === 'number' && !isNaN(rate) && rate >= 0) {
         return rate;
    } else {
         console.warn(`SUIVI: findAbsoluteOtaBaseRate: Valeur invalide (${rate}) pour ${requestedDateStr} dans baseRatesByDate.`);
         return null; // Valeur invalide
    }
}

/**
 * Trouve le tarif de base Travco (Double Classique) pour une date donnée.
 * @param {Date} requestedDate Objet Date UTC.
 * @returns {number|null} Le tarif ou null si non trouvé/invalide.
 */
function findAbsoluteTravcoBaseRate(requestedDate) {
    if (!(requestedDate instanceof Date) || isNaN(requestedDate.getTime())) { return null; }
    const requestedDateStr = formatDateYYYYMMDD(requestedDate);
    if (!requestedDateStr || !travcoBaseRatesByDate.has(requestedDateStr)) {
        return null;
    }
    const rate = travcoBaseRatesByDate.get(requestedDateStr);
    if (rate !== null && typeof rate === 'number' && !isNaN(rate) && rate >= 0) {
         return rate;
    } else {
         console.warn(`SUIVI: findAbsoluteTravcoBaseRate: Valeur invalide (${rate}) pour ${requestedDateStr} dans travcoBaseRatesByDate.`);
         return null;
    }
}

/**
 * Calcule le tarif journalier final pour une catégorie et un plan donnés,
 * en fonction du tarif de base absolu (OTA ou Travco) du jour.
 * COPIÉE DE script.js.
 * @param {Date} date La date UTC pour laquelle calculer le tarif.
 * @param {string} requestedCategory La catégorie de chambre demandée.
 * @param {string} requestedPlan Le plan tarifaire demandé.
 * @returns {number|null} Le tarif journalier calculé et arrondi, ou null en cas d'erreur critique (ex: tarif base manquant).
 */
function calculateDailyRate(date, requestedCategory, requestedPlan) {
    // --- Logique Spécifique TRAVCO ---
    if (requestedPlan && requestedPlan.startsWith('TRAVCO-')) {
        const travcoBaseRateDoubleClassique = findAbsoluteTravcoBaseRate(date);

        if (travcoBaseRateDoubleClassique === null) {
             console.warn(`SUIVI: Tarif base TRAVCO (${TRAVCO_BASE_PLAN} / ${TRAVCO_BASE_CATEGORY}) manquant pour ${formatDateYYYYMMDD(date)}. Impossible de calculer.`);
             return null; // Important de retourner null si base manque
        }

        let travcoFlexRateForCategory = travcoBaseRateDoubleClassique;

        // Appliquer les suppléments fixes par catégorie (selon règles fournies dans script.js)
        switch (requestedCategory) {
            case 'Double Classique': travcoFlexRateForCategory = travcoBaseRateDoubleClassique; break;
            case 'Double Single Use Classique': travcoFlexRateForCategory = travcoBaseRateDoubleClassique - 10; break;
            case 'Twin Classique': travcoFlexRateForCategory = travcoBaseRateDoubleClassique + 10; break;
            case 'Double Classique Terrasse': travcoFlexRateForCategory = travcoBaseRateDoubleClassique + 50; break;
            case 'Double Deluxe': travcoFlexRateForCategory = travcoBaseRateDoubleClassique + 50; break;
            case 'Twin Deluxe': travcoFlexRateForCategory = travcoBaseRateDoubleClassique + 60; break;
            case 'Double Deluxe Terrasse': travcoFlexRateForCategory = travcoBaseRateDoubleClassique + 100; break;
            case 'Deux Chambres Adjacentes 4 personnes': travcoFlexRateForCategory = (travcoBaseRateDoubleClassique * 2) + 10; break;
            default:
                console.warn(`SUIVI: Catégorie inconnue pour TRAVCO: '${requestedCategory}'. Utilisation tarif Double Classique.`);
                travcoFlexRateForCategory = travcoBaseRateDoubleClassique;
                break;
        }

        // Appliquer la règle NANR si nécessaire (selon règles fournies)
        let finalTravcoRate = travcoFlexRateForCategory;
        if (requestedPlan.includes('-NANR-')) { // Gère TRAVCO-BB-NANR-NET
            finalTravcoRate = travcoFlexRateForCategory * 0.95;
        }

        return Math.round(finalTravcoRate * 100) / 100; // Arrondi final

    } else {
        // --- Logique Standard (Non-Travco) ---
        const absoluteOtaBaseRateForDay = findAbsoluteOtaBaseRate(date);

        if (absoluteOtaBaseRateForDay === null) {
            console.warn(`SUIVI: Tarif base OTA (${BASE_RATE_PLAN_NAME} / ${ABSOLUTE_BASE_CATEGORY_NAME}) manquant pour ${formatDateYYYYMMDD(date)}. Impossible de calculer.`);
            return null; // Important de retourner null si base manque
        }
        const baseRateDoubleClassique = parseFloat(absoluteOtaBaseRateForDay);

        // Calculer le tarif OTA-RO-FLEX pour la catégorie demandée (selon règles fournies)
        let categoryOtaRoFlexRate = baseRateDoubleClassique;
        switch (requestedCategory) {
            case 'Double Classique': case 'Double Single Use Classique': categoryOtaRoFlexRate = baseRateDoubleClassique; break;
            case 'Twin Classique': categoryOtaRoFlexRate = baseRateDoubleClassique + 10; break;
            case 'Double Classique Terrasse': categoryOtaRoFlexRate = baseRateDoubleClassique + 50; break;
            case 'Double Deluxe': categoryOtaRoFlexRate = baseRateDoubleClassique + 70; break; // Vérifier si 50 ou 70
            case 'Twin Deluxe': categoryOtaRoFlexRate = baseRateDoubleClassique + 80; break; // Vérifier si 60 ou 80
            case 'Double Deluxe Terrasse': categoryOtaRoFlexRate = baseRateDoubleClassique + 120; break; // Vérifier si 100 ou 120
            case 'Deux Chambres Adjacentes 4 personnes': categoryOtaRoFlexRate = (baseRateDoubleClassique * 2) + 60; break; // Vérifier si 10 ou 60
            default:
                console.warn(`SUIVI: Catégorie standard inconnue: '${requestedCategory}'. Utilisation tarif Double Classique.`);
                categoryOtaRoFlexRate = baseRateDoubleClassique;
                break;
        }
        categoryOtaRoFlexRate = Math.round(categoryOtaRoFlexRate * 100) / 100; // Arrondi intermédiaire

        // Appliquer les formules spécifiques au plan tarifaire demandé (selon règles fournies)
        let finalRate = categoryOtaRoFlexRate; // Base de départ
        const plan = requestedPlan;

        // Variables intermédiaires basées sur categoryOtaRoFlexRate (pour TO/HB/HOTUSA etc.)
        const toRoNet = categoryOtaRoFlexRate * 0.83;
        const toRoNanrNet = (categoryOtaRoFlexRate * 0.95) * 0.83;
        const hbRoBrut = toRoNet * 1.252;
        const toRoNanrBrut = hbRoBrut * 0.95; // Calculé à partir de HB Brut Flex

        switch (plan) {
            // --- Plans basés sur OTA ---
            case 'OTA-RO-FLEX': finalRate = categoryOtaRoFlexRate; break;
            case 'OTA-RO-NANR': finalRate = categoryOtaRoFlexRate * 0.95; break;
            case 'OTA-BB-FLEX-1P': finalRate = categoryOtaRoFlexRate + 15; break;
            case 'OTA-BB-FLEX-2P': finalRate = categoryOtaRoFlexRate + 30; break;
            case 'OTA-BB-FLEX-4P': finalRate = categoryOtaRoFlexRate + 60; break;
            case 'OTA-BB-NANR-1P': finalRate = (categoryOtaRoFlexRate * 0.95) + 15; break;
            case 'OTA-BB-NANR-2P': finalRate = (categoryOtaRoFlexRate * 0.95) + 30; break;
            case 'OTA-BB-NANR-4P': finalRate = (categoryOtaRoFlexRate * 0.95) + 60; break;

            // --- Plans MOBILE (-10% sur OTA correspondant) ---
            case 'MOBILE-RO-FLEX': finalRate = categoryOtaRoFlexRate * 0.90; break;
            case 'MOBILE-RO-NANR': finalRate = (categoryOtaRoFlexRate * 0.95) * 0.90; break;
            case 'MOBILE-BB-FLEX-1P': case 'MOBILE-BB-FLEX-1-P': finalRate = (categoryOtaRoFlexRate + 15) * 0.90; break;
            case 'MOBILE-BB-FLEX-2P': finalRate = (categoryOtaRoFlexRate + 30) * 0.90; break;
            case 'MOBILE-BB-FLEX-4P': finalRate = (categoryOtaRoFlexRate + 60) * 0.90; break;
            case 'MOBILE-BB-NANR-1P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 15) * 0.90; break;
            case 'MOBILE-BB-NANR-2P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 30) * 0.90; break;
            case 'MOBILE-BB-NANR-4P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 60) * 0.90; break;

            // --- Plans VIP (-15% sur OTA correspondant) ---
            case 'VIP-RATE-FLEX': case 'VIP-RO-FLEX': finalRate = categoryOtaRoFlexRate * 0.85; break;
            case 'VIP-RO-NANR': finalRate = (categoryOtaRoFlexRate * 0.95) * 0.85; break;
            case 'VIP-BB-FLEX-1P': finalRate = (categoryOtaRoFlexRate + 15) * 0.85; break;
            case 'VIP-BB-FLEX-2P': finalRate = (categoryOtaRoFlexRate + 30) * 0.85; break;
            case 'VIP-BB-FLEX-4P': finalRate = (categoryOtaRoFlexRate + 60) * 0.85; break;
            case 'VIP-BB-NANR-1P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 15) * 0.85; break;
            case 'VIP-BB-NANR-2P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 30) * 0.85; break;
            case 'VIP-BB-NANR-4P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 60) * 0.85; break;

            // --- Plans TO/HB ---
            case 'TO-RO-FLEX-NET': finalRate = toRoNet; break;
            case 'TO-RO-NANR-NET': finalRate = toRoNanrNet; break;
            case 'HB-RO-FLEX-BRUT': finalRate = hbRoBrut; break;
            case 'TO-RO-NANR-BRUT': finalRate = toRoNanrBrut; break; // basé sur hbRoBrut * 0.95

            case 'TO-BB-FLEX-NET-1P': finalRate = (categoryOtaRoFlexRate + 15) * 0.83; break;
            case 'TO-BB-FLEX-NET-2P': finalRate = (categoryOtaRoFlexRate + 30) * 0.83; break;
            case 'TO-BB-FLEX-NET-4P': finalRate = (categoryOtaRoFlexRate + 60) * 0.83; break;
            case 'TO-BB-NANR-NET-1P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 15) * 0.83; break;
            case 'TO-BB-NANR-NET-2P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 30) * 0.83; break;
            case 'TO-BB-NANR-NET-4P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 60) * 0.83; break;

            case 'TO-BB-FLEX-BRUT-1P': finalRate = ((categoryOtaRoFlexRate + 15) * 0.83) * 1.252; break;
            case 'TO-BB-FLEX-BRUT-2P': finalRate = ((categoryOtaRoFlexRate + 30) * 0.83) * 1.252; break;
            case 'TO-BB-FLEX-BRUT-4P': finalRate = ((categoryOtaRoFlexRate + 60) * 0.83) * 1.252; break;
            case 'TO-BB-NANR-BRUT-1P': finalRate = (((categoryOtaRoFlexRate * 0.95) + 15) * 0.83) * 1.252; break;
            case 'TO-BB-NANR-BRUT-2P': finalRate = (((categoryOtaRoFlexRate * 0.95) + 30) * 0.83) * 1.252; break;
            case 'TO-BB-NANR-BRUT-4P': finalRate = (((categoryOtaRoFlexRate * 0.95) + 60) * 0.83) * 1.252; break;

            // --- Plans HOTUSA (TO NET * 1.31) ---
            case 'HOTUSA-RO-FLEX': finalRate = toRoNet * 1.31; break;
            case 'HOTUSA-RO-NANR': finalRate = toRoNanrNet * 1.31; break;
            case 'HOTUSA-BB-FLEX-1P': finalRate = ((categoryOtaRoFlexRate + 15) * 0.83) * 1.31; break;
            case 'HOTUSA-BB-FLEX-2P': finalRate = ((categoryOtaRoFlexRate + 30) * 0.83) * 1.31; break;
            case 'HOTUSA-BB-FLEX-4P': finalRate = ((categoryOtaRoFlexRate + 60) * 0.83) * 1.31; break;
            case 'HOTUSA-BB-NANR-1P': finalRate = (((categoryOtaRoFlexRate * 0.95) + 15) * 0.83) * 1.31; break;
            case 'HOTUSA-BB-NANR-2P': finalRate = (((categoryOtaRoFlexRate * 0.95) + 30) * 0.83) * 1.31; break;
            case 'HOTUSA-BB-NANR-4P': finalRate = (((categoryOtaRoFlexRate * 0.95) + 60) * 0.83) * 1.31; break;

            // --- Plans FB CORPO (Comme OTA) ---
            case 'FB-CORPO-RO-FLEX': finalRate = categoryOtaRoFlexRate; break;
            case 'FB-CORPO-BB-FLEX-1P': finalRate = categoryOtaRoFlexRate + 15; break;
            case 'FB-CORPO-BB-FLEX-2P': finalRate = categoryOtaRoFlexRate + 30; break;
            case 'FB-CORPO-BB-FLEX-4P': finalRate = categoryOtaRoFlexRate + 60; break;

            // --- Plans GDS/Autres ---
            case 'AMEX-GBT': case 'AMEX-GBT - AMEX GBT': finalRate = categoryOtaRoFlexRate * 0.85; break; // Comme VIP RO FLEX
            case 'CWT-BB-FLEX': finalRate = (categoryOtaRoFlexRate * 0.95) + 15; break; // Comme OTA BB NANR 1P

             // --- Plans PKG EXP (-10% sur OTA, comme MOBILE) ---
            case 'PKG-EXP-RO-FLEX': finalRate = categoryOtaRoFlexRate * 0.90; break;
            case 'PKG-EXP-RO-NANR': finalRate = (categoryOtaRoFlexRate * 0.95) * 0.90; break;
            case 'PKG-EXP-BB-FLEX-1P': finalRate = (categoryOtaRoFlexRate + 15) * 0.90; break;
            case 'PKG-EXP-BB-FLEX-2P': finalRate = (categoryOtaRoFlexRate + 30) * 0.90; break;
            case 'PKG-EXP-BB-FLEX-4P': finalRate = (categoryOtaRoFlexRate + 60) * 0.90; break;
            case 'PKG-EXP-BB-NANR-1P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 15) * 0.90; break;
            case 'PKG-EXP-BB-NANR-2P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 30) * 0.90; break;
            case 'PKG-EXP-NANR-4P': finalRate = ((categoryOtaRoFlexRate * 0.95) + 60) * 0.90; break; // Correction: should be PKG-EXP-BB-NANR-4P?

             // --- Plans PROMO TO (-10% sur TO NET) ---
            case 'PROMO-TO-RO-FLEX': finalRate = toRoNet * 0.9; break;
            case 'PROMO-TO-RO-NANR': finalRate = toRoNanrNet * 0.9; break;
            case 'PROMO-TO-BB-1-FLEX': case 'PROMO-TO-BB-1P-FLEX': finalRate = ((categoryOtaRoFlexRate + 15) * 0.83) * 0.9; break;
            case 'PROMO-TO-BB-1P-NANR': finalRate = (((categoryOtaRoFlexRate * 0.95) + 15) * 0.83) * 0.9; break;
            case 'PROMO-TO-BB-2P-FLEX': finalRate = ((categoryOtaRoFlexRate + 30) * 0.83) * 0.9; break;
            case 'PROMO-TO-BB-2P-NANR': finalRate = (((categoryOtaRoFlexRate * 0.95) + 30) * 0.83) * 0.9; break;
            case 'PROMO-TO-BB-4P-FLEX': finalRate = ((categoryOtaRoFlexRate + 60) * 0.83) * 0.9; break;
            case 'PROMO-TO-BB-4P-NANR': finalRate = (((categoryOtaRoFlexRate * 0.95) + 60) * 0.83) * 0.9; break;

             // --- Plans PROMO HB (-10% sur HB BRUT) ---
            case 'PROMO-HB-RO-FLEX': finalRate = hbRoBrut * 0.9; break;
            case 'PROMO-HB-RO-NANR': finalRate = toRoNanrBrut * 0.9; break; // Basé sur TO RO NANR Brut * 0.9
            case 'PROMO-HB-BB-FLEX-1P': finalRate = (((categoryOtaRoFlexRate + 15) * 0.83) * 1.252) * 0.9; break;
            case 'PROMO-HB-BB-FLEX-2P': finalRate = (((categoryOtaRoFlexRate + 30) * 0.83) * 1.252) * 0.9; break;
            case 'PROMO-HB-BB-FLEX-4P': finalRate = (((categoryOtaRoFlexRate + 60) * 0.83) * 1.252) * 0.9; break;
            case 'PROMO-HB-BB-NANR-1P': finalRate = ((((categoryOtaRoFlexRate * 0.95) + 15) * 0.83) * 1.252) * 0.9; break;
            case 'PROMO-HB-BB-NANR-2P': finalRate = ((((categoryOtaRoFlexRate * 0.95) + 30) * 0.83) * 1.252) * 0.9; break;
            case 'PROMO-HB-BB-NANR-4P': finalRate = ((((categoryOtaRoFlexRate * 0.95) + 60) * 0.83) * 1.252) * 0.9; break;

            default:
                console.warn(`SUIVI: Plan tarifaire standard inconnu ou non géré: '${plan}'. Utilisation du tarif OTA-RO-FLEX de la catégorie (${categoryOtaRoFlexRate}).`);
                finalRate = categoryOtaRoFlexRate; // Fallback
                break;
        }

        // Arrondi final
        return Math.round(finalRate * 100) / 100;
    } // Fin du else (Logique Standard)
}


// ==========================================================================
// ==               LOGIQUE INTERFACE DYNAMIQUE & CHART.JS               ==
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log("SUIVI: DOM Chargé. Initialisation de l'application de comparaison...");
    // Initialise les dropdowns et attache les listeners après chargement des données
    await initializeSuiviApp();
});

async function initializeSuiviApp() {
    disableSuiviForm(); // Désactive le formulaire pendant le chargement des données
    try {
        await fetchAndProcessSuiviData(); // Charge et traite les données

        console.log("SUIVI: Données chargées et traitées. Activation interface.");
        initializeSuiviForm(); // Peuple les dropdowns et set les dates par défaut
        setupSuiviEventListeners(); // Attache les listeners du formulaire
        initializeChart(); // Initialise Chart.js (sans données au début)

        enableSuiviForm(); // Active le formulaire

    } catch (error) {
        console.error("SUIVI: Échec de l'initialisation de l'application de comparaison.");
        // Message d'erreur déjà affiché par fetchAndProcessSuiviData
    }
}

function initializeSuiviForm() {
     console.log("SUIVI: Initialisation du formulaire de comparaison...");
    // Set dates par défaut
    try {
        const today = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setUTCDate(today.getUTCDate() + 7);

        const todayStr = formatDateYYYYMMDD(today);
        const oneWeekLaterStr = formatDateYYYYMMDD(oneWeekLater);

        const dateDebutInput = document.getElementById('suivi-dateDebut');
        const dateFinInput = document.getElementById('suivi-dateFin');

        if (dateDebutInput) dateDebutInput.value = todayStr;
        if (dateFinInput) dateFinInput.value = oneWeekLaterStr;

    } catch (e) { console.error("SUIVI: Erreur mise à jour date défaut:", e); }

    // Peuple la catégorie de chambre
    updateRoomCategoryOptionsSuivi();

    // Ajoute le premier bloc de comparaison (Partenaire/Plan 1)
    addPartnerComparisonBlock();
     // Ajoute le deuxième bloc de comparaison (Partenaire/Plan 2)
    addPartnerComparisonBlock();
     // Cache le bouton Ajouter si 2 blocs sont ajoutés initialement
     if (comparisonBlockCounter >= 2) {
          document.getElementById('suivi-addPartnerBtn').classList.add('hidden');
     }
}


function setupSuiviEventListeners() {
    console.log("SUIVI: Attachement des listeners du formulaire de comparaison...");

     // Listener sur le formulaire principal (soumission)
    document.getElementById('suiviForm')?.addEventListener('submit', handleSuiviFormSubmit);

    // Listener sur le bouton "Ajouter un Plan"
    document.getElementById('suivi-addPartnerBtn')?.addEventListener('click', () => {
         if (comparisonBlockCounter < 4) { // Limite à 4 comparaisons par exemple
             addPartnerComparisonBlock();
             if (comparisonBlockCounter >= 4) {
                 document.getElementById('suivi-addPartnerBtn').classList.add('hidden');
             }
         }
     });

     // Listener sur le sélecteur de Catégorie (met à jour les plans dans tous les blocs)
     document.getElementById('suivi-room-category')?.addEventListener('change', () => {
         console.log("SUIVI: Catégorie changée, mise à jour des plans dans tous les blocs...");
         updateAllComparisonPlanOptions();
         // Réinitialise les plans sélectionnés dans les blocs existants
          document.querySelectorAll('.plan-select-suivi').forEach(select => {
               select.value = "";
               updateRatePlanHelpSuivi(select.value, select.closest('.partner-comparison-block').querySelector('.rate-plan-help-suivi'));
          });
     });

      // Listener sur le bouton "Actualiser"
     document.getElementById('refreshBtn')?.addEventListener('click', resetSuiviForm);


}


function addPartnerComparisonBlock() {
     comparisonBlockCounter++;
     const container = document.getElementById('partnerComparisonsContainer');
     if (!container) { console.error("SUIVI: Conteneur des blocs de comparaison introuvable."); return; }

     const blockId = `suivi-comparison-block-${comparisonBlockCounter}`;
     const partnerSelectId = `suivi-partner-${comparisonBlockCounter}`;
     const planSelectId = `suivi-plan-${comparisonBlockCounter}`;
     const helpTextId = `suivi-plan-help-${comparisonBlockCounter}`;

     const partnerBlockDiv = document.createElement('div');
     partnerBlockDiv.id = blockId;
     partnerBlockDiv.className = 'partner-comparison-block space-y-3'; // Utilise la classe CSS

     partnerBlockDiv.innerHTML = `
         <div class="flex justify-between items-center mb-2">
             <h5 class="font-medium text-gray-300">Plan de Comparaison ${comparisonBlockCounter}</h5>
             ${comparisonBlockCounter > 1 ? `<button type="button" class="remove-btn text-red-400 hover:text-red-300" data-block-id="${blockId}" aria-label="Supprimer"><i class="fas fa-times"></i></button>` : ''}
         </div>
         <div>
             <label for="${partnerSelectId}" class="label-style">Partenaire</label>
             <select id="${partnerSelectId}" class="partner-select-suivi input-style w-full" required disabled>
                 <option value="">Chargement...</option>
             </select>
         </div>
         <div>
             <label for="${planSelectId}" class="label-style">Plan Tarifaire</label>
             <select id="${planSelectId}" class="plan-select-suivi input-style w-full" required disabled>
                 <option value="">Sélectionnez Catégorie/Partenaire...</option>
             </select>
             <div id="${helpTextId}" class="form-text-style rate-info rate-plan-help-suivi"></div>
         </div>
     `;

     container.appendChild(partnerBlockDiv);

     const partnerSelect = partnerBlockDiv.querySelector(`#${partnerSelectId}`);
     const planSelect = partnerBlockDiv.querySelector(`#${planSelectId}`);

      // Peuple le select partenaire
     const sortedPartners = [...allPartners].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
     populateDropdown(partnerSelect, new Set(sortedPartners), "Sélectionner un partenaire", true, "", "Tous les partenaires"); // Option "Tous" pour partenaire? Non, on choisit un partenaire spécifique. Retirons l'option Tous.
     populateDropdown(partnerSelect, new Set(sortedPartners), "Sélectionner un partenaire");


     // Attache listeners au nouveau bloc
     partnerSelect.addEventListener('change', () => {
          console.log(`SUIVI: Partenaire changé dans bloc ${comparisonBlockCounter}: ${partnerSelect.value}`);
          // Met à jour les options de plan pour CE bloc
          updateComparisonPlanOptionsSuivi(partnerBlockDiv);
          // Réinitialise la sélection du plan
          planSelect.value = "";
          updateRatePlanHelpSuivi(planSelect.value, helpTextElement);
          // Active le select plan si un partenaire est sélectionné
           planSelect.disabled = !partnerSelect.value;
     });

     // Listener pour le bouton supprimer (si présent)
     const removeBtn = partnerBlockDiv.querySelector('.remove-btn');
     if (removeBtn) {
         removeBtn.addEventListener('click', () => {
             console.log(`SUIVI: Suppression du bloc ${blockId}`);
             container.removeChild(partnerBlockDiv);
             comparisonBlockCounter--; // Décrémente le compteur
             // Rend le bouton Ajouter visible si on repasse en dessous de la limite
             if (comparisonBlockCounter < 4) {
                  document.getElementById('suivi-addPartnerBtn').classList.remove('hidden');
             }
             // Re-générer la comparaison si des résultats sont affichés? Non, laisser l'utilisateur cliquer sur Générer.
         });
     }

     // Mettre à jour les options de plan initiales (dépend de la catégorie déjà sélectionnée)
     updateComparisonPlanOptionsSuivi(partnerBlockDiv);

      // Assure que le bouton Ajouter est visible si on est en dessous de la limite après ajout
     if (comparisonBlockCounter < 4) {
         document.getElementById('suivi-addPartnerBtn').classList.remove('hidden');
     }

}


function disableSuiviForm() {
    const form = document.getElementById('suiviForm');
    if (form) {
        form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    }
     document.getElementById('suivi-addPartnerBtn')?.setAttribute('disabled', 'true'); // Désactive aussi le bouton ajouter
     document.getElementById('refreshBtn')?.setAttribute('disabled', 'true'); // Désactive aussi le bouton actualiser
     document.getElementById('suivi-result-container')?.classList.add('hidden'); // Cache les résultats précédents
}

function enableSuiviForm() {
    const form = document.getElementById('suiviForm');
    if (form) {
        form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
    }
     document.getElementById('suivi-addPartnerBtn')?.removeAttribute('disabled');
     document.getElementById('refreshBtn')?.removeAttribute('disabled');
     // Les selects partenaires/plans/catégories seront activés/désactivés par leur logique de peuplement et de cascade
}


async function handleSuiviFormSubmit(event) {
     event.preventDefault();
     console.log("SUIVI: Formulaire soumis.");

     const resultContainer = document.getElementById('suivi-result-container');
     resultContainer.classList.add('hidden'); // Cache anciens résultats
     showAlert("Génération de la comparaison...", "info", 0); // Message de traitement

     // Récupérer les données du formulaire
     const dateDebut = getElementValue('suivi-dateDebut');
     const dateFin = getElementValue('suivi-dateFin');
     const categorie = getElementValue('suivi-room-category');
     const chartType = getElementValue('suivi-chartType');

     const comparisonItems = []; // [{ partner: "...", plan: "..." }, ...]
     const comparisonBlocks = document.querySelectorAll('#partnerComparisonsContainer .partner-comparison-block');

     comparisonBlocks.forEach(block => {
         const partnerSelect = block.querySelector('.partner-select-suivi');
         const planSelect = block.querySelector('.plan-select-suivi');
         if (partnerSelect?.value && planSelect?.value) {
             comparisonItems.push({
                 partner: partnerSelect.value,
                 plan: planSelect.value
             });
         }
     });

     // Validation basique
     if (!dateDebut || !dateFin || !categorie) {
         showAlert('Veuillez sélectionner une période et une catégorie.', 'warning');
         return;
     }
     if (comparisonItems.length < 2) {
         showAlert('Veuillez ajouter et sélectionner au moins deux plans à comparer.', 'warning');
         return;
     }

     // Vérifier que tous les plans sont différents
     const selectedPlanKeys = comparisonItems.map(item => `${item.partner}-${item.plan}`);
     const uniquePlanKeys = new Set(selectedPlanKeys);
     if (uniquePlanKeys.size !== selectedPlanKeys.length) {
          showAlert('Veuillez sélectionner des combinaisons Partenaire/Plan uniques pour chaque élément de comparaison.', 'warning');
          return;
     }


     let stayDates;
     try {
          // Calcule le nombre de nuits entre les deux dates (inclusif de date de fin - date de début)
          const startDate = new Date(dateDebut + 'T00:00:00Z');
          const endDate = new Date(dateFin + 'T00:00:00Z');
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) throw new Error("Dates invalides");
          if (startDate > endDate) throw new Error("La date de fin doit être après la date de début.");

          const diffTime = Math.abs(endDate - startDate);
          // Ajoute 1 jour car la comparaison inclut les tarifs du jour de début AU jour de fin
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          // Utilise generateStayDates mais avec le nombre de jours calculé
          stayDates = generateStayDates(dateDebut, diffDays);
          if (stayDates.length === 0) throw new Error("Aucune date dans la période sélectionnée.");

     } catch (e) {
         showAlert(`Erreur dates: ${e.message}`, 'error');
         return;
     }

     // Assure que les données sont chargées (devrait l'être à l'initialisation, mais sécurité)
     if (baseRatesByDate.size === 0 && travcoBaseRatesByDate.size === 0) {
          showAlert("Données de tarifs indisponibles. Veuillez recharger la page.", "error");
          return;
     }

     // --- Calcul des Tarifs pour la Période ---
     const comparisonData = []; // [{ date: Date, dateStr: '...', rates: [{partner, plan, rate}, ...] }, ...]
     let missingRateWarning = false;
     let firstMissingDate = null;

     for (const date of stayDates) {
         const dateStr = formatDateLocale(date);
         const dailyRates = { date: date, dateStr: dateStr, rates: [] };

         comparisonItems.forEach(item => {
             const dailyRate = calculateDailyRate(date, categorie, item.plan); // Utilise la logique copiée

             if (dailyRate === null) {
                 missingRateWarning = true;
                 if (!firstMissingDate) firstMissingDate = dateStr;
                 dailyRates.rates.push({ ...item, rate: null }); // Stocke null si calcul échoue
             } else {
                 dailyRates.rates.push({ ...item, rate: dailyRate });
             }
         });
         comparisonData.push(dailyRates);
     }

     if (missingRateWarning) {
          showAlert(`Attention: Tarif base manquant pour certaines dates (à partir du ${firstMissingDate}). Les tarifs pour ces jours sont affichés comme N/A.`, "warning", 10000);
     }

      // Cacher le message "Génération..." une fois les calculs terminés
     const processingMessage = document.querySelector('#suivi-alertContainer .alert-info');
     if (processingMessage) { processingMessage.remove(); }


     // --- Génération et Affichage des Résultats ---
     if (comparisonData.length > 0) {
         generateChart(comparisonData, chartType, comparisonItems); // Génère le graphique
         updateComparisonTable(comparisonData, comparisonItems); // Met à jour le tableau
         updateDifferenceAnalysis(comparisonData, comparisonItems, dateDebut, dateFin, categorie); // Met à jour l'analyse

         resultContainer.classList.remove('hidden'); // Affiche la section résultats
          resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll vers les résultats
         showAlert('Comparaison générée avec succès.', 'success', 5000);

     } else {
         showAlert("Aucune donnée générée pour la comparaison.", "warning");
     }
}


function generateChart(data, chartType, comparisonItems) {
     const ctx = document.getElementById('tarifsChart')?.getContext('2d');
     if (!ctx) { console.error("SUIVI: Canvas pour graphique introuvable."); return; }

     // Détruire l'ancien graphique s'il existe
     if (tarifsChart) {
         tarifsChart.destroy();
     }

     const labels = data.map(day => day.dateStr);
     const datasets = comparisonItems.map((item, index) => {
         const rates = data.map(day => {
              const rateEntry = day.rates.find(r => r.partner === item.partner && r.plan === item.plan);
              return rateEntry ? rateEntry.rate : null; // Utilise null pour les jours sans tarif
         });
         const color = getDatasetColor(index); // Utilise une fonction pour les couleurs

         return {
             label: `${item.partner} (${item.plan})`,
             data: rates,
             borderColor: color,
             backgroundColor: chartType === 'area' ? color + '40' : color, // Couleur transparente pour l'aire
             borderWidth: 2,
             tension: chartType === 'line' || chartType === 'area' ? 0.1 : 0, // Courbe pour ligne/aire
             fill: chartType === 'area' ? 'origin' : false, // Remplir sous la courbe pour l'aire
             pointRadius: 3, // Taille des points
             pointHoverRadius: 5,
             spanGaps: true // Relier les points même s'il y a des données nulles entre eux
         };
     });

     tarifsChart = new Chart(ctx, {
         type: chartType === 'area' ? 'line' : chartType, // 'area' est un type de ligne avec remplissage
         data: { labels, datasets },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                 legend: {
                     position: 'top',
                     labels: { color: '#e2e8f0', font: { size: 14 } }
                 },
                 tooltip: {
                     mode: 'index',
                     intersect: false,
                     backgroundColor: 'rgba(30, 41, 59, 0.9)', // darker-charcoal semi-transparent
                     titleColor: '#f97316', // vibrant-orange
                     bodyColor: '#e2e8f0', // slate-200
                     borderColor: '#4a5568', // medium-charcoal
                     borderWidth: 1,
                     caretPadding: 10,
                     callbacks: {
                          label: context => {
                               const label = context.dataset.label || '';
                               if (context.parsed.y !== null) {
                                    return `${label}: ${context.parsed.y.toFixed(2)} €`;
                               }
                               return `${label}: N/A`;
                          },
                          title: context => context[0].label // Affiche la date comme titre
                     }
                 }
             },
             scales: {
                 x: {
                     grid: { color: '#4a5568' }, // medium-charcoal grid lines
                     ticks: { color: '#94a3b8' } // slate-400 tick labels
                 },
                 y: {
                     grid: { color: '#4a5568' },
                     ticks: {
                         color: '#94a3b8',
                         callback: value => {
                             if (value === null) return 'N/A';
                             return `${value} €`;
                         }
                     },
                     beginAtZero: true // Commence l'axe Y à zéro
                 }
             }
         }
     });
 }


function updateComparisonTable(data, comparisonItems) {
     const comparisonDiv = document.getElementById('suivi-comparisonTable');
     if (!comparisonDiv) { console.error("SUIVI: Élément #suivi-comparisonTable introuvable."); return; }

     // Générer les en-têtes du tableau
     let headerCells = comparisonItems.map(item => `<th class="px-4 py-3 text-left">${item.partner} (${item.plan})</th>`).join('');

     // Générer les lignes du tableau
     let rows = data.map(day => {
         // Trouver le min/max pour ce jour parmi les tarifs disponibles (non null)
         const validRates = day.rates.map(r => r.rate).filter(rate => rate !== null);
         const minRate = validRates.length > 0 ? Math.min(...validRates) : null;
         const maxRate = validRates.length > 0 ? Math.max(...validRates) : null;

         let rowCells = day.rates.map(rateInfo => {
             let cellClass = 'px-4 py-3 text-right font-mono';
             let cellContent = rateInfo.rate !== null ? `${rateInfo.rate.toFixed(2)} €` : '<span class="italic text-xs text-gray-500">N/A</span>';

             if (rateInfo.rate !== null) {
                 if (minRate !== null && rateInfo.rate === minRate && minRate !== maxRate) { // minRate !== maxRate pour éviter de marquer tout en vert si tous les tarifs sont identiques
                     cellClass += ' text-accent-green font-semibold';
                 } else if (maxRate !== null && rateInfo.rate === maxRate && minRate !== maxRate) {
                     cellClass += ' text-accent-red font-semibold';
                 }
             }

             return `<td class="${cellClass}">${cellContent}</td>`;
         }).join('');

         return `
             <tr class="border-b border-gray-700">
                 <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-300">${day.dateStr}</td>
                 ${rowCells}
             </tr>
         `;
     }).join('');

      // Calcul des totaux
      const totals = comparisonItems.map((item, index) => {
           return data.reduce((sum, day) => {
                const rateEntry = day.rates.find(r => r.partner === item.partner && r.plan === item.plan);
                return sum + (rateEntry && rateEntry.rate !== null ? rateEntry.rate : 0);
           }, 0);
      });
      const totalCells = totals.map(total => `<td class="px-4 py-3 text-right text-sm font-semibold font-mono">${total.toFixed(2)} €</td>`).join('');


     comparisonDiv.innerHTML = `
         <table class="min-w-full divide-y divide-gray-700 table">
             <thead class="bg-darker-charcoal text-light-orange">
                 <tr>
                     <th class="px-4 py-3 text-left text-sm">Date</th>
                     ${headerCells}
                 </tr>
             </thead>
             <tbody class="divide-y divide-gray-700 bg-charcoal-dark/40">
                 ${rows}
             </tbody>
             <tfoot class="bg-darker-charcoal/80 font-semibold text-gray-100">
                 <tr class="border-t-2 border-gray-600">
                      <td class="px-4 py-3 text-sm text-left">Total Séjour</td>
                      ${totalCells}
                 </tr>
              </tfoot>
         </table>
     `;
 }


function updateDifferenceAnalysis(data, comparisonItems, dateDebutStr, dateFinStr, categorie) {
     const analysisDiv = document.getElementById('suivi-differenceAnalysis');
     if (!analysisDiv) { console.error("SUIVI: Élément #suivi-differenceAnalysis introuvable."); return; }

     analysisDiv.innerHTML = ''; // Vide l'ancien contenu

     if (data.length === 0 || comparisonItems.length === 0) {
         analysisDiv.innerHTML = '<p class="text-gray-400">Aucune donnée pour l\'analyse.</p>';
         return;
     }

     // Calculer les stats pour chaque item de comparaison
     const itemStats = comparisonItems.map(item => {
         const rates = data.map(day => {
              const rateEntry = day.rates.find(r => r.partner === item.partner && r.plan === item.plan);
              return rateEntry ? rateEntry.rate : null;
         }).filter(rate => rate !== null); // Filtre les tarifs null

         if (rates.length === 0) {
              return { ...item, hasData: false };
         }

         const sum = rates.reduce((total, rate) => total + rate, 0);
         const average = sum / rates.length;
         const minRate = Math.min(...rates);
         const maxRate = Math.max(...rates);

          // Trouver la date(s) du min et max
          const minDates = data.filter(day => {
               const rateEntry = day.rates.find(r => r.partner === item.partner && r.plan === item.plan);
               return rateEntry && rateEntry.rate === minRate;
          }).map(day => day.dateStr);

          const maxDates = data.filter(day => {
               const rateEntry = day.rates.find(r => r.partner === item.partner && r.plan === item.plan);
               return rateEntry && rateEntry.rate === maxRate;
          }).map(day => day.dateStr);


         return {
             ...item,
             hasData: true,
             average: average,
             minRate: minRate,
             maxRate: maxRate,
             minDates: minDates,
             maxDates: maxDates,
             validDaysCount: rates.length // Nombre de jours avec un tarif valide
         };
     });

     // Générer l'HTML pour chaque item
     const analysisHtml = itemStats.map(stats => {
          if (!stats.hasData) {
               return `
                   <div class="bg-slate-700 rounded-lg p-4 shadow border border-gray-700">
                       <h5 class="font-medium mb-2 text-light-orange">${stats.partner} (${stats.plan})</h5>
                       <p class="text-gray-400 text-sm italic">Pas de données disponibles pour cette combinaison Partenaire/Plan sur la période.</p>
                   </div>
               `;
          }

         const dateDebutLocale = formatDateLocale(new Date(dateDebutStr + 'T00:00:00Z'));
         const dateFinLocale = formatDateLocale(new Date(dateFinStr + 'T00:00:00Z'));

         return `
             <div class="bg-slate-700 rounded-lg p-4 shadow border border-gray-700">
                 <h5 class="font-medium mb-2 text-light-orange">${stats.partner} (<span class="text-gray-300">${stats.plan}</span>)</h5>
                 <p class="text-gray-300 text-sm">
                     Pour une chambre <span class="font-semibold">${categorie}</span> entre le ${dateDebutLocale} et le ${dateFinLocale} :
                 </p>
                 <ul class="text-gray-400 text-sm mt-2 space-y-1">
                     <li>Tarif moyen sur ${stats.validDaysCount} jour(s) : <span class="font-semibold text-gray-100">${stats.average.toFixed(2)} €</span></li>
                     <li>Tarif le plus bas : <span class="font-semibold text-accent-green">${stats.minRate.toFixed(2)} €</span> (le${stats.minDates.length > 1 ? 's' : ''} ${stats.minDates.join(', ')})</li>
                     <li>Tarif le plus haut : <span class="font-semibold text-accent-red">${stats.maxRate.toFixed(2)} €</span> (le${stats.maxDates.length > 1 ? 's' : ''} ${stats.maxDates.join(', ')})</li>
                 </ul>
             </div>
         `;
     }).join('');

     analysisDiv.innerHTML = analysisHtml;
 }

function getDatasetColor(index) {
    const colors = [
        '#f97316', // vibrant-orange
        '#3b82f6', // accent-blue
        '#10b981', // accent-green
        '#8b5cf6', // violet
        '#facc15', // accent-yellow
        '#ef4444', // accent-red
        '#64748b', // slate-600
        '#a3e635', // lime-400
        '#22d3ee', // cyan-400
        '#e879f9'  // fuchsia-400
    ];
    return colors[index % colors.length];
}

function resetSuiviForm() {
    console.log("SUIVI: Réinitialisation du formulaire...");
    const form = document.getElementById('suiviForm');
    if (form) {
         form.reset(); // Réinitialise les champs standard
         // Réinitialise les dates par défaut
         try {
             const today = new Date();
             const oneWeekLater = new Date();
             oneWeekLater.setUTCDate(today.getUTCDate() + 7);
             document.getElementById('suivi-dateDebut').value = formatDateYYYYMMDD(today);
             document.getElementById('suivi-dateFin').value = formatDateYYYYMMDD(oneWeekLater);
         } catch(e) {console.error("SUIVI: Erreur réinitialisation dates:", e);}


         // Supprime tous les blocs de comparaison sauf le premier (si on veut en garder un)
         const container = document.getElementById('partnerComparisonsContainer');
         if (container) {
             while (container.firstChild) {
                 container.removeChild(container.firstChild);
             }
         }
         comparisonBlockCounter = 0; // Réinitialise le compteur
         addPartnerComparisonBlock(); // Ajoute le premier bloc par défaut
         addPartnerComparisonBlock(); // Ajoute le deuxième bloc par défaut (car on compare au moins 2)

         // Cache les résultats et les alertes
         document.getElementById('suivi-result-container')?.classList.add('hidden');
         document.getElementById('suivi-alertContainer').innerHTML = '';

         // Réinitialise le graphique
         if (tarifsChart) {
              tarifsChart.destroy();
              tarifsChart = null; // S'assure que la variable est null
              // Réinitialise le canvas pour un futur graphique
              const chartContainer = document.querySelector('.chart-container');
              if (chartContainer) {
                   chartContainer.innerHTML = '<canvas id="tarifsChart"></canvas>';
              }
         }


         // Assure que le bouton Ajouter est visible
         document.getElementById('suivi-addPartnerBtn')?.classList.remove('hidden');


         // Re-peuple les dropdowns en cas de réinitialisation complète (peut-être pas nécessaire si les données sont déjà chargées)
         // updateRoomCategoryOptionsSuivi(); // Déjà fait à l'initialisation, peut-être pas besoin ici sauf si les données changent

          showAlert('Formulaire réinitialisé.', 'success', 3000);

    } else {
        console.error("SUIVI: Formulaire suiviForm introuvable pour réinitialisation.");
    }
}

// --- Initialisation du graphique (Structure vide) ---
// Sera rempli lors de la génération
function initializeChart() {
    // L'instance du graphique est créée dans generateChart,
    // on s'assure juste que le canvas existe.
    const canvas = document.getElementById('tarifsChart');
    if (!canvas) {
        console.error("SUIVI: Canvas 'tarifsChart' introuvable au moment de l'initialisation du chart.");
        // Tenter de recréer le canvas si le conteneur existe
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
             chartContainer.innerHTML = '<canvas id="tarifsChart"></canvas>';
             console.log("SUIVI: Canvas 'tarifsChart' recréé.");
        }
    }
}


// Fonctions appelées au chargement initial
// initializeSuiviApp(); // Appelée par le listener DOMContentLoaded