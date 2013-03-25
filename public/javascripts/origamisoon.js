/**
 * Coming soon
 * -----------
 *
 * author: PeHaa Hetman
 * email: info@pehaa.com
 *
 * version 1.0 release date: 12.01.2013
 *
 **/
var origamiSoon = {

    //-------------DEFAULT SETTINGS------------//

    defaults: {
        launchDate: "", //Date : enter the estimated date when your site will be ready ex. "2013/11/30, 11:13"
        labels: ["days", "hours", "mins", "secs"], //Array of strings : labels of time units
        progress: "20", //Integer : the percentage of progress, will be reclaculated if launchDate and progressCountFrom are both defined
        progressCountFrom: "", //Date : the moment corresponding to the value of progress 
        twitterUser: "", //String : your twitter username, ex. "PeHaa" or "@PeHaa"
        numberTweets: "3", //Integer : number of recent tweets to be displayed
        subscriptionInputMessage: "STAY TUNED ! Enter your email here.", //String : the message displayed inside the email input in the subscription form. It also has to be changed in the html body.
        subscriptionInputError: "Please enter a valid email.", //String : the error message if the entered email adress is not valid
        subscriptionServerMessages: ["You'll hear from us soon. Thanks.", "You've already been  on the list. Thanks.", "Sorry, we couldn't save your email."] //Array of strings : Messages from the server
    },

    option: {},

    init: function (customOption) {
        var self = this;

        // extend default option
        self.option = $.extend({}, self.defaults, customOption);
        if (self.option.launchDate !== "") {
            //rAnf();
            self.launchDate = new Date(self.option.launchDate);
            self.setCountDown();
            self.days = $("#days");
            self.hours = $("#hours");
            self.minutes = $("#minutes");
            self.seconds = $("#seconds");
            self.doCountDown();
        }
        if (self.option.twitterUser !== "") {
            self.addTweets();
        }
        self.subscriptions();
        if (self.option.progress !== "") {
            self.progressBar();
        }
    },


    setCountDown: function () {
        var self = this;
        var now = new Date();
        self.secondsDiff = Math.floor((self.launchDate.getTime() - now.getTime()) / 1000);

        var $timer_html = '<div  class="days"><p><span id="days"></span><br/>' + self.option.labels[0] + '<p></div>' +
            '<div  class="hours"><p><span id="hours"></span><br/>' + self.option.labels[1] + '</p></div>' +
            '<div class="min-sec"><div  class="minutes"><p><span id="minutes"></span><br/>' + self.option.labels[2] + '</p></div>' +
            '<div  class="seconds"><p><span id="seconds"></span><br/>' + self.option.labels[3] + '</p></div></div>';
        $("#timer").html($timer_html);

    },

    doCountDown: function () {
        var self = this;
        var count = function () {
            setTimeout(function () {
                requestAnimationFrame(count);
                var now = new Date(),
                    secondsDiff = Math.floor((self.launchDate.getTime() - now.getTime()) / 1000);

                var seconds = secondsDiff,
                    minutes = Math.floor(seconds / 60),
                    hours = Math.floor(minutes / 60),
                    days = Math.floor(hours / 24);
                hours %= 24;
                minutes %= 60;
                seconds %= 60;
                self.days.html(Math.max(days, 0));
                self.hours.html(Math.max(hours, 0));
                self.minutes.html(Math.max(minutes, 0));
                self.seconds.html(Math.max(seconds, 0));
            }, 1000);
        };
        count();
    },

    addTweets: function () {
        var self = this;
        //alert(self.option.twitterUser);

        var url = "http://api.twitter.com/1/statuses/user_timeline/" + self.option.twitterUser + ".json?&include_rts=1&callback=?";
        $.getJSON(url, {
            count: self.option.numberTweets
        },

        function (data) {
            if (data && data.length >= 1) {
                $("<section id='tweets' class='tweets'><div id='bird'></div><ul></ul></section>").insertBefore("footer");
                var $base = $("#tweets ul");
                $base.html(format_tweets(data, self.option.twitterUser)).slideDown('2000');
            }
        });
    },

    subscriptions: function () {
        var self = this;
        var added = false;
        if (!Modernizr.input.placeholder) {
            $("input[type='email']").val(self.option.subscriptionInputMessage);
        }
        $("#subscription form").submit(function () {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            var address = $("#email").val(),
                $input = $("input[type='email']");

            //alert(address);
            if (address === "") {
                $input.addClass("error");
            } else {
                if (reg.test(address) === false) {
                    if (!added) {
                        $("<p id='not-valid'>" + self.option.subscriptionInputError + "<p>").hide().insertBefore($input).slideDown("slow");
                        added = true;
                    }
                } else {
                    var form = $(this);
                    $("#not-valid").remove();


                    var formData = $(form).serialize(),
                        note = $('#note');

                    $.ajax({
                        type: "POST",
                        url: "subscribe.php", 
                        data: formData,
                        success: function (response) {
                            if (response === "success" || response === "found") {
                                $(form).find("div").css('display', 'none');
                                if (note.height()) {
                                    note.fadeIn('fast', function () {
                                        $(this).hide();
                                    });
                                } else {
                                    note.hide();
                                }
                            }

                            // Show success or error message.
                            var result = '';
                            switch (response) {
                                case "success":
                                    result = self.option.subscriptionServerMessages[0];
                                    break;
                                case "found":
                                    result = self.option.subscriptionServerMessages[1];
                                    break;
                                default:
                                    result = self.option.subscriptionServerMessages[2];
                                    //+ "  " + response;
                                    break;
                            }
                            note.html(result).slideDown('600');

                        }
                    });

                    return false;
                }
            }
            return false;
        });
    },

    progressBar: function () {
        var self = this;
        var progress = Math.min(Math.max(0, self.option.progress), 100);
        if (self.option.progressCountFrom !== "" && self.secondsDiff) {
            var progressCountFrom = new Date(self.option.progressCountFrom);
            var secondsCountFromDiff = Math.floor((self.launchDate.getTime() - progressCountFrom.getTime()) / 1000);
            progress = Math.floor(100 - self.secondsDiff * (100 - progress) / (secondsCountFromDiff));
        }
        $(".wrapper").after("<div id='progress-bar'></div>");
        $("<span>" + progress + "%</span>").appendTo("#progress-bar").hide();
        $(window).load(function () {
            $("#progress-bar").animate({
                width: progress + "%"
            }, 20 * progress, function () {
                $(this).children("span").fadeIn(1000);
            });
        });
    }

};

function relative_time(time_value) {
    var values = time_value.split(" ");
    time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
    delta = delta + (relative_to.getTimezoneOffset() * 60);

    if (delta < 60) {
        return 'less than a minute ago';
    } else if (delta < 120) {
        return 'about a minute ago';
    } else if (delta < (60 * 60)) {
        return (parseInt(delta / 60, 10)).toString() + ' minutes ago';
    } else if (delta < (120 * 60)) {
        return 'about an hour ago';
    } else if (delta < (24 * 60 * 60)) {
        return 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
    } else if (delta < (48 * 60 * 60)) {
        return '1 day ago';
    } else {
        return (parseInt(delta / 86400, 10)).toString() + ' days ago';
    }
}

function format_tweets(tweets, username) {
    var statusHTML = [];
    for (var i = 0; i < tweets.length; i++) {
        //var username = tweets[i].user.screen_name;
        var status = tweets[i].text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,
            '<a href="$1">$1</a>')
            .replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>')
            .replace(/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2">@$2</a>');
        statusHTML.push('<li><span>' + status + '</span>&nbsp;<a class="more" href="http://twitter.com/' + username + '">' + relative_time(tweets[i].created_at) + '</a></li>');
    }
    return statusHTML.join('');
}


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            },
            timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }


    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());