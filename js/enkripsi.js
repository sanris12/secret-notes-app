const toggleLock = document.querySelector(".toggle__lock");
const gembok = document.querySelector(".gembok");
const inputPass = document.getElementById("password");
const passx = document.querySelector(".pass__encrypt");
const btnValidate = document.querySelector(".cek__password");

// mengecek apakah nilai isLock ada pada localstorage
if (localStorage.getItem("isLock")) {
  const isLock = localStorage.getItem("isLock");
  if (isLock === "true") {
    lock();
  } else {
    unLock();
  }
} else {
  localStorage.setItem("isLock", "true");
}

// toggle lock
toggleLock.addEventListener("click", () => {
  const isLock = localStorage.getItem("isLock");
  if (isLock === "true") {
    inputPass.style.display = "flex";
  } else {
    const dataLocalStorage = localStorage.getItem("notes");
    const dataNotes = JSON.parse(dataLocalStorage);

    encrypt(dataNotes);

    getShowData();

    localStorage.setItem("isLock", "true");
    lock();
  }
});

// function lock
function lock() {
  toggleLock.classList.add("lock");
  toggleLock.classList.remove("unlock");
  gembok.classList.add("bxs-lock-alt");
  gembok.classList.remove("bxs-lock-open-alt");
}

// functoion unlock
function unLock() {
  toggleLock.classList.remove("lock");
  toggleLock.classList.add("unlock");
  gembok.classList.remove("bxs-lock-alt");
  gembok.classList.add("bxs-lock-open-alt");
}

// fungtion mengenkripsi text
function enkripsText(text) {
  const plaintext = text;
  const textToEncrypt = CryptoJS.enc.Utf8.parse(plaintext);
  const secretKey = "Crypto@321";
  const encrypted = CryptoJS.AES.encrypt(textToEncrypt, secretKey);

  const cyperText = encrypted.toString();
  return cyperText;
}

// function encrypt
function encrypt(dataNotes) {
  const updateNotes = [];

  dataNotes.forEach((note) => {
    const decryptText = note.isi;
    const textToEncrypt = CryptoJS.enc.Utf8.parse(decryptText);
    const secretKey = "Crypto@321";
    const encrypted = CryptoJS.AES.encrypt(textToEncrypt, secretKey);
    const cyperText = encrypted.toString();
    const updateDataEnc = {
      key: note.key,
      judul: note.judul,
      isi: cyperText,
    };

    updateNotes.push(updateDataEnc);
  });

  localStorage.setItem("notes", JSON.stringify(updateNotes));
}

// function decrypt
function decrypt(dataNotes) {
  const updateNotes = [];

  dataNotes.forEach((note) => {
    const enkripsText = note.isi;
    const decrypted = CryptoJS.AES.decrypt(enkripsText, "Crypto@321");
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    const updateDataDek = {
      key: note.key,
      judul: note.judul,
      isi: decryptedText,
    };

    updateNotes.push(updateDataDek);
  });

  localStorage.setItem("notes", JSON.stringify(updateNotes));
}

// funtion mamasukan password
function validasiPassword() {
  const password = localStorage.getItem("pass");
  const decrypted = CryptoJS.AES.decrypt(password, "Crypto@321");
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
  const userPass = passx.value;

  if (userPass === decryptedText) {
    return true;
  } else {
    return false;
  }
}

btnValidate.addEventListener("click", () => {
  // validation
  if (validasiPassword()) {
    // mendekripsi data
    const dataLocalStorage = localStorage.getItem("notes");
    const dataNotes = JSON.parse(dataLocalStorage);

    decrypt(dataNotes);

    getShowData();

    localStorage.setItem("isLock", "false");
    unLock();
    inputPass.style.display = "none";
    passx.value = "";
  } else {
    const alertSalah = document.querySelector(".alert__salah");
    alertSalah.style.display = "block";

    setTimeout(() => {
      alertSalah.style.display = "none";
    }, 2000);
  }
});

document.querySelector(".close__jendela__password").addEventListener("click", () => {
  inputPass.style.display = "none";
});
