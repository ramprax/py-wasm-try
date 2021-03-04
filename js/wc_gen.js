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

let do_wc_gen = function(input_text_value) {
    console.log('Before btoa');
    input_text_value = btoa(input_text_value);
    console.log('After btoa');
    result = pyodide.runPython('wc_gen(\'\'\''+input_text_value+'\'\'\')');
    console.log('After python call to wc_gen()');
    return result;
}

let getInputText = function(input_text_element, input_file_element, successFunc, errorFunc) {
    let input_choice = document.querySelector('input[name="input_choice"]:checked').value;
    if(input_choice == 'text') {
        let input_text = input_text_element.value;
        setTimeout(successFunc, 10, input_text);
    } else if(input_choice == 'file') {
        if(input_file_element.files[0]) {
            let fr = new FileReader();
            fr.onload = function(evt) {
                let input_text = evt.target.result;
                setTimeout(successFunc, 10, input_text);
            }
            fr.onprogress = console.log;
            fr.onerror = errorFunc;
            fr.readAsBinaryString(input_file_element.files[0]);
        }
    } else {
        errorFunc('Could not figure out input choice')
    }
}

let wcGenHandler = function() {
    let wc_gen_button = document.getElementById('wc_gen_button');
    let input_text_element = document.getElementById('input_text');
    let input_file_element = document.getElementById('input_file');
    let output_image = document.getElementById('output_image');
    let dl_link = document.getElementById('image_dl');

    return function() {
        let onGetInputText = function(input_text) {
            if(input_text) {
                let b64img_str = do_wc_gen(input_text);
                output_image.src = 'data:image/png;base64,' + b64img_str;
                dl_link.href = 'data:image/png;base64,' + b64img_str;
            }
            wc_gen_button.disabled = false;
            overlaySpinnerOff();
        }
        let onInputTextError = function(err) {
            console.log(err);
            wc_gen_button.disabled = false;
            overlaySpinnerOff();
            alert(err);
        }

        wc_gen_button.disabled = true;
        overlaySpinnerOn();
        getInputText(input_text_element, input_file_element, onGetInputText, onInputTextError);

        return false;
    }
}

languagePluginLoader.then(() => {
  return fetch('./packages/wordcloud.js', {credentials: 'same-origin', mode: 'cors',})
}).then(response => {
  console.log(window.location);
  console.log(response);
  let wordcloudUrl = response.url;
  return pyodide.loadPackage(['matplotlib', 'micropip', wordcloudUrl]);
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
