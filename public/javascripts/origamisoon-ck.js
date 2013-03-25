/**
 * Coming soon
 * -----------
 *
 * author: PeHaa Hetman
 * email: info@pehaa.com
 *
 * version 1.0 release date: 12.01.2013
 *
 **/function relative_time(e){var t=e.split(" ");e=t[1]+" "+t[2]+", "+t[5]+" "+t[3];var n=Date.parse(e),r=arguments.length>1?arguments[1]:new Date,i=parseInt((r.getTime()-n)/1e3,10);i+=r.getTimezoneOffset()*60;return i<60?"less than a minute ago":i<120?"about a minute ago":i<3600?parseInt(i/60,10).toString()+" minutes ago":i<7200?"about an hour ago":i<86400?"about "+parseInt(i/3600,10).toString()+" hours ago":i<172800?"1 day ago":parseInt(i/86400,10).toString()+" days ago"}function format_tweets(e,t){var n=[];for(var r=0;r<e.length;r++){var i=e[r].text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>').replace(/(^|\s)#(\w+)/g,'$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>').replace(/(^|\s)@(\w+)/g,'$1<a href="http://twitter.com/$2">@$2</a>');n.push("<li><span>"+i+'</span>&nbsp;<a class="more" href="http://twitter.com/'+t+'">'+relative_time(e[r].created_at)+"</a></li>")}return n.join("")}var origamiSoon={defaults:{launchDate:"",labels:["days","hours","mins","secs"],progress:"20",progressCountFrom:"",twitterUser:"",numberTweets:"3",subscriptionInputMessage:"STAY TUNED ! Enter your email here.",subscriptionInputError:"Please enter a valid email.",subscriptionServerMessages:["You'll hear from us soon. Thanks.","You've already been  on the list. Thanks.","Sorry, we couldn't save your email."]},option:{},init:function(e){var t=this;t.option=$.extend({},t.defaults,e);if(t.option.launchDate!==""){t.launchDate=new Date(t.option.launchDate);t.setCountDown();t.days=$("#days");t.hours=$("#hours");t.minutes=$("#minutes");t.seconds=$("#seconds");t.doCountDown()}t.option.twitterUser!==""&&t.addTweets();t.subscriptions();t.option.progress!==""&&t.progressBar()},setCountDown:function(){var e=this,t=new Date;e.secondsDiff=Math.floor((e.launchDate.getTime()-t.getTime())/1e3);var n='<div  class="days"><p><span id="days"></span><br/>'+e.option.labels[0]+"<p></div>"+'<div  class="hours"><p><span id="hours"></span><br/>'+e.option.labels[1]+"</p></div>"+'<div class="min-sec"><div  class="minutes"><p><span id="minutes"></span><br/>'+e.option.labels[2]+"</p></div>"+'<div  class="seconds"><p><span id="seconds"></span><br/>'+e.option.labels[3]+"</p></div></div>";$("#timer").html(n)},doCountDown:function(){var e=this,t=function(){setTimeout(function(){requestAnimationFrame(t);var n=new Date,r=Math.floor((e.launchDate.getTime()-n.getTime())/1e3),i=r,s=Math.floor(i/60),o=Math.floor(s/60),u=Math.floor(o/24);o%=24;s%=60;i%=60;e.days.html(Math.max(u,0));e.hours.html(Math.max(o,0));e.minutes.html(Math.max(s,0));e.seconds.html(Math.max(i,0))},1e3)};t()},addTweets:function(){var e=this,t="http://api.twitter.com/1/statuses/user_timeline/"+e.option.twitterUser+".json?&include_rts=1&callback=?";$.getJSON(t,{count:e.option.numberTweets},function(t){if(t&&t.length>=1){$("<section id='tweets' class='tweets'><div id='bird'></div><ul></ul></section>").insertBefore("footer");var n=$("#tweets ul");n.html(format_tweets(t,e.option.twitterUser)).slideDown("2000")}})},subscriptions:function(){var e=this,t=!1;Modernizr.input.placeholder||$("input[type='email']").val(e.option.subscriptionInputMessage);$("#subscription form").submit(function(){var n=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,r=$("#email").val(),i=$("input[type='email']");if(r==="")i.addClass("error");else{if(n.test(r)!==!1){var s=$(this);$("#not-valid").remove();var o=$(s).serialize(),u=$("#note");$.ajax({type:"POST",url:"subscribe.php",data:o,success:function(t){if(t==="success"||t==="found"){$(s).find("div").css("display","none");u.height()?u.fadeIn("fast",function(){$(this).hide()}):u.hide()}var n="";switch(t){case"success":n=e.option.subscriptionServerMessages[0];break;case"found":n=e.option.subscriptionServerMessages[1];break;default:n=e.option.subscriptionServerMessages[2]}u.html(n).slideDown("600")}});return!1}if(!t){$("<p id='not-valid'>"+e.option.subscriptionInputError+"<p>").hide().insertBefore(i).slideDown("slow");t=!0}}return!1})},progressBar:function(){var e=this,t=Math.min(Math.max(0,e.option.progress),100);if(e.option.progressCountFrom!==""&&e.secondsDiff){var n=new Date(e.option.progressCountFrom),r=Math.floor((e.launchDate.getTime()-n.getTime())/1e3);t=Math.floor(100-e.secondsDiff*(100-t)/r)}$(".wrapper").after("<div id='progress-bar'></div>");$("<span>"+t+"%</span>").appendTo("#progress-bar").hide();$(window).load(function(){$("#progress-bar").animate({width:t+"%"},20*t,function(){$(this).children("span").fadeIn(1e3)})})}};(function(){var e=0,t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n){window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"]}window.requestAnimationFrame||(window.requestAnimationFrame=function(t,n){var r=(new Date).getTime(),i=Math.max(0,16-(r-e)),s=window.setTimeout(function(){t(r+i)},i);e=r+i;return s});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})})();