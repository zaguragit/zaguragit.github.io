document.head.innerHTML += "<link rel=stylesheet href=status.css>";
fetch("https://status.cafe/users/zagura/status.json")
  .then(r => r.json())
  .then(r => {
    if (!r.content.length)
      return;
    document.getElementById("statuscafe").innerHTML = `
      <div class=header>${r.timeAgo}</div>
      <div class=content>${r.content}</div>`;
  });