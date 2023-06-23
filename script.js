document.addEventListener("DOMContentLoaded", function () {
  const message = document.getElementById("message");
  const remainingAttempts = document.getElementById("remainingAttempts");
  const attemptedNumbers = document.getElementById("attemptedNumbers");
  const guessInput = document.getElementById("guessInput");
  const guessButton = document.getElementById("guessButton");

  let randomNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  let remaining = 5;
  let numbersAttempted = [];

  guessButton.addEventListener("click", handleGuess);

  // Verifica se já foram feitas 5 tentativas hoje
  const currentDate = new Date().toLocaleDateString();
  // Verifica se há dados salvos no localStorage para a data atual
  const savedData = localStorage.getItem(currentDate);

  if (savedData) {
    const parsedData = JSON.parse(savedData);

    // Restaura os dados salvos nos elementos do DOM
    attemptedNumbers.innerHTML = parsedData.numbersAttempted.join(", ");
    remainingAttempts.innerHTML = parsedData.remainingAttempts;
  }

  const storedDate = localStorage.getItem("guessGameDate");
  let attemptsToday = 0;

  if (storedDate === currentDate) {
    attemptsToday = parseInt(localStorage.getItem("guessGameAttempts")) || 0;
    if (attemptsToday >= 5) {
      guessInput.disabled = true;
      guessButton.disabled = true;
      message.innerHTML =
        "Você atingiu o limite de tentativas para hoje. <br> Tente novamente amanhã.";
    }
  } else {
    localStorage.setItem("guessGameDate", currentDate);
  }

  guessInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      handleGuess();
    }
  });

  guessInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");

    if (this.value !== "") {
      let guess = parseInt(this.value);
      if (guess < 1 || guess > 100) {
        this.classList.add("invalid");
      } else {
        this.classList.remove("invalid");
      }
    } else {
      this.classList.remove("invalid");
    }
  });

  guessInput.focus();

  function handleGuess() {
    if (guessInput.value === "") {
      message.innerHTML = "Por favor, insira um número antes de enviar.";
      return;
    }

    let guess = parseInt(guessInput.value);

    if (guessInput.classList.contains("invalid")) {
      message.innerHTML = "Por favor, insira um número válido entre 1 e 100.";
      guessInput.value = "";
      guessInput.focus();
      return;
    }

    attempts++;

    if (attemptsToday < 5) {
      attemptsToday++;
      remaining--;
      localStorage.setItem("guessGameAttempts", attemptsToday.toString());
      localStorage.setItem("guessGameRemaining", remaining.toString());
    } else {
      message.innerHTML =
        "Você atingiu o limite de tentativas para hoje. Tente novamente amanhã.";
      guessInput.disabled = true;
      guessButton.disabled = true;
      return;
    }

    numbersAttempted.push(guess);
    attemptedNumbers.innerHTML = numbersAttempted.join(", ");

    if (guess === randomNumber) {
      message.innerHTML = `Parabéns! Você acertou em ${attempts} tentativas.`;
      guessInput.disabled = true;
      guessButton.disabled = true;
    } else if (guess < randomNumber) {
      message.innerHTML = "Tente um número maior.";
    } else {
      message.innerHTML = "Tente um número menor.";
    }

    if (remaining === 0) {
      message.innerHTML = `<br>Acabaram as tentativas! O número era ${randomNumber}.`;
      guessInput.disabled = true;
      guessButton.disabled = true;
    } else {
      remainingAttempts.innerHTML = remaining;
    }

    guessInput.value = "";
    guessInput.focus();

    // Salva os dados no localStorage para a data atual
    const dataToSave = {
      numbersAttempted,
      remainingAttempts: remaining,
    };

    localStorage.setItem(currentDate, JSON.stringify(dataToSave));
  }
});

// Obtém os elementos do DOM
const configButton = document.getElementById("configButton");
const configModal = document.getElementById("configModal");
const saveConfigButton = document.getElementById("saveConfigButton");
const languageSelect = document.getElementById("languageSelect");
const themeSelect = document.getElementById("themeSelect");

// Abre o modal ao clicar no botão de configuração
configButton.addEventListener("click", function () {
  configModal.style.display = "block";
});

// Fecha o modal ao clicar no botão de fechar
closeModal.addEventListener("click", function () {
  configModal.style.display = "none";
});

// Fecha o modal ao clicar fora dele (em qualquer área escura)
window.addEventListener("click", function (event) {
  if (event.target === configModal) {
    configModal.style.display = "none";
  }
});

// Fecha o modal ao clicar no botão de salvar
saveConfigButton.addEventListener("click", function () {
  // Obtém as configurações selecionadas pelo usuário
  const selectedLanguage = languageSelect.value;
  const selectedTheme = themeSelect.value;

  // Salva as configurações no localStorage
  localStorage.setItem("language", selectedLanguage);
  localStorage.setItem("theme", selectedTheme);

  // Fecha o modal
  configModal.style.display = "none";
});

// Verifica se há configurações salvas no localStorage ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  const savedLanguage = localStorage.getItem("language");
  const savedTheme = localStorage.getItem("theme");

  // Verifica se existem configurações salvas e define as opções selecionadas nos selects
  if (savedLanguage && savedTheme) {
    languageSelect.value = savedLanguage;
    themeSelect.value = savedTheme;
  }
});
