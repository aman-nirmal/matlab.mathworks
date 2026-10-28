async function checkAdBlocker() {
  let isBlocked;
  if ($('.personalization-container.recommendation-feed').children().length == 0){
    async function tryRequest() {
      try {
        return fetch(
          new Request("https://starget.mathworks.com/rest/v1/delivery", {
            method: 'HEAD',
            mode: 'no-cors'
          }))
          .then(function(response) {
            isBlocked = false;
            return isBlocked;
          }).catch(function(e) {
            isBlocked = true;
            return isBlocked;
          });
      } catch (error) {
        isBlocked = true;
        return isBlocked;
      }
    }

    return isBlocked !== undefined ? isBlocked : await tryRequest();
  }
}

const sleep = ms => new Promise(res => setTimeout(res, ms));
const usingBlocker = async function () {
// Adobe recommendation loads after document ready so setup a timeout for 3 secs
  await sleep(3000);
  return await checkAdBlocker();
}

usingBlocker().then((res) => {
  if (res) {
    $(".personalization-container.recommendation-feed").html( "<div class=\"col-xs-12\"><div class=\"alert alert-info\"><span class=\"alert_icon icon-alert-info-reverse\"></span><h3>No Content</h3><p>We detect you're blocking Ads. To see the content MATLAB Central recommends to you, please add mathworks.com in your Ads blocker white list.</p></div></div>" );
  }
});
