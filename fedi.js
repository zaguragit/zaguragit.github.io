fetch("https://tech.lgbt/api/v1/accounts/109155032729615779/statuses?exclude_replies=true&exclude_reblogs=true")
  .then(r => r.json())
  .then(r => {
    const post = r[0];
    document.getElementById("fedi-content").innerHTML = post.content;
    document.getElementById("fedi-header").innerHTML = `on <a class=chill href="${post.url}" target=_blank>tech.lgbt</a>, ` + new Date(r[0].created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  });
