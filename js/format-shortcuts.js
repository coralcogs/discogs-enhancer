$(document).ready(function() {

  let t = document.getElementsByTagName('textarea'),
      hasReview = false;

  // see if any review boxes exist on the page
  if (t.length) {

    for (let i in t) {

      if (t[i].name === 'review') {

        hasReview = true;

        break;
      }

      if ( t[i].className.indexOf('forum_reply') > -1 ) {

        hasReview = true;

        break;
      }
    }
  } else {

    return;
  }

  // inject markup if necessary
  if (hasReview) {

    let markup = '<div class="quick-menu">' +
                    '<a href="#"><div class="quick-button quick-bold">B</div></a>' +
                    '<a href="#"><div class="quick-button quick-italic">I</div></a>' +
                    '<a href="#"><div class="quick-button quick-link">&#127760;</div></a>' +
                 '</div>';

    $(markup).insertAfter( $('textarea') );

    // bold and italic
    $('.quick-button.quick-bold, .quick-button.quick-italic').click(function(event) {

      event.preventDefault();

      let
          textarea = $(this).parent().parent().siblings('textarea'),
          boldSyntax = $(this).hasClass('quick-bold') ? '[b][/b]' : '[i][/i]',
          position = textarea.getCursorPosition(),
          text = textarea.val();

      // insert appropriate tag syntax
      textarea.val( text.substr(0, position) + boldSyntax + text.substr(position) );

      // adjust cursor position to fit between bold/italic tags
      textarea.selectRange(position + 3);

      // set the focus
      textarea.focus();
    });

    // URLs
    $('.quick-button.quick-link').click(function(event) {

      event.preventDefault();

      let
          textarea = $(this).parent().parent().siblings('textarea'),
          link = window.prompt('Paste your Discogs URL here:'),
          position = textarea.getCursorPosition(),
          syntax = undefined,
          text = textarea.val(),
          urlArr;

      switch (true) {

        // artists
        case link.indexOf('/artist/') && link.indexOf('discogs.com') > -1:

            urlArr = link.split('/');

            let
                artist = urlArr[urlArr.length - 1],
                artistNum = artist.split('-')[0];

            syntax = '[a' + artistNum + ']';

            break;

        // guideline
        case link.indexOf('/doc/') && link.indexOf('discogs.com') > -1:

            urlArr = link.split('/');

            let guideline = urlArr[urlArr.length - 1],
                guideNum = guideline.split('#')[1];

            syntax = '[g' + guideNum + ']';

            break;

        // label
        case link.indexOf('/label/') && link.indexOf('discogs.com') > -1:

            urlArr = link.split('/');

            let label = urlArr[urlArr.length - 1],
                labelNum = label.split('-')[0];

            syntax = '[l' + labelNum + ']';

            break;

        // master
        case link.indexOf('/master/') && link.indexOf('discogs.com') > -1:

            console.log('link is a master');

            urlArr = link.split('/');

            let master = urlArr[urlArr.length - 1];

            syntax = '[m' + master + ']';

            break;


        // release
        case link.indexOf('/release/') && link.indexOf('discogs.com') > -1:

            urlArr = link.split('/');

            let release = urlArr[urlArr.length - 1];

            syntax = '[r' + release + ']';

            break;

        // topic
        case link.indexOf('/topic?') && link.indexOf('discogs.com') > -1:

            urlArr = link.split('/');

            let topic = urlArr[urlArr.length - 1],
                topicNum = topic.split('=')[1];

            syntax = '[t=' + topicNum + ']';

            break;

        // user
        case link.indexOf('/user/') && link.indexOf('discogs.com') > -1:

            syntax = '[u=' + link.split('/')[link.split('/').length - 1] + ']';

            break;

        // non-discogs url
        // TODO better url detection than just indexOf('/')
        case link.indexOf('/') > -1:

            syntax = '[url=' + link + '][/url]';

            // insert appropriate tag syntax
            textarea.val( text.substr(0, position) + syntax + text.substr(position) );

            // adjust cursor position to fit between bold/italic tags
            textarea.selectRange(position + (link.length + 6));

            // set the focus
            textarea.focus();

            return;

        default:
            // 'a link has no name...'
            alert('You did not enter a valid URL. Please try again.');

            return;
      }

      // insert appropriate tag syntax
      textarea.val( text.substr(0, position) + syntax + text.substr(position) );

      // adjust cursor position to fit between bold/italic tags
      textarea.selectRange(position + 3);

      // set the focus
      textarea.focus();

    });
  }
});
