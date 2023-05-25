console.log("track-notes.js", new Date());

rl.ready(() => {

    if ( rl.pageIsNot('release') ) return;
  
    // Get the tracklist table using the CSS attribute selector
    const tracklistTable = document.querySelector('table[class^="tracklist"]');

    // Get all <tr> elements within the tracklist table
    const trackRows = tracklistTable.querySelectorAll('tbody tr');

    // Iterate through each track row
    trackRows.forEach((row) => {
        // Create the input elements
        const ratingInput = document.createElement('input');
        ratingInput.type = 'text';
        ratingInput.className = 'rating-input';
        ratingInput.placeholder = 'Rating';

        const listenedCheckbox = document.createElement('input');
        listenedCheckbox.type = 'checkbox';
        listenedCheckbox.className = 'listened-checkbox';

        // Create a container element for the input elements
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';

        // Append the input elements to the container
        inputContainer.appendChild(ratingInput);
        inputContainer.appendChild(listenedCheckbox);

        // Find the duration cell
        const durationCell = row.querySelector('.duration_2t4qr');

        if (durationCell) {
            // Insert the input container before the duration cell
            row.insertBefore(inputContainer, durationCell);
        } else {
            // If no duration cell exists, append the input container to the row
            row.appendChild(inputContainer);
        }
    });

  
    // ========================================================
    // CSS
    // ========================================================
    let rules = /*css*/`
        .input-container {
            display: flex;
            align-items: center;
        }

        .input-container input {
            margin-right: 5px;
        }
    `;
  
    // ========================================================
    // DOM Setup
    // ========================================================
    rl.attachCss('track-notes', rules);
});
  