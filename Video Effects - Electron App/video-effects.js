/* Assignment
1. Change the code below to make the dimensions of the two canvases equal to the dimensions of the video element
Hint:
When video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight we should have canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
if(video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight)
{
    canvas.width = video.clientWidth; 
    canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
 } 

2. Implement black&white
Hint: r'=g'=b'=(r+g+b)/3;
3. Implement threshold
Hint: v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0; r’= g’ = b’ = v
4. Implement sephia
Hint: 
r' = (r * .393) + (g *.769) + (b * .189)
g' = (r * .349) + (g *.686) + (b * .168)
b' = (r * .272) + (g *.534) + (b * .131)
5. Implement invert (negative)
Hint: r' = 255 – r; g' = 255 – g; b' = 255 – b;
6. Implement pixelate
Hint: check https://gist.github.com/anonymous/1888841 (the code contains a small mistake ;) )
7. Implement 2Channels
Hint: check https://gist.github.com/anonymous/1888841
8. Implement red
9. Implement green
10. Implement blue
11. Automatically resize the canvas when the size of the video element changes (ex: when the user resizes the browser window, when the user rotates the phone or the tablet)
Hint: 
https://api.jquery.com/resize/
https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onresize
*/

"use strict";

//Note: global letiables should be avoided. Learn more at: https://www.w3.org/wiki/JavaScript_best_practices#Avoid_globals
let effect = "normal";

let video = document.getElementById('video');
let canvas = document.getElementById('canvasProcessed');
let context = canvas.getContext('2d');


let buttons = document.getElementsByClassName("effectType");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
        //Restores the previously saved canvas state
        context.restore();
        //Saves the entire state of the canvas by pushing the current state onto a stack
        context.save();
        //more about the data attribute: https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes
        effect = this.dataset.effect;

    });
}

video.addEventListener('play', function () {
    draw(video, context);
    //TODO add the code for resizing the canvas here     
    if (video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight) {
        canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
        canvas.width = video.clientWidth * video.videoHeight / video.videoHeight;
    }
}, false);

function draw(video, context) {
    if (video.paused || video.ended) {
        return false;
    }

    switch (effect) {
        case "normal":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            break;
        case "rotation":
            let unghi = 3 * Math.PI / 180;
            let ct = Math.cos(unghi), st = Math.sin(unghi);
            let x = video.clientWidth / 2, y = video.clientHeight / 2;
            context.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            context.fillText("Rotation Effect", 10, 10);
            break;
        case "emboss":
            //further reading http://html5doctor.com/video-canvas-magic/
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let pixels = imageData.data;
            let imgDataWidth = imageData.width;

            for (let i = 0; i < pixels.length; i++) {
                if (i % 4 != 3) {
                    pixels[i] = 127 + 2 * pixels[i] - pixels[i + 4] - pixels[i + imgDataWidth * 4];
                }
            }
            context.putImageData(imageData, 0, 0);
            context.fillText("Emboss Effect", 10, 10);
            break;
        case "blackWhite":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let bwimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let bwpixels = bwimageData.data;

            for (let i = 0; i < bwpixels.length; i += 4) {
                const r = bwpixels[i];
                const g = bwpixels[i + 1];
                const b = bwpixels[i + 2];
                const avg = Math.round((r + g + b) / 3);

                bwpixels[i] = bwpixels[i + 1] = bwpixels[i + 2] = avg;
            }
            //process the pixels
            context.putImageData(bwimageData, 0, 0);
            context.fillText("Black and White Effect", 10, 10);
            break;

        case "threshold":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let trimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let trpixels = trimageData.data;

            for (let i = 0; i < trpixels.length; i += 4) {
                let r = trpixels[i];
                let g = trpixels[i + 1];
                let b = trpixels[i + 2];
                // const a=data[i+3];

                const v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 118) ? 255 : 0;
                trpixels[i] = trpixels[i + 1] = trpixels[i + 2] = v;
                //r = g = b = v;
            }

            context.putImageData(trimageData, 0, 0);
            context.fillText("Threshold", 10, 10);
            break;

        case "sephia":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let seimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let sepixels = seimageData.data;

            for (let i = 0; i < sepixels.length; i += 4) {
                const r = sepixels[i];
                const g = sepixels[i + 1];
                const b = sepixels[i + 2];

                sepixels[i] = (r * .393) + (g * .769) + (b * .189);
                sepixels[i + 1] = (r * .349) + (g * .686) + (b * .168);
                sepixels[i + 2] = (r * .272) + (g * .534) + (b * .131);

            }

            context.putImageData(seimageData, 0, 0);
            context.fillText("Sepia", 10, 10);
            break;

        case "invert":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let invimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let invpixels = invimageData.data;

            for (let i = 0; i < invpixels.length; i += 4) {
                const r = invpixels[i];
                const g = invpixels[i + 1];
                const b = invpixels[i + 2];

                invpixels[i] = 255 - r;
                invpixels[i + 1] = 255 - g;
                invpixels[i + 2] = 255 - b;
            }

            context.putImageData(invimageData, 0, 0);
            context.fillText("Invert Colors", 10, 10);
            break;

        case "pixelate":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let piximageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            const blocksize = 15;
            for (let x = 1; x < piximageData.width; x += blocksize) {
                for (let y = 1; y < piximageData.height; y += blocksize) {
                    var pixel = context.getImageData(x, y, 1, 1);
                    context.fillStyle = "rgb(" + pixel.data[0] + "," + pixel.data[1] + "," + pixel.data[2] + ")";
                    context.fillRect(x, y, x + blocksize - 1, y + blocksize - 1);
                }
            }
            context.fillText("Pixelate", 10, 10);
            break;

        case "twoChannels":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let twoimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let twopixels = twoimageData.data;

            for (let i = 0; i < twopixels.length; i += 4) {
                const g = twopixels[i + 1];
                twopixels[i + 2] = g;
            }

            context.putImageData(twoimageData, 0, 0);
            context.fillText("Two Channels", 10, 10);
            break;


        case "red":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let redimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let redpixels = redimageData.data;

            for (let i = 0; i < redpixels.length; i += 4) {
                //const r = data[i];
                //const g = data[i + 1];
                //const b = data[i + 2];
                //data[i] =  r;
                redpixels[i + 1] = 0;
                redpixels[i + 2] = 0;
            }

            context.putImageData(redimageData, 0, 0);
            context.fillText("Red", 10, 10);
            break;

        case "green":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let greenimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let greenpixels = greenimageData.data;

            for (let i = 0; i < greenpixels.length; i += 4) {
                //const r = data[i];
                //const g = data[i + 1];
                //const b = data[i + 2];
                greenpixels[i] = 0; //r
                //data[i + 1] = 0; //g
                greenpixels[i + 2] = 0; //b
            }

            context.putImageData(greenimageData, 0, 0);
            context.fillText("Green", 10, 10);
            break;

        case "blue":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let blueimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let bluepixels = blueimageData.data;

            for (let i = 0; i < bluepixels.length; i += 4) {
                //const r = data[i];
                //const g = data[i + 1];
                //const b = data[i + 2];
                bluepixels[i] = 0; //r
                bluepixels[i + 1] = 0; //g
                //data[i + 2] = 0; //b
            }

            context.putImageData(blueimageData, 0, 0);
            context.fillText("Blue", 10, 10);
            break;
    }

    //The setTimeout() method calls a function or evaluates an expression after a specified number of milliseconds.
    //Tip: 1000 ms = 1 second.
    //66ms ~= 15fps
    setTimeout(draw, 66, video, context);
}

window.addEventListener("resize", () => {

    canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
        canvas.width = video.clientWidth * video.videoHeight / video.videoHeight;

})