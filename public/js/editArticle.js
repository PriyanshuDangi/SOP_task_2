function link() {
    var url = prompt("Enter the URL");
    document.execCommand("createLink", false, url);
}

function getImage() {
  var file = document.querySelector("input[type=file]").files[0];
  console.log(file)
  if(!file){
    return ;
  }
  if(!file.name.match(/\.(jpg|png|jpeg)$/)){
    return alert("only jpg are accepted");
  }
  if(file.size > 1048576){
    return alert("File is too big! Must be less then 1 mb");
    // this.value = "";
 };
  var reader = new FileReader();

  let dataURI;

  reader.addEventListener(
    "load",
    function() {
      dataURI = reader.result;

      const img = document.createElement("img");
      img.src = dataURI;
      $editor.appendChild(img);
    },
    false
  );

  if (file) {
    console.log("s");
    reader.readAsDataURL(file);
  }
}

function changeColor() {
  var color = prompt("Enter your color in hex ex :#212f31");
  document.execCommand("foreColor", false, color);
}

function fontName() {
  var fontstyle = prompt("Enter your font style ex: Arial");
  document.execCommand("fontName", false, fontstyle);
}

function fontSize() {
  var fontSize = prompt("Enter your fontsize in range (1-7)");
  document.execCommand("fontSize", false, fontSize);
}

const $editor = document.getElementById('editor')
const $title = document.getElementById('title')
const id = document.getElementById('id').textContent
document.querySelector('#submit').addEventListener('click', (e)=>{
    // e.preventDefault()
    console.log('hey')
    var content = $editor.innerHTML
    var title = $title.textContent
    // console.log(content)
    fetch(`/article/edit/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            content 
        })
    }).then((response)=>{
      if(response.status == 200){
        window.location.href = `/article/view/${id}`
      } else{
        alert('unable to edit article')
        window.location.href = `/dashboard`
      }
    }).catch(error=>{
      console.log(error)
    })
})