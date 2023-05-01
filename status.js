fetch("https://status.cafe/users/zagura/status.json")
  .then( r => r.json() )
  .then( r => {
    if (!r.content.length) {
      document.getElementById("statuscafe-content").innerHTML = "No status yet"
      return
    }
    document.getElementById("statuscafe-header").innerHTML = 'on <a href=https://status.cafe/users/zagura target=_blank>Status Cafe</a>, ' + r.timeAgo
    document.getElementById("statuscafe-content").innerHTML = r.content
  })
