/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This is the background service worker. It handles setting up the initial
 * feature preferences, badge notifications, and adding / removing
 * contextual menu items.
 *
 */

// ========================================================
// Default preferences upon installing
// ========================================================
prefs = {
  absoluteDate: false,
  averagePrice: false,
  baoiFields: false,
  blockBuyers: false,
  blockSellers: true,
  blurryImageFix: false,
  confirmBeforeRemoving: false,
  collectionUi: false,
  commentScanner: false,
  converter: true,
  darkTheme: false,
  demandIndex: false,
  editingNotepad: false,
  everlastingCollection: false,
  everlastingMarket: true,
  favoriteSellers: true,
  feedback: false,
  filterMediaCondition: false,
  filterMediaConditionValue: 7,
  filterPrices: false,
  filterShippingCountry: false,
  filterSleeveCondition: false,
  filterSleeveConditionValue: 7,
  filterUnavailable: false,
  forceDashboard: false,
  formatShortcuts: true,
  hideMinMaxColumns: false,
  highlightMedia: true,
  inventoryRatings: false,
  inventoryScanner: false,
  notesCount: true,
  quickSearch: false,
  randomItem: false,
  ratingPercent: false,
  readability: false,
  relativeSoldDate: false,
  releaseScanner: false,
  releaseDurations: true,
  releaseRatings: false,
  removeFromWantlist: false,
  sellerItemsInCart: false,
  sellerRep: false,
  sortButtons: true,
  suggestedPrices: false,
  tweakDiscrims: false,
  userCurrency: 'USD',
  ytPlaylists: false,
  //
  useAllDay: false,
  useBandcamp: false,
  useBeatport: false,
  useBoomkat: false,
  useClone: false,
  useDeejay: false,
  useDiscogs: true,
  useEarcave: false,
  useGramaphone: false,
  useHardwax: false,
  useJuno: false,
  useOye: false,
  usePhonica: false,
  useRateYourMusic: false,
  useRedeye: false,
  useRushhour: false,
  useSotu: false,
  useYoutube: false
};

// NOTE: featureDefaults are default settings for the chrome.storage.sync'd preferences of features
// that have submenus / management pages (block sellers, filter countries, etc...)
// Features that use localStorage to save things on the DOM side need to be saved outside
// of `featurePrefs` since they will get overwritten when the `newPrefs` object is created
// in user-preferences.js.
let featureDefaults = {
      blockList: { list:[], hide: 'tag' },
      countryList: { list: [], currency: false, include: false },
      discriminators: {
          hide: false,
          superscript: true,
          unselectable: true,
          transparent: false,
        },
      favoriteList: { list: [] },
      filterPrices: { minimum: 0, maximum: 100 },
      inventoryScanner: { threshold: 20 },
      linksInTabs: {
          artists: false,
          collection: false,
          dashboard: false,
          labels: false,
          lists: false,
          marketplace: false,
          releases: false,
          wantlist: false,
        },
      mediaCondition: 7,
      minimumRating: 4.5,
      readability: {
          indexTracks: false,
          nth: 10,
          otherMediaReadability: true,
          otherMediaThreshold: 15,
          size: 0.5,
          vcReadability: true,
          vcThreshold: 8
        },
      sellerRep: 75,
      sellerRepColor: 'darkorange',
      sellerRepFilter: false,
      sleeveCondition: { value: 7, generic: false, noCover: false },
      usDateFormat: false,
    };

// ========================================================
// Install/Update Notifications
// ========================================================
chrome.runtime.onInstalled.addListener((details) => {

  let previousVersion,
      thisVersion;

    if (details.reason === 'install') {

      chrome.storage.sync.set({
        didUpdate: false,
        prefs: prefs,
        featurePrefs: featureDefaults,
        migrated: true
      }).then(() => console.log('Welcome to the pleasuredome!'));

      // Launch quick start guide
      chrome.tabs.create({url: '../html/welcome.html'});

    } else if (details.reason === 'update') {
      // - Don't show an update notice on patches -
      previousVersion = details.previousVersion.split('.');

      thisVersion = chrome.runtime.getManifest().version.split('.');

      if ( Number(thisVersion[0]) > Number(previousVersion[0])
           || Number(thisVersion[1]) > Number(previousVersion[1]) ) {

          chrome.action.setBadgeText({text: ' '});

          chrome.action.setBadgeBackgroundColor({color: '#4cb749'});

          chrome.storage.sync.set({ didUpdate: true }, function() {});
      }
    }

  // Uninstall action
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL('https://www.discogs-enhancer.com/uninstall');
  }
  // Instantiate Contextual Menu Options
  updateContextMenus();
})

// ========================================================
// Contextual Menus
// ========================================================
/**
 * Creates a context menu in Chrome
 * @param {string} name - The name that is displayed in the context menu
 */
function createContextMenu(name) {

  let id = name.split(' ').join('').toLowerCase();

  chrome.contextMenus.create({
    contexts: ['selection'],
    id: id,
    title: 'Search for "%s" on ' + name
  });
}

/**
 * Creates contextual menus based on the user's saved preferences
 * @returns {undefined}
 */
function updateContextMenus() {
  chrome.storage.sync.get('prefs', ({ prefs }) => {

    // Add Discogs on install
    if (!prefs) {
      createContextMenu('Discogs');
    }
    // Put Discogs first...
    if (prefs.useDiscogs) createContextMenu('Discogs');
    // Then the remaining stores in alphabetical order
    if (prefs.useAllDay) createContextMenu('All Day');
    if (prefs.useBandcamp) createContextMenu('Bandcamp');
    if (prefs.useBeatport) createContextMenu('Beatport');
    if (prefs.useBoomkat) createContextMenu('Boomkat');
    if (prefs.useClone) createContextMenu('Clone');
    if (prefs.useDeejay) createContextMenu('DeeJay');
    if (prefs.useEarcave) createContextMenu('Earcave');
    if (prefs.useGramaphone) createContextMenu('Gramaphone');
    if (prefs.useHardwax) createContextMenu('Hardwax');
    if (prefs.useJuno) createContextMenu('Juno');
    if (prefs.useOye) createContextMenu('Oye');
    if (prefs.usePhonica) createContextMenu('Phonica');
    if (prefs.useRateYourMusic) createContextMenu('Rate Your Music');
    if (prefs.useRedeye) createContextMenu('Red Eye');
    if (prefs.useRushhour) createContextMenu('Rush Hour');
    if (prefs.useSotu) createContextMenu('SOTU');
    if (prefs.useYoutube) createContextMenu('YouTube');
  })
}

// ========================================================
// Contextual Menu Add / Remove
// ========================================================
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {

    if (msg.request === 'updateContextMenu') {
      chrome.contextMenus.removeAll();
      updateContextMenus();
    }
  });
})

// ========================================================
// Contextual Menu Event Listeners
// ========================================================
chrome.contextMenus.onClicked.addListener((event) => {

  let path,
      suffix = ''

  switch (event.menuItemId) {
    case 'allday':
      path = 'https://www.alldayrecords.com/search?type=product&q='
      break

    case 'bandcamp':
      path = 'https://bandcamp.com/search?q='
      break

    case 'beatport':
      path = 'https://www.beatport.com/search?q='
      break

    case 'boomkat':
      path = 'https://boomkat.com/products?q[keywords]='
      break

    case 'clone':
      path = 'https://clone.nl/search/?instock=1&query='
      break

    case 'deejay':
      path = 'http://www.deejay.de/'
      break

    case 'discogs':
      path = 'http://www.discogs.com/search?q=';
      break

    case 'earcave':
      path = 'https://earcave.com/search?type=product&q=';
      break
    case 'gramaphone':
      path = 'https://gramaphonerecords.com/search?q=';
      break

    case 'hardwax':
      path = 'https://hardwax.com/?search=';
      break

    case 'juno':
      path = 'https://www.juno.co.uk/search/?q%5Ball%5D%5B%5D=';
      break

    case 'oye':
      path = 'https://oye-records.com/search?q=';
      break

    case 'phonica':
      path = 'http://www.phonicarecords.com/search/';
      break

    case 'rateyourmusic':
      path = 'https://rateyourmusic.com/search?searchterm=';
      suffix = '&type=l';
      break

    case 'redeye':
      path = 'https://www.redeyerecords.co.uk/search/?searchType=Artist&keywords=';
      suffix = '&type=l'
      break

    case 'rushhour':
      path = 'http://www.rushhour.nl/search?sort_by=&query=';
      break

    case 'sotu':
      path = 'https://soundsoftheuniverse.com/search/?q=';
      break

    case 'youtube':
      path = 'https://www.youtube.com/results?search_query=';
      break
  }

  let str = event.selectionText,
  encodeStr = encodeURIComponent(str);

  chrome.tabs.create({ url: path + encodeStr + suffix });
})
