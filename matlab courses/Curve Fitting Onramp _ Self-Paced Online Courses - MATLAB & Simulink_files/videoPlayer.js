function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
    return params;
}

function allowedLanguages(language){
    return (language && (language === "en" || language === "ja" || language === "es" || language === "ko" || language === "zh" || language === "fr" || language === "it" || language === "de"))
}

var qps = getQueryParams(document.location.search);
shouldEnableDarkMode();

//Create userVideoSettings object which saves user's settings to their session storage
var userVideoSettings = {"volume": qps.volume, "captionLanguage": qps.lang};

var aspectRatio;
var videoPlayerObj = videojs("videoPlayer");
var videoPrefix = videoPlayerObj.getAttribute("data-video-prefix") || "";  //videoPrefix only exists for localized videoID's
var videoId  = videoPrefix + qps.videoIdUrl;
videoPlayerObj.catalog.getVideo(videoId, function(error, video) {
    //Setting the aspect ratio before the video metadata is loaded
    aspectRatio = getAspectRatio(videoPlayerObj);
    videoSize();

    //For the captions to work, need to wait until the metadata to be loaded
    videoPlayerObj.on("loadeddata", function () {
        var caption, captionLanguage;
        //get caption toggle from query params
        caption = (qps.caption === "on") ? "on" : "off";

        //get volume from query params
        videoPlayerObj.volume(qps.volume);

        // Set the start time if provided by the query params
        if (qps.t) {
            videoPlayerObj.currentTime(qps.t);
        }

        //If the caption is off, do not show the subtitles by default
        if (caption === "on") {
            if (allowedLanguages(qps.lang)) {
                captionLanguage = qps.lang;
            } else {
                captionLanguage = "";
            }
            for (var i = 0; i < videoPlayerObj.textTracks().length; i++) {
                if (videoPlayerObj.textTracks()[i].language === captionLanguage) {
                    videoPlayerObj.textTracks()[i].mode = "showing";
                    break;
                } else {
                    videoPlayerObj.textTracks()[i].mode = "disabled";
                }
            }
        }

        //Detect when the caption selection has been changed
        videoPlayerObj.textTracks().on('change', function (e) {
            var captionActive = false;
            //Find which track has been enabled
            for (var i = 0; i < videoPlayerObj.textTracks().length; i++) {
                if (videoPlayerObj.textTracks()[i].mode === "showing") {
                    userVideoSettings.captionLanguage = videoPlayerObj.textTracks()[i].language;
                    captionActive = true;
                }
            }
            //Or if a track was disabled
            if (!captionActive) {
                userVideoSettings.captionLanguage = "none";
            }
            updateVideoSettings();
        });

        videoPlayerObj.ready(function () {
            if (qps.play !== "false") {
                setTimeout(function () {
                    videoPlayerObj.play();
                }, 2000);
            }

        });
    });
    videoPlayerObj.catalog.load(video);
});

window.addEventListener("resize", videoSize); //register listener for resize

//Detect when the volume is adjusted
var enableVolumeMessage = false;
videoPlayerObj.on('volumechange', function(e) {
    enableVolumeMessage = true;
    userVideoSettings.volume = JSON.stringify(videoPlayerObj.volume());
});

//Only post the volume adjusted message on mouseup (so we know the slider is done moving and we don't send unnecessary messages)
window.addEventListener('mouseup', function(e) {
    if (enableVolumeMessage) {
        updateVideoSettings();
        enableVolumeMessage = false;
    }
});

//Because it is possible for the volume to also be adjusted with arrow keys, we add two more keyup events to mimic the mouseup event:
window.addEventListener('keyup', function (e) {
    if (enableVolumeMessage) {
        if (e.code === "ArrowUp" || e.code === "ArrowDown") {
            updateVideoSettings();
            enableVolumeMessage = false;
        }
    }
});

// Add event listener to listen for theme changes
window.addEventListener('message', function (e) {
    try {
        var data = JSON.parse(e.data);
        if (data.type === 'themechanged') {
            if (data.isDarkMode) {
                document.body.classList.add('mw-theme-dark');
            } else {
                document.body.classList.remove('mw-theme-dark');
            }
        }
    } catch (e) {
        console.error(e);
    }
});

function updateVideoSettings() {
    parent.postMessage(userVideoSettings, "*");
}

function videoSize() {
    var videoDiv, innerVideoDiv;
    var margin, windowWidth, windowHeight, windowRatio, videoDivWidth, videoDivHeight;

    videoDiv = document.getElementById("videoPlayer");
    innerVideoDiv = document.getElementById("videoPlayer_html5_api"); //get the inner components for <video> autocreated by BrightcoveAPI

    if(innerVideoDiv){
        innerVideoDiv.removeAttribute("style"); //remove the default height and width for actual video
    }

    videoDiv.removeAttribute("style");	//remove the default height and width of the <video>

    margin = 5;
    windowWidth = window.innerWidth - 2*margin;
    windowHeight = window.innerHeight - 2*margin;
    videoDivWidth = windowWidth;
    videoDivHeight = windowHeight;

    //Calculator:
    windowRatio = 	windowHeight/ windowWidth ; //Image Aspect ratio Height:Width = 3:4 or 0.75

    if (windowRatio >= aspectRatio){
        videoDivHeight = (videoDivWidth)*aspectRatio;
        videoDiv.setAttribute("style", "height:"+videoDivHeight +"px;width:"+videoDivWidth+"px;");
    } else{
        videoDivWidth = videoDivHeight/aspectRatio;
        videoDiv.setAttribute("style", "width:"+videoDivWidth+"px;height:"+videoDivHeight+"px")
    }
}

//IE9 displays the videojs error message before the video loads, which is somewhat jarring to the user. Thus, we
// disable the videojs error display until 5 seconds in, and then, if there was an error (as indicated by the
// existance of a .vjs-error element), then we show the error
window.setTimeout(function() {
    var vjsErrorNode = null;
    var vjsErrorDisplayNode = null;
    try {
        vjsErrorNode = document.getElementsByClassName("vjs-error")[0];
        vjsErrorDisplayNode = document.getElementsByClassName("vjs-error-display")[0];
    } catch (e) {

    }
    if (vjsErrorNode && vjsErrorDisplayNode) {
        vjsErrorDisplayNode.setAttribute("style","display:block;");
    }
},5000);

function getAspectRatio(videoPlayerObj){
    var renditionInfo, videoHeight, videoWidth, ratio;

    /* Values can be as follows:
     0.75 for 4:3 Aspect ratio
     0.5625 for 16:9 Aspect ratio */

    var aspectRatio = 0.5625; //default to 16:9 as the new Brightcove player only supports 16:9

    try {
        renditionInfo = videoPlayerObj.mediainfo.rawSources_;
        videoHeight = renditionInfo[0].height;
        videoWidth = renditionInfo[0].width;

        ratio = videoHeight/videoWidth;

        if (ratio && !isNaN(ratio)){
            aspectRatio = ratio;
        }
    } catch (e) {

    }

    return aspectRatio;
}

function shouldEnableDarkMode() {
    if (qps.darkMode === 'true') {
        window.document.body.classList.add('mw-theme-dark');
    }
}
