
fetch("https://webmention.io/api/count?target=https://zagura.one")
    .then(response => response.json())
    .then(responseJson => {
        let html = `<p>Webmentions: ${responseJson.count}</p>`;
        document.body.querySelector("#mentions").insertAdjacentHTML("beforeend", html);
    });