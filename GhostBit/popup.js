
function encode(){
    var msg = document.getElementById("message").value;
    var pwd = document.getElementById("password").value;
    var x = document.getElementById("file");
	var src = "";
	console.log("Message: "+msg+", Password: "+pwd);
	var encrytion = CryptoJS.AES.encrypt(msg, pwd);
	console.log("Message: "+encrytion);
	
	if (x.files && x.files[0]) {
        var reader = new FileReader();
		var file = x.files[0];
		
		reader.readAsArrayBuffer(file);
		reader.onloadend = function () {
			
			var arr = reader.result;
			var intArr = new Uint8Array(arr);
		
			var biStr = new Array();
			var i = intArr.length;
			while (i--) { biStr[i] = String.fromCharCode(intArr[i]);  }
			var base64 = window.btoa(biStr.join(''));
			src = "data:image/png;base64,"+base64;
			
			var image = new Image();
			image.onload = function() {
				var canvas = document.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;

				var context = canvas.getContext('2d');
				context.drawImage(image, 0, 0);

				var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				var data = imageData.data;
				
				var arr = asciiToArray(encrytion+"EnD."); // "EnD." is a keyword to mark the end of the message
				for (var i = 0; i < arr.length; i++){
					data[i] = data[i] & 254;	// Set the first bit (least significant bit) to zero
					if (arr[i] > 0){ 			
						data[i]++;				// Set the same bit to 1 if a number is present in the array
					}
				}
				console.log("TEST: "+arrayToAscii(data, pwd));
				
				context.putImageData(imageData, 0, 0);
				src = canvas.toDataURL();
				document.getElementById("image").src = src;
				document.getElementById("response").innerHTML = "<p>Message Encoded!</p>";
				
			};
			image.src = src;
		}
    }	
}


function asciiToArray(str){ // Takes in a string and returns a binary bit array. Each value in the array is a single bit
	
	var arr = new Array();
	var c = 0;
	for(var i = 0; i < str.length*8; i+= 8){
		
		var split = str.charCodeAt(c);
		arr[i  ] = split & 128;				// This bit should rarely be 1 as ascii characters are usually only represented by 7 bits
		split -= arr[i];
		arr[i+1] = split & 64;
		split -= arr[i+1];
		arr[i+2] = split & 32;
		split -= arr[i+2];
		arr[i+3] = split & 16;
		split -= arr[i+3];
		arr[i+4] = split & 8;
		split -= arr[i+4];
		arr[i+5] = split & 4;
		split -= arr[i+5];
		arr[i+6] = split & 2;
		split -= arr[i+6];
		arr[i+7] = split & 1;
		split -= arr[i+7];
		
		// Logging the transformation of a single character
		console.log(str.charCodeAt(c) + " => " + arr[i] + ', ' + arr[i+1] + ', ' + arr[i+2] + ', ' + arr[i+3] + ", " + arr[i+4] + ', ' + arr[i+5] + ', ' + arr[i+6] + ', ' + arr[i+7]);
		c++;
	}
	return arr;
}

function decode(){
    var pwd = document.getElementById("password").value;
    var x = document.getElementById("file");
    var txt = "";
	var src = "";
	
	if (x.files && x.files[0]) {
        var reader = new FileReader();
		var file = x.files[0];
		
		reader.readAsArrayBuffer(file);
		reader.onloadend = function () {
			
			var arr = reader.result;
			var intArr = new Uint8Array(arr);
			var biStr = [];
			var i = intArr.length;
			while (i--) { biStr[i] = String.fromCharCode(intArr[i]);  }
			var base64 = window.btoa(biStr.join(''));
	
	
			src = "data:image/png;base64,"+base64;
			
			var image = new Image();
			image.onload = function() {
				var canvas = document.createElement('canvas');
				canvas.width = image.width;
				canvas.height = image.height;

				var context = canvas.getContext('2d');
				context.drawImage(image, 0, 0);

				var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				var data = imageData.data;

				var ans = arrayToAscii(data, pwd);
				document.getElementById("response").innerHTML = '<p>'+ans+'</p>';
				
				context.putImageData(imageData, 0, 0);
				src = canvas.toDataURL();
				document.getElementById("image").src = src;
			};
			image.src = src;
		}
    }
	
}


function arrayToAscii(arr, pwd){ // Transforms array of bits into a string representing the hidden message
	
	var txt = "";
	var num = 0;
	for(var i = 0; i < arr.length; i+= 8){ // Manually converts binary bits to a decimal number respresnting an ascii code value (i.e. a letter)
		num  = 0;
		num += 128 * (arr[i  ] & 1);
		num += 64  * (arr[i+1] & 1);
		num += 32  * (arr[i+2] & 1);
		num += 16  * (arr[i+3] & 1);
		num += 8   * (arr[i+4] & 1);
		num += 4   * (arr[i+5] & 1);
		num += 2   * (arr[i+6] & 1);
		num += 1   * (arr[i+7] & 1);
		
		if( i > 6000){		// No encrypted messages can be longer than 6000 bits long
			return "Message not found.";
		}else if(txt.includes("EnD.")){
			console.log("Encrypted message: " + txt.substring(0, txt.length-4));
			var msg = "Message: " + CryptoJS.AES.decrypt(txt.substring(0, txt.length-4), pwd).toString(CryptoJS.enc.Utf8);
			if (msg == ""){
				return "Incorrect Password.";
			}
			console.log(msg);
			return msg;
		}else{
			txt += String.fromCharCode(num);
		}
	}
	return txt;
}

function proccess(){
	var slider = document.getElementById('mode');
	if (slider.checked){
		document.getElementById('modeLabel').innerHTML = "<p>Mode: Decode</p>";
		decode();
	}else{
		document.getElementById('modeLabel').innerHTML = "<p>Mode: Encode</p>";
		encode();
	}
}

var buttonEvent = document.getElementById('file');
buttonEvent.addEventListener('change', proccess);

var slideEvent = document.getElementById('mode');
slideEvent.addEventListener('change', proccess);

