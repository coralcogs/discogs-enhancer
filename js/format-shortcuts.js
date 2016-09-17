/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */
// TODO add buttons to list comments $('.textedit_content')
$(document).ready(function() {

  let t = document.getElementsByTagName('textarea'),
      hasTextarea = false;

  // see if any review boxes exist on the page
  if (t.length) {

    for (let i in t) {

      // reviews
      if (t[i].name === 'review') {

        hasTextarea = true;

        break;
      }

      // new threads in groups/forums
      if (t[i].id === 'text') {

        hasTextarea = true;

        break;
      }

      // forum/group replies
      if ( t[i].className && t[i].className.indexOf('forum_reply') > -1 ) {

        hasTextarea = true;

        break;
      }
    }
  } else {

    return;
  }

  // inject markup if necessary
  if (hasTextarea) {

    let markup = '<div class="quick-menu">' +
                    '<a href="#"><div class="quick-button quick-link" title="Insert url">&#8599;</div></a>' +
                    '<a href="#"><div class="quick-button quick-bold" title="Insert bold code">B</div></a>' +
                    '<a href="#"><div class="quick-button quick-italic" title="Insert italic code">I</div></a>' +
                 '</div>';

     /**
      * Parses the URL passed into it and
      * returns the release/master/artist/forum
      * number.
      *
      * @param    {string} url [the URL passed into the function]
      * @return   {string} num [the parsed id number]
      */

     function parseURL(url) {

       let urlArr = url.split('/'),
           num = urlArr[urlArr.length - 1];

       if (num.indexOf('-') > -1) {

         num = num.split('-')[0];
       }

       if (num.indexOf('?') > -1) {

         num = num.split('?')[0];
       }

       return num;
     }

    // Inject buttons into DOM
    $(markup).insertAfter( $('textarea') );

    // bold and italic
    $('.quick-button.quick-bold, .quick-button.quick-italic').click(function(event) {

      let
          textarea = $(this).parent().parent().siblings('textarea'),
          boldSyntax = $(this).hasClass('quick-bold') ? '[b][/b]' : '[i][/i]',
          position = textarea.getCursorPosition(),
          text = textarea.val();

      event.preventDefault();

      // insert appropriate tag syntax
      textarea.val( text.substr(0, position) + boldSyntax + text.substr(position) );

      // adjust cursor position to fit between bold/italic tags
      textarea.selectRange(position + 3);

      // set the focus
      textarea.focus();
    });

    // URLs
    $('.quick-button.quick-link').click(function(event) {

      let
          textarea = $(this).parent().parent().siblings('textarea'),
          discogs = 'https://www.discogs.com',
          guideline = /(\d+\.+\d*)/g,
          link = window.prompt('Type or paste your URL or guideline number (ie: 1.2.3) here:'),
          position = textarea.getCursorPosition(),
          syntax = undefined,
          text = textarea.val();

      event.preventDefault();

      switch (true) {

        // artists
        case link.indexOf('/artist/') > -1 && link.indexOf(discogs) > -1:

            let artist = parseURL(link);

            syntax = '[a' + artist + ']';

            break;

        // guidelines
        case guideline.test(link) && link.indexOf(discogs) === -1 && link.indexOf('http') === -1:

            syntax = '[g' + link + ']';

            break;

        // labels
        case link.indexOf('/label/') > -1 && link.indexOf(discogs) > -1:

            let label = parseURL(link);

            syntax = '[l' + label + ']';

            break;

        // masters
        case link.indexOf('/master/') > -1 && link.indexOf(discogs) > -1:

            let master = parseURL(link);

            syntax = '[m' + master + ']';

            break;

        // releases
        case link.indexOf('/release/')> -1 && link.indexOf(discogs) > -1:

            let release = parseURL(link);

            syntax = '[r' + release + ']';

            break;

        // topics
        case link.indexOf('/forum/thread/') > -1 && link.indexOf(discogs) > -1:

            let topic = parseURL(link);

            syntax = '[t=' + topic + ']';

            break;

        // user
        case link.indexOf('/user/') > -1 && link.indexOf(discogs) > -1:

            syntax = '[u=' + link.split('/')[link.split('/').length - 1] + ']';

            break;

        // non-discogs urls
        // TODO better url detection than just indexOf('/')
        case link.indexOf('http') > -1:

            syntax = '[url=' + link + '][/url]';

            // insert appropriate tag syntax
            textarea.val( text.substr(0, position) + syntax + text.substr(position) );

            // adjust cursor position to fit between URL tags
            textarea.selectRange(position + (link.length + 6));

            // set the focus
            textarea.focus();

            return;

        default:
            // 'a link has no name...'
            alert('A valid URL or guideline number was not recognized. \nPlease make sure URLs begin with http:// or https:// and guidelines are in an x.x.x format. \n\nYou can read more about the requirements by clicking \'About\' from the Discogs Enhancer popup menu and reading the section called \'Format Shortcuts\'.');

            return;
      }

      // insert appropriate tag syntax
      textarea.val( text.substr(0, position) + syntax + text.substr(position) );

      // adjust cursor position to end of the inserted tag
      textarea.selectRange(syntax.length);

      // set the focus
      textarea.focus();
    });
  }
});