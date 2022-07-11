const $ = id => document.getElementById(id);

const inputEmail = $('email');
const inputPassword = $('pass');
const button = $('button')

const infoEmail = $('info-email')
const infoPass = $('info-password')

const errorEmail = $('error-email')
const errorPass = $('error-password')

const regExEmail = /^(([^<>()\[\]\,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/
    /* const regExLetras = /^[_A-zA-Z]*((-|\s)*[_A-zA-Z])*$/ */
    /* const regExPassword = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/ */

/* Validation Email */


inputEmail.addEventListener('focus', function() {
    infoEmail.innerText = 'Ejemplo: nombre@email.com'
    
})

inputEmail.addEventListener('keydown', function() {
    infoEmail.innerText = 'Ejemplo: nombre@email.com'
    errorEmail.innerText = null
})

inputEmail.addEventListener('blur', function() {
    switch (true) {
        case !this.value:
            errorEmail.innerText = 'El email es obligatorio';
            infoEmail.innerText = null
            break;
        case !regExEmail.test(this.value):
            errorEmail.innerText = '¡Email invalido!';
            infoEmail.innerText = 'Ejemplo: nombre@email.com'
            break;
        default:
            errorEmail.innerText = null
            infoEmail.innerText = null
            this.classList.add('is-valid')
            break;
    }
})


/* Validation password */

inputPassword.addEventListener('blur', function() {
    if (!this.value) {
        errorPass.innerText = 'La contraseña es obligatoria'
    } else {
        errorPass.innerText = null
        
    }
})

/* button block */

const formulario = $('form-login');

formulario.addEventListener('submit', e => {
    
    e.preventDefault();
     let elementos = [inputEmail, inputPassword]
    let error = false;
    
    for (let i = 0; i < elementos.length; i++) {
        
        if(!elementos[i].value){
            $('error-button').innerText = "Ingresá tus datos";
            error = true;
        }
        
    }

    if(!error){
        formulario.submit()
    }

})