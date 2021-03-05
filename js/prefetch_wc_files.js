(function(){
fetch('./packages/wordcloud.js', {credentials: 'same-origin', mode: 'cors',}).then(console.log).catch(console.error);
fetch('./packages/wordcloud.data', {credentials: 'same-origin', mode: 'cors',}).then(console.log).catch(console.error);
fetch('./py_scripts/wc_gen.py', {credentials: 'same-origin', mode: 'cors',}).then(console.log).catch(console.error);
fetch('./js/wc_gen.js', {credentials: 'same-origin', mode: 'cors',}).then(console.log).catch(console.error);
})();
