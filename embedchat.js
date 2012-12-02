
var ec_constants={
	boshurl:"http-bind/",
	username:"ec2-54-251-37-12.ap-southeast-1.compute.amazonaws.com",
	room:"chatbox@conference.ec2-54-251-37-12.ap-southeast-1.compute.amazonaws.com",
	password:null

};

var ec_client={
	brMake: null,
	brVersion: null,
	clientTime:null
};

function ec(){

}



function init(){
	renderWdg();
	ec.prototype.connection=null;
	ec.prototype.connection=new Strophe.Connection(ec_constants.boshurl);
	ec.prototype.connection.connect(ec_constants.username,null,onconnect);

}


function registerStropheLsnrs(){
	ec.prototype.connection.addHandler(handleMsg,null,"message");
}


function handleMsg(msg){

	var text = $(msg).find("body").text();
	appendLog("agent",text);
	return true;
}

function renderWdg(){
	$(document).ready(function(){
		loadStyles();
		$('body').append(buildWdg());

		//Set handler for widget element here
		confchatText();
	});
}

function loadStyles(){
            if (document.createStyleSheet){
                document.createStyleSheet('style.css');
            }
            else {
                $("head").append($("<link rel='stylesheet' href='style.css' type='text/css'/>"));
            }

}


function buildWdg(){
	var wdg=$("<div id='emchat'></div>");
	wdg.append("<div id='header-emchat'></div>");
	wdg.append("<div id='logs-emchat'></div>");
	wdg.append("<input id='text-emchat' type='text'/>");
	//build widget here

	return wdg;
}

function onconnect(status,error){
	if(status==1 || status==3){
		$("#header-emchat").text("Connecting");
	}else if(status==5||status==8){
		$("#header-emchat").text("Connected");
		registerStropheLsnrs();
		join();

	}else{
		$("#header-emchat").text("Not Connected:"+status+" error:"+error);
	}

}

function confchatText(){
	$("#text-emchat").keypress(function(event){
		var txt=$("#text-emchat").val();
		if(event.which==13 && txt!=''){
			processClientMessage(txt);
					}
	});
}

function processClientMessage(txt){
	
	var clientmsg = $msg({to:ec_constants.room,type:"groupchat"}).c("body").t(txt);
	send(clientmsg);
	appendLog("me",txt);
	$("#text-emchat").val('');	

}

function appendLog(who,msg){
	$("#logs-emchat").append("<div>"+who+" : "+msg+"<div>");
}

function getClientDetails(){
	var brMake=navigator.appName;
	var brVersion=parseInt(navigator.appVersion);
	// var clientDet=new ec_client();
	ec_client.brMake=brMake;
	ec_client.brVersion=brVersion;

	return ec_client;
}

function sendClientDetails(){
	var mesg=$msg({to:ec_constants.room,type:"groupchat"}).c("body",{emtype:"command"}).t(JSON.stringify(getClientDetails()));
	send(mesg);
}

function stringifyStanza(stanza){
	return stanza.toString();
}


function getClientRes(){
	//TODO Make better resources
	return Math.random().toString();
}

function send(message){
	ec.prototype.connection.send(message);
}

function join(){
	ec.prototype.connection.send($pres());
	var stJoin=$pres({to:ec_constants.room+'/'+getClientRes()}).c("x",{xmlns:Strophe.NS.MUC});
	send(stJoin);
	sendClientDetails();
}

(init());

/*Connect anonymously to bosh*/