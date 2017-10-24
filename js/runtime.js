
var MEDIA_EXT = ['mp4', 'm4v', 'm4v', 'webm', 'm4a', 'mp3', 'wav', 'aac', 'ogg', 'oga'];

var connection = null;
(function () {
	function loadCss(filename, filetype)
	{
		let fileref = document.createElement("link");
		fileref.rel = "stylesheet";
		fileref.type = "text/css";
		fileref.href = filename;
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
	function loadScript(url, callback) {
		var script = document.createElement("script")
		script.type = "text/javascript";
		if (script.readyState) { //IE
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else { //Others
			script.onload = function () {
				callback();
			};
		}
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	loadCss("css/font-awesome.min.css");
	loadCss("css/bootstrap.min.css");
	loadCss("css/style.css");
	loadScript("js/jquery-3.2.1.min.js", function () {
		$.prototype.enable = function () {
			$.each(this, function (index, el) {
				$(el).removeAttr('disabled');
			});
		}

		$.prototype.disable = function () {
			$.each(this, function (index, el) {
				$(el).attr('disabled', 'disabled');
			});
		}
		loadScript("js/bootstrap.min.js", function () {
			loadScript("https://diffyheart.herokuapp.com:443/socket.io/socket.io.js", function () {
				loadScript("https://diffyheart.herokuapp.com:443/dist/RTCMultiConnection.js", function () {
					loadScript("js/utils.js", function () {
						connection = new RTCMultiConnection();
						connection.socketURL = 'https://diffyheart.herokuapp.com:443/';
						connection.session = {
							data: true
						};
						connection.sdpConstraints.mandatory = {
							OfferToReceiveAudio: false,
							OfferToReceiveVideo: false
						};
						//connection.iceServers.push(stunlist);
						var roomid = $("#roomid");
						var submitroomid = $("#submitroomid");
						roomid.keyup(function() {
							if(roomid.val().length == 5){
								submitroomid.enable();
							}else{
								submitroomid.disable();
							}
						});
						submitroomid.click(function(){
							submitroomid.addClass("m-progress");
							submitroomid.disable();
							roomid.disable();
							connection.checkPresence(roomid.val(), function(isRoomExists, room) {
								console.log(isRoomExists + " -> " + room);
								if(!isRoomExists) {
									alert("La room n'éxiste pas !");
								}else{
									history.pushState(history.state, null, "#" + room);
									connection.join(room);
									alert("My ID : " + connection .sessionid);
								}
								submitroomid.removeClass("m-progress");
								submitroomid.enable();
								roomid.enable();
							});
						});
						connection.onmessage = function(event) {
							alert(event.userid + ' said: ' + event.data);
						};
						loadScript("js/tilt.jquery.js", function(){

						});
					});
				});
			});	
		});
	});
})();