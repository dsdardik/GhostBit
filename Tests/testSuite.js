
function encryptionTest(){
	
	var msg = "This is a test message";
	var pwd = "This is a test password";
	var encryption  = CryptoJS.AES.encrypt(msg, pwd);
	var decryption = CryptoJS.AES.decrypt(encryption, pwd).toString(CryptoJS.enc.Utf8);
	return decryption == "This is a test message";
}

