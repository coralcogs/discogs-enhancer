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
    // Define the checkStatus function
    async function checkStatus() {
        try {
            let url = `https://api.ozma.works/tracked_release?release_id=eq.${id}`,
                response = await fetch(url),
                data = await response.json();
            return !!data.length;
        } catch (error) {
            console.log('Error checking if release is tracked', error);
        }
    }
    // Define the track function
    async function track() {
        try {
            let url = 'https://api.ozma.works/tracked_release',
                body = JSON.stringify({
                    username,
                    release_id: id,
                }),
                response = await fetch(url, {
                    method: 'POST',
                    body,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            return response.ok;
        } catch (error) {
            console.log('Error tracking release', error);
        }
    }
    // Define the untrack function
    async function untrack() {
        try {
            let url = `https://api.ozma.works/tracked_release`,
                body = JSON.stringify({
                    username,
                    release_id: id,
                })
            response = await fetch(url, {
                method: 'DELETE',
                body,

            });
            return response.ok ? false : true;
        } catch (error) {
            console.log('Error untracking release', error);
        }
    }
    // Define the toggleTrack event handler
    async function toggleTrack() {
        if (!tracking) {
            tracking = await track();
        } else {
            tracking = await untrack();
        }
        button.textContent = tracking ? 'Untrack' : 'Track';
        button.addEventListener('click', toggleTrack);
    }
    tracking = await checkStatus();
    // Add track release button to release actions section
    const releaseActionsSection = document.getElementById('release-actions'),
        button = document.createElement('button');
    button.classList = 'button button-small button-red';
    button.textContent = tracking ? 'Untrack' : 'Track';
    // Add the button to the release actions section
    releaseActionsSection.appendChild(button);
    button.addEventListener('click', toggleTrack);
});