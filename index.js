fetch("https://status.cafe/users/zagura/status.json")
  .then(r => r.json())
  .then(r => {
    if (!r.content.length)
      return;
    document.getElementById("statuscafe-face").innerHTML = r.face;
    document.getElementById("statuscafe").innerHTML = `<article id=statuscafe class=status>
      <div class=status-header>on <a class=chill href=https://status.cafe/users/zagura target=_blank>Status Cafe</a>, ${r.timeAgo}</div>
      <div class=status-content>${r.content}</div>
      </article>`;
  });

fetch("https://tech.lgbt/api/v1/accounts/109155032729615779/statuses?exclude_replies=true&exclude_reblogs=true")
  .then(r => r.json())
  .then(r => {
    const post = r[0];
    document.getElementById("fedi").innerHTML = `<article id=fedi class=status>
      <div class=status-header>on <a class=chill href="${post.url}" target=_blank>tech.lgbt</a>, ${new Date(r[0].created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</div>
      <div id=fedi-content class=status-content>${post.content}</div>
      </article>`;
  });