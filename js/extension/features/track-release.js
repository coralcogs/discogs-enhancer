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
 * Shows a track button on a release page.
 *
 */

rl.ready(async () => {
    // Check if we are on a release page
    if (rl.pageIsNot('release')) return;
    // Get the release id
    const href = window.location.href,
        id = href?.split('/release/')[1]?.split('-')[0];
    // Get the user from preferences
    const username = rl.getPreference('username');
    if (!username?.length) {
        alert('Please set username in options page');
        return;
    }
    let tracking;
    // Define the track function
    async function track({ type }) {
        try {
            let url = `https://api.ozma.works/tracked_release${type === 'check' ? `?release_id=eq.${id}` : ''}`,
                method = {
                    check: 'GET',
                    track: 'POST',
                    untrack: 'DELETE',
                }[type],
                body = JSON.stringify({
                    username,
                    release_id: id,
                }),
                headers = { 'Content-Type': 'application/json' },
                response = await fetch(url, {
                    method,
                    body: type === 'track' ? body : undefined,
                    headers: type === 'track' ? headers : undefined,
                });
            if (type === 'track') {
                return response.ok;
            }
            if (type === 'untrack') {
                return !response.ok;
            }
            const data = await response.json();
            return !!data.length;
        } catch (error) {
            console.log(`Error running ${type} in track function`, error);
        }
    }
    // Define the toggleTrack event handler
    async function toggleTrack() {
        if (!tracking) {
            tracking = await track({ type: 'track' });
        } else {
            tracking = await track({ type: 'untrack' });
        }
        button.textContent = tracking ? 'Untrack' : 'Track';
        button.addEventListener('click', toggleTrack);
    }
    tracking = await track({ type: 'check' });
    // Add track release button to release actions section
    const releaseActionsSection = document.getElementsByClassName('buttons_2jlYL'),
        button = document.createElement('button');
    button.classList = '_button_yfwhw_1 button_3lhp0 _dense_yfwhw_52 _notHasTextNode_yfwhw_30 _notHasTextNodeFirst_yfwhw_30 _notHasTextNodeLast_yfwhw_35 _secondary_yfwhw_58';
    button.textContent = tracking ? 'Untrack' : 'Track';
    // Add the button to the release actions section
    releaseActionsSection.appendChild(button);
    button.addEventListener('click', toggleTrack);
});