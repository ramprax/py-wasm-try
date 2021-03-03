(function(){

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
  input_text_value = btoa(input_text_value);
  return pyodide.runPython('wc_gen(\'\'\''+input_text_value+'\'\'\')');
}

let wcGenTextHandler = function(wc_gen_button, input_text_element, output_image, dl_link) {
  return function() {
    wc_gen_button.disabled = true;
    let b64img_str = do_wc_gen(input_text_element.value);
    output_image.src = 'data:image/png;base64,' + b64img_str;
    dl_link.href = 'data:image/png;base64,' + b64img_str;
    wc_gen_button.disabled = false;
    return false;
  }
}

let wcGenFileHandler = function(wc_gen_button, input_file_element, output_image, dl_link) {
  return function() {
    if(input_file_element.files[0]) {
        wc_gen_button.disabled = true;

        let fr = new FileReader();
        fr.onload = function(evt) {
            let fileString = evt.target.result;
            let b64img_str = do_wc_gen(fileString);

            output_image.src = 'data:image/png;base64,' + b64img_str;
            dl_link.href = 'data:image/png;base64,' + b64img_str;
            wc_gen_button.disabled = false;
        }
        fr.onprogress = console.log;
        fr.onerror = function(err) { wc_gen_button.disabled = false; console.log(err); }
        fr.readAsText(input_file_element.files[0]);
    }

    return false;
  }
}


languagePluginLoader.then(() => {
  return fetch('./packages/wordcloud.js', {credentials: 'same-origin', mode: 'cors',})
}).then(response => {
  console.log(window.location);
  console.log(response);
  let wordcloudUrl = response.url
  return pyodide.loadPackage(['matplotlib', 'micropip', wordcloudUrl]);
}).then(loadPythonScripts).then(() => {
  //console.log(scriptMap);

  let wc_gen_text_button = document.getElementById('wc_gen_text');
  let input_text_element = document.getElementById('input_text');
  let output_text_image = document.getElementById('output_text_image');
  let text_img_dl_link = document.getElementById('text_image_dl');
  wc_gen_text_button.onclick = wcGenTextHandler(wc_gen_text_button, input_text_element, output_text_image, text_img_dl_link);
  wc_gen_text_button.disabled = false;

  let wc_gen_file_button = document.getElementById('wc_gen_file');
  let input_file_element = document.getElementById('input_file');
  let output_file_image = document.getElementById('output_file_image');
  let file_img_dl_link = document.getElementById('file_image_dl');
  wc_gen_file_button.onclick = wcGenFileHandler(wc_gen_file_button, input_file_element, output_file_image, file_img_dl_link);
  wc_gen_file_button.disabled = false;
})
.catch(console.log);


})();
