console.log('registerValidator Success');
const $ = id => document.getElementById(id);


const formulario = $("formulario-register");


const inputName = $("user");
const inputEmail = $("email")
const inputPassword = $("password");
const inputPassword2 = $("repeatpass")
const checkTerms = $('terminos');
const btnWatch = $('watch');

/* expresiones regulares */
//const regExLetras = /^[_A-zA]*((-|\s)*[_A-zA-Z])*$/
const regExLetras = /^[_A-zA-Z]*((-|\s)*[_A-zA-Z])*[:space:]*$/
const regExEmail = /^(([^<>()\[\]\,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/
const regExPassword =  /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,12}$/ 

/* Name and Surname */
inputName.addEventListener('focus', function()  {
    $("errorUser").innerText = "Solo letras"
    $("errorUser").innerText = null;
    this.classList.remove('is-invalid');
})

inputName.addEventListener('keydown', function() {
    $("info-user").innerText = null;
})

inputName.addEventListener('keyup', function () {
    let [name, surname] =  inputName.value.split(' ')
    switch (true) {
        case this.value.split(' ').length != 2:
            $('errorUser').innerText = "El nombre y apellido es requerido";
            this.classList.add('is-invalid')
            break;
        case this.value.split(' ').length < 2:
            $('errorUser').innerText = "Solo un nombre y apellido";
            this.classList.add('is-invalid')
            break;
        case name.length <= 2 || surname.length <= 2:
            $('errorUser').innerText = "Minimo 3 caracteres por nombre";
            this.classList.add('is-invalid')
            break;
        case !regExLetras.test(this.value.trim()):
            $('errorUser').innerText = "Solo se permiten letras";
            this.classList.add('is-invalid');
            break;
        default:
            $('errorUser').innerText = null;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            break;
    }
    
})

inputName.addEventListener('blur', function () {
    let [name, surname] =  inputName.value.split(' ')
    switch (true) {
        case this.value.split(' ').length != 2:
            $('errorUser').innerText = "El nombre y apellido es requerido";
            this.classList.add('is-invalid')
            break;
        case this.value.split(' ').length < 2:
            $('errorUser').innerText = "Solo un nombre y apellido";
            this.classList.add('is-invalid')
            break;
        case name.length <= 2 || surname.length <= 2:
            $('errorUser').innerText = "Minimo 3 caracteres por nombre";
            this.classList.add('is-invalid')
            break;
        case !regExLetras.test(this.value.trim()):
            $('errorUser').innerText = "Solo se permiten letras";
            this.classList.add('is-invalid');
            break;
        default:
            $('errorUser').innerText = null;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            break;
    }
})

inputName.addEventListener('focus', function () {
    let [name, surname] =  inputName.value.split(' ')
    switch (true) {
        case this.value.split(' ').length != 2:
            $('errorUser').innerText = "El nombre y apellido es requerido";
            this.classList.add('is-invalid')
            break;
        case this.value.split(' ').length < 2:
            $('errorUser').innerText = "Solo un nombre y apellido";
            this.classList.add('is-invalid')
            break;
        case name.length <= 2 || surname.length <= 2:
            $('errorUser').innerText = "Minimo 3 caracteres por nombre";
            this.classList.add('is-invalid')
            break;
        case !regExLetras.test(this.value.trim()):
            $('errorUser').innerText = "Solo se permiten letras";
            this.classList.add('is-invalid');
            break;
        default:
            $('errorUser').innerText = null;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            break;
    }
    
})



/* Email */
inputEmail.addEventListener('focus', function()  {
    $("errorEmail").innerText = "Ingrese un email valido"
    $("errorEmail").innerText = null;
    this.classList.remove('is-invalid');
})

inputEmail.addEventListener('keydown', function() {
    $("info-email").innerText = null;
})

inputEmail.addEventListener('blur', function() {
    switch (true) {
        case !this.value:
            $("errorEmail").innerText ="Campo obligatorio";
            this.classList.add('is-invalid')
            break;
        case !regExEmail.test(this.value) :
            $("errorEmail").innerText = "Email invalido";
            this.classList.add('is-invalid')
            break;
        default:
            $("errorEmail").innerText = null;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            break;
    }
})

/* Password */
inputPassword.addEventListener('focus', function()  {
    $("errorPassw").innerText = "Debe contener una mayúscula, minuscula y al menos un número"
    $("errorPassw").innerText = null;
    this.classList.remove('is-invalid');
})

inputPassword.addEventListener('keydown', function() {
    $("info-passw").innerText = null;
})




inputPassword.addEventListener('blur', function() {
    switch (true) {
        case !this.value:
            $("errorPassw").innerText = "Campo obligatorio";
            this.classList.add('is-invalid')
            break;
        case !regExPassword.test(this.value):
            $("errorPassw").innerText = "Debe contener minúscula, mayúscula, caracter especial y al menos un número";
            this.classList.add('is-invalid')
            break;
        default:
            $("errorPassw").innerText = null;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            break;
    }
})


/*Repeat password*/


inputPassword2.addEventListener('Keyup', function() {
    if(this.value === inputPassword.value){
        console.log(this.value)
         this.classList.remove('is-invalid')
         this.classList.add('is-valid')
    }else{
      this.classList.remove('is-valid')
      $('errorPasw2').innerText = null;
    }
}
)

inputPassword2.addEventListener('blur', function() {
    switch (true) {
        case !this.value:
            $("errorPassw2").innerText ="Debe confirmar su contraseña";
            this.classList.add('is-invalid')
            break;
        case this.value !== inputPassword.value :
            $("errorPassw2").innerText = "Las contraseñas no coinciden";
            this.classList.add('is-invalid')
            break;
        default:
            $("errorPassw2").innerText = null;
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            break;
    }
})
/* Ver contraseña */
/*btnWatch.addEventListener('click', () =>{
    //inputPassword.type === "text" ? inputPassword.type = "password" : inputPassword = "text";
    console.log(inputPassword.type);
})*/

/* terminos */
terminos.addEventListener('click', function(e) {
  this.classList.toggle('is-valid');
  this.classList.remove('is-invalid')
  $('error-terms').innerText = null;
  console.log(e.target.checked);
})



formulario.addEventListener('submit', e => {
    e.preventDefault();
    let error = false;
    const elementos = [inputName, inputEmail, inputPassword, inputPassword2 ]

    for(let i = 0; i < elementos.length; i++) {
        if(!elementos[i].value){
            elementos[i].classList.add('is-invalid');
          // $('error-empty').innerText = "Los campos señalados son obligatorios";
            error = true;

        }
    } 

    if(!terminos.checked){
        terminos.classList.add('is-invalid');
        $('error-terms').innerText = "Debes aceptar terminos y condiciones";
        error = true;
    }

    if(!error){
        formulario.submit()
    }
})