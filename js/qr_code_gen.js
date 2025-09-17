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
    return loadPythonScript('qr_code_gen.py');
}

let do_qr_code_gen = function(input_text_value, width, height) {
    console.log('Before btoa');
    input_text_value = btoa(input_text_value);
    console.log('After btoa');

    let widthArg = 'width='+parseInt(width);
    let heightArg = 'height='+parseInt(height);
    let kwArgs = widthArg + ', ' + heightArg;

    let pythonCallStr = 'qr_code_gen(\'\'\''+input_text_value+'\'\'\', '+kwArgs+')'
    console.log('Calling python: '+pythonCallStr);
    let result = pyodide.runPython(pythonCallStr);
    console.log('After python call to qr_code_gen()');
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
    let input_choice = document.querySelector('input[name="input_choice"]');  // :checked
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

let qcGenHandler = function() {
    let qr_code_gen_button = document.getElementById('qr_code_gen_button');
    let input_text_element = document.getElementById('input_text');
    let input_file_element = document.getElementById('input_file');
    let output_image = document.getElementById('output_image');
    let dl_link = document.getElementById('image_dl');

    let qr_code_size_inp = document.getElementById('qr_code_size');
    return function() {
        let onInputText = function(input_text) {
            if(input_text) {
                let qcSize = qr_code_size_inp.value;

                let b64img_str = do_qr_code_gen(input_text, qcSize, qcSize);

                output_image.width = qcSize;
                output_image.height = qcSize;
                output_image.src = 'data:image/png;base64,' + b64img_str;
                dl_link.href = 'data:image/png;base64,' + b64img_str;
            }
            qr_code_gen_button.disabled = false;
            overlaySpinnerOff();
        }
        let onInputTextError = function(err) {
            console.error(err);
            qr_code_gen_button.disabled = false;
            overlaySpinnerOff();
            alert(err);
        }

        qr_code_gen_button.disabled = true;
        overlaySpinnerOn();
        (new Promise((resolve, reject) => { resolve(getInputChoice()); })).then(getInputText).then(onInputText).catch(onInputTextError);

        return false;
    }
}

let pyodide = null;
const qrcode_install_code = `
    import micropip
    micropip.install('qrcode')
`;
loadPyodide().then((_pyodide) => {
    pyodide = _pyodide;
}).then(() => {
    return pyodide.loadPackage(['pillow', 'micropip']);
}).then(() => {
    return pyodide.runPythonAsync(qrcode_install_code);
}).then(loadPythonScripts).then(() => {
    //console.log(scriptMap);
    let qr_code_gen_button = document.getElementById('qr_code_gen_button');
    qr_code_gen_button.onclick = qcGenHandler();
    
    qr_code_gen_button.disabled = false;
    overlaySpinnerOff();
}).catch(err => {
    console.log(err);
    alert('Error: '+err);
    let qr_code_gen_button = document.getElementById('qr_code_gen_button');
    qr_code_gen_button.disabled = false;
    overlaySpinnerOff();
});

})();
