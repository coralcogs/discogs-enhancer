/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ----------------------------------------------------------
 * Overview
 * ----------------------------------------------------------
 *
 * Record release and master release visits to database.
 *
 */

rl.ready(() => {
  if (rl.pageIsNot('release') && rl.pageIsNot('master')) return;
  // Find the type
  const type = rl.pageIs('master') ? 'master' : 'release';
  // Get the user from preferences
  const username = rl.getPreference('username');
  if (!username?.length) {
    alert('Please set username in options page');
    return;
  }
  // Get the href and releaseId
  const href = window.location.href,
    id = href?.split(`/${type}/`)[1]?.split('-')[0];
  // Define the function to record the visit
  async function recordVisit({ type }) {
    try {
      let url = `https://api.ozma.works/${type}_visit`,
        body = JSON.stringify({
          username,
          [`${type}_id`]: id,
        });
      await fetch(url, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (err) {
      console.log(`Error recording ${type} visit`, err);
    }
  }
  recordVisit({ type });
});
