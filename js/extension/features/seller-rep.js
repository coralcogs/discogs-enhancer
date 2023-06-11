/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * -------------------------------------------------------------
 * Overview
 * -------------------------------------------------------------
 *
 * This feature will mark any seller who's reputation falls
 * below a specified number.
 *
 */

rl.ready(() => {

  let featureData = rl.getPreference('featureData'),
      { sellerRep: threshold, sellerRepFilter, sellerRepFilterNewSellers } = featureData;

  if ( !threshold ) return;

  if ( rl.pageIs('allItems', 'sellRelease', 'myWants') ) {

    // ========================================================
    // Functions
    // ========================================================
    /**
     * Finds all the seller's ratings in the DOM and
     * adds a `de-seller-rep` class to them if necessary. Also
     * injects the seller-rep icon into the DOM.
     * @method sellersRep
     * @return {undefined}
     */
    window.sellersRep = function sellersRep() {

      let ratingVals = [...document.getElementsByClassName('seller_info')],
          ratings = ratingVals.map(val => Number( val.textContent.match(/\d+\.+\d/g) ));

      // Tag any sellers below threshold
      ratings.forEach((rating, i) => {

        let seller_info = document.getElementsByClassName('seller_info');

        // Hide new sellers
        if (sellerRepFilterNewSellers && rating === 0) {
          seller_info[i].closest('tr.shortcut_navigable').classList.add('de-new-seller-hide');
        }

        if ( rating
             && rating < threshold
             && !seller_info[i].querySelector('.de-seller-rep-icon')) {

          let icon = document.createElement('span'),
              name = seller_info[i].querySelector('ul li:first-child a').textContent;

          icon.className = 'de-seller-rep-icon needs_delegated_tooltip';
          icon.dataset.placement = 'bottom';
          icon.rel = 'tooltip';
          icon.title = `${name}'s seller reputation is below ${threshold}%`;

          // Hide sellers when below minimum
          if (sellerRepFilter) {
            seller_info[i].closest('tr.shortcut_navigable').classList.add('de-seller-rep-hide');
          }

          seller_info[i].classList.add('de-seller-rep');
          seller_info[i].querySelector('li .seller_block:first-child')
                        .insertAdjacentElement('beforeend', icon);
        }
      });
    };

    // ========================================================
    // CSS
    // ========================================================

    let { sellerRepColor } = rl.getPreference('featureData'),
        color = sellerRepColor.match(/#*\w/g).join(''),
        rules = /*css*/`
        .de-dark-theme .de-seller-rep ul li i,
        .de-dark-theme .de-seller-rep ul li strong,
        .de-seller-rep ul li i,
        .de-seller-rep ul li strong {
          color: ${color} !important;
        }
        .de-seller-rep-icon {
          background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2LjIxOCAxMy44NjNMOS4xMjguNTc0QTEuMSAxLjEgMCAwIDAgOC4xNDYgMGMtLjQxIDAtLjc4LjI0Ni0uOTg4LjYxNUwuMTIxIDEzLjkwNGMtLjE2Ni4zMjgtLjE2OC43OC4wMzYgMS4xMDcuMjA0LjMyOS41MzIuNDkzLjk0My40OTNoMTQuMTI1Yy40MSAwIC43OC0uMjA1Ljk0Ni0uNTM0LjIwNy0uMzI4LjIwOS0uNzM4LjA0Ni0xLjEwNyIgdHJhbnNmb3JtPSJzY2FsZSguODU3MTQpIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXIpIi8+PHBhdGggZD0iTTYuOTk5IDQuNDk1YS41MzQuNTM0IDAgMCAwLS41MzMuNTMydjMuMmEuNTMxLjUzMSAwIDAgMCAuOTA5LjM3NmMuMS0uMS4xNTYtLjIzNS4xNTctLjM3NnYtMy4yYS41My41MyAwIDAgMC0uNTMzLS41MzJ6bTAgNS4zM2EuNTMzLjUzMyAwIDEgMC0uMDAxIDEuMDY1LjUzMy41MzMgMCAwIDAgLjAwMS0xLjA2NnoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjc1IiBzdHJva2U9IiM0MDMzMEQiIHN0cm9rZS13aWR0aD0iLjkwMiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDAgLTE2LjYxMSAxNi43MjMgMCAtOC45MDcgMTUuODM0KSI+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGQzUxNSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGRDU1QiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==);
          display: inline-block;
          height: 14px;
          width: 14px;
          margin-top: 0px;
          margin-left: 3px;
          vertical-align: top;
        }
        .de-seller-rep-icon + .tooltip {
          white-space: normal;
          opacity: 1;
        }

        .de-seller-rep-hide,
        .de-new-seller-hide {
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
        `;
    // ========================================================
    // DOM manipulation
    // ========================================================
    rl.attachCss('sellerRepCss', rules);
    window.sellersRep();

    // Prev/Next clicks
    rl.handlePaginationClicks(window.sellersRep);
  }
});
/**
// ========================================================
She moved so easily all I could think of was sunlight
I said, "Aren't you the woman who was recently given a Fulbright?"
She said, "Don't I know you from the cinematographer's party?"
I said, "Who am I to blow against the wind?"
https://www.discogs.com/master/view/55658
// ========================================================
 */
