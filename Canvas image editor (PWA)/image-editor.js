/* Assignment
1. Implement threshold. Also check how the effect should look like: https://www.google.com/search?q=threshold+photoshop
Hint: v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0; r’= g’ = b’ = v
2. Implement sephia
Hint: 
r' = (r * .393) + (g *.769) + (b * .189)
g' = (r * .349) + (g *.686) + (b * .168)
b' = (r * .272) + (g *.534) + (b * .131)
3. Implement invert (negative)
Hint: r' = 255 – r; g' = 255 – g; b' = 255 – b;
4. Implement red
Hint: r'=r; g'=0; b'=0;
5. Implement green
Hint: r'=0; g'=g; b'=0;
6. Implement blue
Hint: r'=0; g'=0; b'=b;
7. Implement 2Channels
Hint: check https://gist.github.com/anonymous/1888841
8. Make the image darker
Hint: r' = r - v; g' = g - v; b' = b - v;
9. Make the image brighter
Hint: r' = r + v; g' = g + v; b' = b + v;
10. Implement pixelate
Hint: check https://gist.github.com/anonymous/1888841
11. Only display the download link when an effect is applied
12. Implement a color picker.
Hint: 
- check https://github.com/mdn/dom-examples/blob/master/canvas/pixel-manipulation/color-picker.js
- handle the `mousemove` event as use `offsetX` and `offsetY`
- make sure that the color picker continues to work when you reduce the size of the browser window (clientWidth)
13. Display the button for the currently selected effect with a different color.
Hint: use the .classList property and add()/remove() methods or the .className property 
14. (optional) Use Bootstrap for the UI (https://getbootstrap.com/)
15. (optional) Adjust the brightness effect using a slider
16. (optional) Adjust the threshold effect using a slider
17. (optional)Check web workers as a way to perfrom heavy processing without blocking the UI thread
Hint: https://stackoverflow.com/questions/8170431/using-web-workers-for-drawing-using-native-canvas-functions
*/

'use strict';

const app = {
    visibleCanvas: null,
    offscreenCanvas: null,
    donwloadLink: null,
    loader: null,
    currentEffect: null
}

//Drawing methods
/** Changes the effect
 * @param {string} effect - The new effect
 */
app.changeEffect = function (effect) {
    if (effect !== app.currentEffect) {
        app.currentEffect = effect;
        app.drawImage();
    }
}

app.drawImage = function () {

    //show spinner
    app.loader.style.display = 'block';

    //https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
    let t0 = performance.now();
    console.log("t0: " + t0);

    let pContext = app.offscreenCanvas.getContext("2d");
    switch (app.currentEffect) {
        case "normal":
            app.normal(pContext);
            break;
        case "grayscale":
            app.grayscale(pContext);
            break;
        case "red":
            app.red(pContext);
            break;
        case "green":
            app.green(pContext);
            break;
        case "blue":
            app.blue(pContext);
            break;
        case "threshold":
            app.threshold(pContext);
            break;
        case "sephia":
            app.sephia(pContext);
            break;
        case "invert":
            app.invert(pContext);
            break;
        // case "pixelate":
        //     app.pixelate(pContext);
        //     break;
        case "twoChannels":
            app.twoChannels(pContext);
            break;
    }

    let t1 = performance.now();
    console.log(t1 - t0 + ": drawing the image on the canvas");

    app.offscreenCanvas.toBlob(function (blob) {
        let blobUrl = URL.createObjectURL(blob);
        app.donwloadLink.href = blobUrl;
    }, "image/png");

    app.loader.style.display = 'none';
}

app.normal = function (pContext) {
    pContext.drawImage(app.visibleCanvas, 0, 0);
}

app.grayscale = function (pContext) {
    let oContext = app.visibleCanvas.getContext("2d");

    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4)
        data[i] = data[i + 1] = data[i + 2] = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);

    pContext.putImageData(imageData, 0, 0);
}

app.red = function (pContext) {
    let oContext = app.offscreenCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i + 1] = 0;
        data[i + 2] = 0;
    }
    pContext.putImageData(imageData, 0, 0);
}


app.green = function (pContext) {
    let oContext = app.offscreenCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;
        data[i + 2] = 0;
    }
    pContext.putImageData(imageData, 0, 0);
}

app.blue = function (pContext) {
    let oContext = app.offscreenCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;
        data[i + 1] = 0;
    }
    pContext.putImageData(imageData, 0, 0);
}

app.threshold = function (pContext) {
    let oContext = app.offscreenCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        const v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 120) ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = v;
    }
    pContext.putImageData(imageData, 0, 0);
}

app.sephia = function (pContext) {
    let oContext = app.offscreenCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = (r * .393) + (g * .769) + (b * .189);
        data[i + 1] = (r * .349) + (g * .686) + (b * .168);
        data[i + 2] = (r * .272) + (g * .534) + (b * .131);
    }
    pContext.putImageData(imageData, 0, 0);
}

app.invert = function (pContext) {
    let oContext = app.offscreenCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, oContext.canvas.width, oContext.canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = 255 - r;
        data[i + 1] = 255 - g;
        data[i + 2] = 255 - b;
    }
    pContext.putImageData(imageData, 0, 0);
}

// app.pixelate = function (pContext) {
//     let blocksize = 10;
//     let oContext = app.offscreenCanvas.getContext("2d");

//     for(let x = 1; x < app.offscreenCanvas.width; x += blocksize)
//     {
//         for(let y = 1; y < app.offscreenCanvas.height; y += blocksize)
//         {
//             var pixel = oContext.getImageData(x, y, 1, 1);
//             pContext.fillStyle = "rgb("+pixel.data[0]+","+pixel.data[1]+","+pixel.data[2]+")";
//             pContext.fillRect(x, y, x + blocksize - 1, y + blocksize - 1);
//         }
//     }
// }

app.twoChannels = function (pContext) {
    let oContext = app.offscreenCanvas.getContext("2d");
    let imageData = oContext.getImageData(0, 0, app.offscreenCanvas.width, app.offscreenCanvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const g = data[i + 1];
        data[i+2] = g; 
    }
    pContext.putImageData(imageData, 0, 0);
}

//Events
app.load = function () {
    app.visibleCanvas = document.createElement("canvas");
    app.donwloadLink = document.getElementById("donwloadLink");
    app.offscreenCanvas = document.getElementById("visibleCanvas");
    app.loader = document.querySelector('.loader');

    let buttons = document.getElementsByClassName("effectType");
    for (let i = 0; i < buttons.length; i++) {
        //more about the data attribute: https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes
        buttons[i].addEventListener("click", function () { app.changeEffect(this.dataset.effect) });
    }

    document.getElementById("fileBrowser").addEventListener("change", function (e) {
        //1. create the reader
        let reader = new FileReader();
        //2. attach events
        reader.addEventListener('load', function (event) {

            let img = document.createElement("img");
            img.addEventListener("load", function () {
                app.visibleCanvas.width = app.offscreenCanvas.width = img.naturalWidth;
                app.visibleCanvas.height = app.offscreenCanvas.height = img.naturalHeight;

                const context = app.visibleCanvas.getContext("2d");
                context.drawImage(img, 0, 0);

                app.changeEffect("normal");
            });
            img.src = event.target.result;
        });
        //3. start loading the file
        reader.readAsDataURL(e.target.files[0]);
    });
}
