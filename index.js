fetch("https://status.cafe/users/zagura/status.json")
  .then(r => r.json())
  .then(r => {
    if (!r.content.length)
      return;
    document.getElementById("statuscafe").innerHTML = `
      <div class=status-header>${r.timeAgo}:</div>
      <div class=status-content>${r.content}</div>
      <div class=status-face>${r.face}</div>`;
  });