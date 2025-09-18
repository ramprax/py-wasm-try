(function() {

let overlaySpinnerOff = function() {
    document.getElementById('overlay_spinner').style.display = 'none';
}

let overlaySpinnerOn = function() {
    document.getElementById('overlay_spinner').style.display = 'flex';
}

overlaySpinnerOn();

let loadPythonScript = function(scriptName) {
  return fetch('./py_scripts/'+scriptName, {credentials: 'same-origin', mode: 'cors',})
  .then(response => response.text())
  .then(pythonCode => {
    return pyodide.runPython(pythonCode);
  });
}

let loadPythonScripts = function() {
    return loadPythonScript('wc_gen.py');
}

let utf8_encoder = new TextEncoder();
let utf8_decoder = new TextDecoder();

function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  return btoa(binString);
}

let do_wc_gen = function(input_text_value, repeat, width, height) {
    console.log('Before btoa');
    let b64_utf8_input_text_value = bytesToBase64(utf8_encoder.encode(input_text_value));
    console.log('After btoa');

    let repeatPyBool; // = 'False';
    if(repeat) {
        repeatPyBool = 'True';
    } else {
        repeatPyBool = 'False'
    }

    let repeatArg = 'repeat='+repeatPyBool;
    let widthArg = 'width='+parseInt(width);
    let heightArg = 'height='+parseInt(height);
    let kwArgs = repeatArg + ', ' + widthArg + ', ' + heightArg;

    let pythonCallStr = "wc_gen('''"+b64_utf8_input_text_value+"''', "+kwArgs+")";
    console.log('Calling python: '+pythonCallStr);
    let result = pyodide.runPython(pythonCallStr);
    console.log('After python call to wc_gen()');
    return result;
}

document.getElementById("input_text").onchange = function(e) {
//  alert(this.value);
  document.getElementById("input_choice").value = "text";
  document.getElementById("input_file").value = "";
}

document.getElementById("input_file").onchange = function(e) {
//  alert(this.value);
  document.getElementById("input_choice").value = "file";
  document.getElementById("input_text").value = "";
}

let getInputChoice = function() {
    let input_choice = document.querySelector('input[name="input_choice"]');
    if(input_choice) {
        input_choice = input_choice.value;
        if(input_choice) {
            return input_choice;
        }
    }
    throw new Error('No input choice given: '+input_choice);
}

let getInputText = function(input_choice) {
    let input_text_element = document.getElementById('input_text');
    let input_file_element = document.getElementById('input_file');
    if(input_choice == 'text') {
        let input_text = input_text_element.value;
        return input_text;
    } else if(input_choice == 'file') {
        console.log('input_choice:', input_choice);
        console.log('input_file_element:', input_file_element);
        console.log('files: ', input_file_element.files);
        if(input_file_element.files[0]) {
            return new Promise((resolve, reject) => {
                let fr = new FileReader();
                fr.onprogress = console.log;
                fr.onload = function() {
                    resolve(fr.result);
                }
                fr.onerror = reject;
                fr.readAsBinaryString(input_file_element.files[0]);
            });
        }
        throw new Error('No files selected: '+input_file_element.files);
    }
    throw new Error('Could not understand input choice: '+input_choice);
}

let wcGenHandler = function() {
    let wc_gen_button = document.getElementById('wc_gen_button');
    let input_text_element = document.getElementById('input_text');
    let input_file_element = document.getElementById('input_file');
    let output_image = document.getElementById('output_image');
    let dl_link = document.getElementById('image_dl');

    let repeat_checkbox = document.getElementById('repeat');
    let wc_width_inp = document.getElementById('wc_width');
    let wc_height_inp = document.getElementById('wc_height');
    return function() {
        let onInputText = function(input_text) {
            if(input_text) {
                let repeatVal = repeat_checkbox.checked;
                let wcWidth = wc_width_inp.value;
                let wcHeight = wc_height_inp.value;

                let b64img_str = do_wc_gen(input_text, repeatVal, wcWidth, wcHeight);

                output_image.width = wcWidth;
                output_image.height = wcHeight;
                output_image.src = 'data:image/png;base64,' + b64img_str;
                dl_link.href = 'data:image/png;base64,' + b64img_str;
            }
            wc_gen_button.disabled = false;
            overlaySpinnerOff();
        }
        let onInputTextError = function(err) {
            console.error(err);
            wc_gen_button.disabled = false;
            overlaySpinnerOff();
            alert(err);
        }

        wc_gen_button.disabled = true;
        overlaySpinnerOn();
        (new Promise((resolve, reject) => { resolve(getInputChoice()); })).then(getInputText).then(onInputText).catch(onInputTextError);

        return false;
    }
}
let pyodide = null;
//const qrcode_install_code = `
//    import micropip
//    micropip.install('wordcloud')
//`;

loadPyodide().then((_pyodide) => {
  pyodide = _pyodide;
}).then(() => {
  return pyodide.loadPackage(['matplotlib', 'micropip', 'wordcloud']);
}).then(loadPythonScripts).then(() => {
  //console.log(scriptMap);
  let wc_gen_button = document.getElementById('wc_gen_button');
  wc_gen_button.onclick = wcGenHandler();

  wc_gen_button.disabled = false;
  overlaySpinnerOff();
})
.catch(err => {
    console.log(err);
    alert('Error: '+err);
    let wc_gen_button = document.getElementById('wc_gen_button');
    wc_gen_button.disabled = false;
    overlaySpinnerOff();
});

})();
