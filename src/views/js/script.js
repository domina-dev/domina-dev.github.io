var USER_IP = undefined;
// Captura o IP ao carregar a página
async function getIPAddress() {
    try {
        // Faz a solicitação a um serviço externo
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        USER_IP = data.ip
    } catch (error) { }
}

// Chama a função ao carregar a página
getIPAddress();

// ---------------------------------------------
// Selecionando todos os links com o atributo href começando com #
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        // Pegando o destino da rolagem
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        // Rolagem suave até o destino
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

function redirectTo() {
    window.open('https://wa.me/48988668130?text=Como%20faço%20para%20me%20inscrever?%0Ahttps://domina.dev/', '_blank');
}

// menu
const toggleButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

// Alterna o menu ao clicar no botão
toggleButton.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Fecha o menu ao clicar em um link
menu.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        menu.classList.remove('active');
    }
});

function limparCampos() {
    document.getElementById('nome').value = "";
    document.getElementById('email').value = "";
    document.getElementById('telefone').value = "";
}

function sendEmail() {
    // Inicialize o EmailJS

    const lastSubmission = localStorage.getItem('lastSubmission');
    const now = Date.now();

    // Permitir envio apenas a cada 5 minutos (300000 ms)
    if (lastSubmission && now - lastSubmission < 300000) {
        alert("Sua solicitação foi recebida com sucesso. Nossa equipe entrará em contato em breve. Verifique seu e-mail para mais informações.");
        return;
    } else {

        localStorage.setItem('lastSubmission', now);
        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = true; // Desabilita o botão

        emailjs.init('2xCH2QUwQR2O6wc3H');

        event.preventDefault(); // Impede o envio padrão do formulário

        // Capture os valores do formulário
        var nome = document.getElementById('nome').value;
        var email = document.getElementById('email').value;
        var telefone = document.getElementById('telefone').value;
        var sexo = document.getElementById('sexo').value;
        var idade = document.getElementById('idade').value;
        var ip = USER_IP;

        // Configurar os dados a serem enviados
        const templateParams = {
            nome: nome,
            email: email,
            telefone: telefone,
            sexo: sexo,
            mensagemBoasVindas: sexo == 'M' ? 'Bem-vindo, Dominador!' : 'Bem-vinda, Dominadora!',
            idade: idade,
            ip: ip
        };
        console.log("templateParams::: ", templateParams);
        console.log("emailjs::: ", emailjs);

        // Enviar o e-mail usando EmailJS
        const serviceGoDaddy = "service_mre974a";
        const templateBemVindo = "template_mbazqqi";
        const templateNovoInteresse = "template_4qpk3nd";
        
        emailjs.send(serviceGoDaddy, templateNovoInteresse, templateParams).then(
            function (response) {
                alert('Formulário enviado com sucesso! Obrigado.');

                //Enviar email para Aluno
                emailjs.send(serviceGoDaddy, templateBemVindo, templateParams).then(
                    function (response) {
                        limparCampos();
                    },
                    function (error) { }
                );
            },
            function (error) {
                alert('Ocorreu um erro ao enviar o formulário. Tente novamente.');
                console.log('Erro:', error);
            }
        ).catch(error => console.error('Erro ao enviar:', error));
    }
}

function validateReCaptcha(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const honeypotField = document.querySelector('input[name="idade"]');
    if (honeypotField.value) {
        // Bloqueia o envio do formulário se o campo honeypot estiver preenchido
        event.preventDefault();
        this.limparCampos();
        alert('Formulário enviado com sucesso! Hack Safado!.');
        window.location.reload();
    } else {
        sendEmail();
    }

    // grecaptcha.ready(function () {
    //     grecaptcha.execute(siteKey, { action: 'LOGIN' }).then(function (token) {
    //         // Dados a serem enviados no corpo da requisição
    //         const requestData = {
    //             event: {
    //                 token: token,
    //                 expectedAction: 'LOGIN',
    //                 siteKey: siteKey,
    //             }
    //         };

    //         // Fazer a requisição POST
    //         fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(requestData),
    //         })
    //             .then(response => {
    //                 if (!response.ok) {
    //                     throw new Error(`Erro: ${response.status}`);
    //                 }
    //                 return response.json();
    //             })
    //             .then(data => {
    //                 if (data.tokenProperties && data.tokenProperties.valid) {
    //                     // Validação bem-sucedida
    //                     alert('reCAPTCHA validado com sucesso!');
    //                     sendEmail(); // Chama o envio do e-mail após validação
    //                 } else {
    //                     // Token inválido
    //                     alert('reCAPTCHA inválido. Tente novamente.');
    //                 }
    //             })
    //             .catch(error => {
    //                 console.error('Erro ao validar o reCAPTCHA:', error);
    //             });
    //     });
    // });
}

// Seleciona os campos do formulário e o botão
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const telefoneInput = document.getElementById('telefone');
const sexoInput = document.getElementById('sexo');
const submitButton = document.getElementById('submitButton');

// Função para verificar se todos os campos estão preenchidos
function checkFormFields() {
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const sexo = sexoInput.value.trim();

    // Verifica se todos os campos estão preenchidos
    if (nome && email && telefone && sexo) {
        submitButton.disabled = false; // Habilita o botão
    } else {
        submitButton.disabled = true; // Desabilita o botão
    }
}

// Adiciona o evento de input para monitorar alterações nos campos
nomeInput.addEventListener('input', checkFormFields);
emailInput.addEventListener('input', checkFormFields);
telefoneInput.addEventListener('input', checkFormFields);
sexoInput.addEventListener('input', checkFormFields);
