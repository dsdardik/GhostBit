# GhostBit
Encode pictures with a secret message! GhostBit is a Google Chrome extension that uses Steganography to encode secret messages into image files. Each pixel in a PNG file is made up of 4 attributes; red, green, blue, and alpha (opacity). Each of these properties are represented by a number in the range of 0 to 255 or 00000000 to 11111111 in binary. Small changes in these numbers are undetectable to the human eye, but easily changed in a computer program. Altering a number by the least significant digit (00000000 => 00000001) allows information to be stored in the file without making any changes to the appearance of an image.

Once an image is encrypted it can be sent to privately or publicly and no one besides the receiver would be aware of a hidden message. The receiver can use the same program to scan the least significant bits within the file and recover the text.

To ensure the secruity of this program, the text is encrypted before it is proccessed into the picture. Therefore only receivers who know the password can recover the message and not everyone who downloaded this extension.

## Prerequisites
All you need to get started is to download and install Google Chrome. Then download the source folder.

## Installing
After downloading the source folder go to Settings: Extensions. Drag and drop the folder into your extensions list.

