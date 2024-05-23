// pass the port and url of the server
var channel = geckos({ port: 3000, url: 'http://84.27.19.62' })

var button = document.getElementById('button')
var text = document.getElementById('text')
var list = document.getElementById('list')
var message = document.getElementById('message')

//button.addEventListener('click', function(e) {
//  e.preventDefault()
//})

var appendMessage = function appendMessage(msg) {
  if (list) {
    var li = document.createElement('li')
    li.innerHTML = msg
    list.appendChild(li)
  }
}

channel.onConnect(function(error) {
  if (error) {
    console.error(error.message)
    //message.innerHTML = 'Sorry something went wrong :/'
    appendMessage(error.message)
    return
  } else {
    //message.innerHTML = "You're connected :)"
    console.log("You're connected!")
    setTimeout(function() {
      //message.remove()
    }, 2500)
  }

  channel.emit('chat message', "Hello everyone, I'm " + channel.id)

  channel.onDisconnect(function() {
    console.log('You got disconnected')
  })

  if (button)
    button.addEventListener('click', function(e) {
      if (text) {
        var content = text.value
        if (content && content.trim().length > 0) {
          channel.emit('chat message', content.trim())
          text.value = ''
        }
      }
    })

  channel.on('chat message', function(data) {
    appendMessage(data)
  })
})