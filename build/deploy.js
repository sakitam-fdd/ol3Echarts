const ghpages = require('gh-pages');
const path = require('path');

ghpages.publish(path.join(__dirname, '../_site'), function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('publish to github page done')
  }
});
