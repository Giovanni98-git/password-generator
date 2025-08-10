const lowercaseLetters = ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p", "q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "w", "x", "c", "v", "b", "n"];
const uppercaseLetters = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "W", "X", "C", "V", "B", "N"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const symbols = ["$", "%", "^", "&", "!", "@", "#", ":", ";", "'", ",", ".", ">", "/", "*", "-", "|", "?", "~", "_", "=", "+"];

const rangePassword = document.getElementById('password-length');
const passwordLengthDisplay = document.getElementById('password-length-display');
const websiteInput = document.getElementById('website');
let passwordLength = 12; 
let websiteInputValue = "";

let listsPasswords = []; 
const LOCAL_STORAGE_KEY = 'savedPasswords'; 

function loadSavedPasswords() {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedData) {
    listsPasswords = JSON.parse(savedData);
  } else {
    listsPasswords = [];
  }
  displaySavedPasswords();
}

function saveToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsPasswords));
}

function clearAllPasswords() {
  if (confirm("Voulez-vous vraiment supprimer tous les mots de passe sauvegardés ?")) {
    listsPasswords = [];
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    displaySavedPasswords();
    alert("Tous les mots de passe ont été supprimés.");
  }
}

websiteInput.addEventListener('input', (e) => {
  websiteInputValue = e.target.value;
});

const passwordInput = document.getElementById('password');
const generateButton = document.getElementById('generate-button');
const saveButton = document.getElementById('save-button');
const copyButton = document.getElementById('copy-button');
const savedPasswordsView = document.querySelector('.saved-passwords-view');
savedPasswordsView.innerHTML = `<p class="text-4xl text-gray-200">No saved passwords yet.</p>`;

rangePassword.addEventListener('change', (e) => {
  passwordLength = parseInt(rangePassword.value);
  passwordLengthDisplay.textContent = `${passwordLength} characters`;
});

copyButton.addEventListener('click', () => {
  if (passwordInput.value === "") {
    alert("Veuillez d'abord générer un mot de passe.");
    return;
  }
  navigator.clipboard.writeText(passwordInput.value)
    .then(() => {
      alert("Mot de passe copié dans le presse-papiers !");
    })
    .catch(err => {
      console.error("Échec de la copie du mot de passe : ", err);
      alert("Échec de la copie du mot de passe. Veuillez réessayer.");
    });
});

saveButton.addEventListener('click', () => {
  if (passwordInput.value === "") {
    alert("Veuillez d'abord générer un mot de passe.");
    return;
  }
  if (websiteInputValue === "") {
    alert("Veuillez entrer un nom de site web.");
    return;
  }
  const strengthInfo = getPasswordStrength(passwordInput.value);
  const passwordData = {
    website: websiteInputValue,
    password: passwordInput.value,
    length: passwordInput.value.length,
    strength: strengthInfo.level
  };
  listsPasswords.push(passwordData);
  saveToLocalStorage();
  displaySavedPasswords();
  alert("Mot de passe sauvegardé avec succès !");
  websiteInput.value = "";
  passwordInput.value = "";
});

function getPasswordStrength(password) {
  const length = password.length;
  let typesCount = 0;

  let hasLowercase = false;
  let hasUppercase = false;
  let hasNumber = false;
  let hasSymbol = false;

  for (let char of password) {
    if (lowercaseLetters.includes(char)) {
      hasLowercase = true;
    } else if (uppercaseLetters.includes(char)) {
      hasUppercase = true;
    } else if (numbers.includes(char)) {
      hasNumber = true;
    } else if (symbols.includes(char)) {
      hasSymbol = true;
    }
  }

  if (hasLowercase) typesCount++;
  if (hasUppercase) typesCount++;
  if (hasNumber) typesCount++;
  if (hasSymbol) typesCount++;

  let level, color, textColor, percentage;
  if (length < 8 || typesCount < 2) {
    level = "faible";
    color = "red";
    textColor = "red";
    percentage = 25;
  } else if (length < 16 && typesCount < 3) {
    level = "moyen";
    color = "orange";
    textColor = "orange";
    percentage = 50;
  } else if (length < 25 && typesCount >= 3) {
    level = "fort";
    color = "yellow";
    textColor = "yellow";
    percentage = 75;
  } else {
    level = "très fort";
    color = "green";
    textColor = "green";
    percentage = 100;
  }

  return { level, color, textColor, percentage };
}

function displaySavedPasswords() {
  savedPasswordsView.innerHTML = "";
  if (listsPasswords.length === 0) {
    savedPasswordsView.innerHTML = "<p>No password saved yet.</p>";
    return;
  }
  listsPasswords.forEach((item, index) => {
    const passwordDiv = document.createElement('div');
    passwordDiv.className = "saved-password";
    passwordDiv.innerHTML = `
      <div>
        <h3 class="font-bold text-lg w-full">${item.website}</h3>
        <p class="text-gray-600">Mot de passe : <span class="font-mono">${item.password}</span></p>
        <p class="text-gray-600">Longueur : <span class="font-mono">${item.length}</span></p>
        <p class="text-gray-600">Force : <span class="font-mono">${item.strength}</span></p>
      </div>
      <div>
        <button class="copy-button bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" data-password="${item.password}">Copy</button>
        <button class="delete-button bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-index="${index}">Delete</button> 
      </div>
    `;
    savedPasswordsView.appendChild(passwordDiv);    
    const copyButton = passwordDiv.querySelector('.copy-button');
    copyButton.addEventListener('click', (e) => {
      const passwordToCopy = e.target.getAttribute('data-password');
      navigator.clipboard.writeText(passwordToCopy)
        .then(() => {
          alert("Mot de passe copié dans le presse-papiers !");
        })
        .catch(err => {
          console.error("Échec de la copie du mot de passe : ", err);
          alert("Échec de la copie du mot de passe. Veuillez réessayer.");
        });
    });
    const deleteButton = passwordDiv.querySelector('.delete-button');
    deleteButton.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      listsPasswords.splice(index, 1);
      saveToLocalStorage();
      displaySavedPasswords();
      alert("Mot de passe supprimé avec succès !");
    });
  });

  const clearAllButton = document.createElement('button');
  clearAllButton.className = "clear-all-button bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4";
  clearAllButton.textContent = "Supprimer tous les mots de passe";
  clearAllButton.addEventListener('click', clearAllPasswords);
  savedPasswordsView.appendChild(clearAllButton);
}

loadSavedPasswords();

const generator = () => {
  const selectedTypes = [];
  const uppercaseCheck = document.getElementById("uppercase-check").checked;
  const lowercaseCheck = document.getElementById("lowercase-check").checked;
  const numbersCheck = document.getElementById("numbers-check").checked;
  const symbolsCheck = document.getElementById("symbols-check").checked;

  if (uppercaseCheck) selectedTypes.push(uppercaseLetters);
  if (lowercaseCheck) selectedTypes.push(lowercaseLetters);
  if (numbersCheck) selectedTypes.push(numbers);
  if (symbolsCheck) selectedTypes.push(symbols);

  if (selectedTypes.length === 0) {
    alert("Veuillez sélectionner au moins un type de caractère.");
    return;
  }

  if (passwordLength < 4 || passwordLength > 100) {
    alert("La longueur du mot de passe doit être comprise entre 4 et 100 caractères.");
    return;
  }

  if (passwordLength < selectedTypes.length) {
    alert(`La longueur du mot de passe doit être d'au moins ${selectedTypes.length} pour inclure tous les types sélectionnés.`);
    return;
  }

  const allChars = [].concat(...selectedTypes);
  let passwordArray = selectedTypes.map(type => type[Math.floor(Math.random() * type.length)]);

  for (let i = passwordArray.length; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    passwordArray.push(allChars[randomIndex]);
  }

  passwordArray = passwordArray.sort(() => Math.random() - 0.5);

  const password = passwordArray.join('');
  const strengthInfo = getPasswordStrength(password);
  document.querySelector(".force").style.width = `${strengthInfo.percentage}%`;
  document.querySelector(".force").style.backgroundColor = strengthInfo.color;
  document.querySelector(".force-text").textContent = `Force : ${strengthInfo.level} (${password.length}/100)`;
  document.querySelector(".force-text").style.color = strengthInfo.textColor;

  document.getElementById("password").value = password;
};

generateButton.addEventListener('click', generator);