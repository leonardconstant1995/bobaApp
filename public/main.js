const finish = document.getElementsByClassName("fa-thumbs-up");
const trash = document.getElementsByClassName("fa-trash-o");

Array.from(finish).forEach(function(element) {
  element.addEventListener('click', function(){

    const orderID = this.parentNode.parentNode.id
    fetch('order-finish', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        '_id': orderID
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});


Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const orderID = this.parentNode.parentNode.id
        console.log("Order id",orderID)
        fetch('coffeeOrderForm', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            '_id': orderID,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


const synth = window.speechSynthesis;
document.querySelectorAll('.speak').addEventListener('click', run)

function run() {
  const customerName = document.querySelector('.customerName').innerText
  // const fMidName = document.querySelector('#firstMiddle').innerText
  // const lMidName = document.querySelector('#lastMiddle').value
  // const lName = document.querySelector('#lastName').value

  const yellText =  `${customerName}`

  // document.querySelector('#placeToYell').innerText = yellText

  let yellThis = new SpeechSynthesisUtterance(yellText);

  synth.speak(yellThis);
}
