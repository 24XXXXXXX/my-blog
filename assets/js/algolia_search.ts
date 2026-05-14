// from https://blog.naaln.com/2016/07/hexo-with-algolia/
const algoliaHandler = () => {
  const searchRoot = _$(".site-search");
  const searchPopup = searchRoot?.querySelector(".popup") as HTMLElement | null;
  const searchCloseButton = searchRoot?.querySelector(".popup-btn-close") as HTMLElement | null;
  const algoliaSettings = ALGOLIA_CONFIG.algolia;
  const isAlgoliaSettingsValid =
    algoliaSettings.applicationID &&
    algoliaSettings.apiKey &&
    algoliaSettings.indexName;

  if (!isAlgoliaSettingsValid) {
    console.error("Algolia Settings are invalid.");
    return;
  }

  if (!window.instantsearch) {
    console.error("Algolia InstantSearch is not loaded.");
    return;
  }

  const search = instantsearch({
    indexName: algoliaSettings.indexName,
    searchClient: algoliasearch(
      algoliaSettings.applicationID,
      algoliaSettings.apiKey
    ),
    searchFunction: (helper) => {
      if ((_$("#reimu-search-input input") as HTMLInputElement).value) {
        helper.search();
      }
    },
  });

  // Registering Widgets
  [
    instantsearch.widgets.configure({
      hitsPerPage: algoliaSettings.hits.per_page || 10,
    }),

    instantsearch.widgets.searchBox({
      container: "#reimu-search-input",
      placeholder: algoliaSettings.labels.input_placeholder,
      showReset: false,
      showSubmit: false,
      showLoadingIndicator: false,
    }),

    instantsearch.widgets.hits({
      container: "#reimu-hits",
      templates: {
        item: (data) => {
          const rawHref = (data?.permalink || "") as string;
          let href = rawHref;
          if (rawHref) {
            try {
              const u = new URL(rawHref, window.location.origin);
              href = `${u.pathname}${u.search}${u.hash}`;
            } catch {
              href = rawHref;
            }
          }
          return (
            '<a href="' +
            href +
            '" class="reimu-hit-item-link" title="' +
            (data.title || '') +
            '">' +
            data._highlightResult.title.value +
            "</a>"
          );
        },
        empty: (data) => {
          return (
            '<div id="reimu-hits-empty">' +
            algoliaSettings.labels.hits_empty.replace(
              /\$\{query}/,
              data.query
            ) +
            "</div>"
          );
        },
      },
      cssClasses: {
        item: "reimu-hit-item",
      },
    }),

    instantsearch.widgets.stats({
      container: "#reimu-stats",
      templates: {
        text: (data) => {
          const stats = algoliaSettings.labels.hits_stats
            .replace(/\$\{hits}/, data.nbHits)
            .replace(/\$\{time}/, data.processingTimeMS);
          return (
            stats +
            '<span class="reimu-powered">' +
            '  <img src="' +
            ALGOLIA_CONFIG.logo +
            '" alt="Algolia" />' +
            "</span>" +
            "<hr />"
          );
        },
      },
    }),

    instantsearch.widgets.pagination({
      container: "#reimu-pagination",
      scrollTo: false,
      showFirst: false,
      showLast: false,
      cssClasses: {
        list: "pagination",
        item: "pagination-item",
        link: "page-number",
        selectedItem: "current",
        disabledItem: "disabled-item",
      },
    }),
  ].forEach(search.addWidget, search);

  search.start();

  _$("#reimu-hits")
    ?.off("click")
    .on("click", (event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.("a.reimu-hit-item-link") as HTMLAnchorElement | null;
      const pjax = (window as any).__REIMU_PJAX__;
      if (!link || !pjax || typeof pjax.loadUrl !== "function") {
        return;
      }
      event.preventDefault();
      ((searchPopup as any)?.__closePopup)?.();
      pjax.loadUrl(link.href, {
        triggerElement: link,
      });
    });

  _$(".popup-trigger")
    ?.off("click")
    .on("click", (event) => {
      if (!searchPopup) return;
      event.stopPropagation();
      const scrollWidth = window.innerWidth - document.documentElement.offsetWidth;
      _$("#container")!.style.marginRight = scrollWidth + "px";
      _$("#header-nav")!.style.marginRight = scrollWidth + "px";
      const popup = searchPopup;
      popup.classList.add("show");
      _$("#mask")!.classList.remove("hide");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        (_$("#reimu-search-input input"))?.focus();
      }, 100);
      const keydownHandler = (e) => {
        const focusables = popup.querySelectorAll(
          "input, [href]"
        );
        const firstFocusable = focusables[0] as HTMLElement;
        const lastFocusable = focusables[focusables.length - 1] as HTMLElement;
        if (e.key === "Escape") {
          closePopup();
        } else if (e.key === "Tab" && focusables.length) {
          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      };
      document.addEventListener("keydown", keydownHandler);
      function closePopup() {
        popup.classList.remove("show");
        _$("#mask").classList.add("hide");
        _$("#container").style.marginRight = "";
        _$("#header-nav").style.marginRight = "";
        document.body.style.overflow = "";
        document.removeEventListener("keydown", keydownHandler);
        _$("#nav-search-btn")?.focus();
      }
      (popup as any).__closePopup = closePopup;
    });

    searchCloseButton
    ?.off("click")
    .on("click", () => {
      (searchPopup as any)?.__closePopup?.();
    });
};

if (document.readyState !== "loading") {
  algoliaHandler();
} else {
  document.addEventListener("DOMContentLoaded", algoliaHandler);
}
