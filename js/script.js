const form = document.getElementById("formulir");
const password = document.querySelector(".password");
const btnSimpanPass = document.querySelector(".simpan__password");
const nulis = document.querySelector(".nulis");

// Memeriksa apakah data dengan key "notes" ada di localStorage
if (localStorage.getItem("notes") && localStorage.getItem("pass")) {
  getShowData();
} else if (localStorage.getItem("notes") && !localStorage.getItem("pass")) {
  // jika password tidak ada
  const alert = document.querySelector(".alert__selamat__datang");
  document.querySelector(".judul__alert").textContent = "tampaknya kamu belum membuat password";

  alert.style.display = "flex";

  btnSimpanPass.addEventListener("click", () => {
    const pass = password.value;
    const passEnkript = enkripsText(pass);
    localStorage.setItem("pass", passEnkript);
    alert.innerHTML = `<h1>Terimakasih aplikasi siap digunakan... 😊</h1>`;
    setTimeout(() => {
      alert.style.display = "none";
    }, 2000);
    getShowData();
  });
} else {
  const alert = document.querySelector(".alert__selamat__datang");

  alert.style.display = "flex";

  const textSambutan =
    "selamat datang di aplikasi catatan rahasia. ini adalah aplikasi catatan rahasia yang dibuat simpel dan aman, semua data akan disimpan di dalam localstorage mu dan akan terenkripsi. kamu akan memerlukan kata sandi untuk setiap kali ingin mendekripsi catatan mu";
  const textSambutanEnc = enkripsText(textSambutan);

  let data = [
    {
      key: "1111111111",
      judul: "selamat datang",
      isi: textSambutanEnc,
    },
  ];

  const dataString = JSON.stringify(data);
  localStorage.setItem("notes", dataString);

  btnSimpanPass.addEventListener("click", () => {
    const pass = password.value;
    const passEnkript = enkripsText(pass);
    localStorage.setItem("pass", passEnkript);
    alert.innerHTML = `<h1>Terimakasih aplikasi siap digunakan... 😊</h1>`;
    setTimeout(() => {
      alert.style.display = "none";
    }, 2000);
    getShowData();
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const key = generateUniqueKey();
  const judul = document.querySelector("#formulir input[type='text']").value;
  const teks = document.querySelector("#formulir textarea").value;

  saveData(key, judul, teks);

  form.reset();
});

// function menyimpan data ke localstorage
function saveData(key, judul, teks) {
  const dataLocalStorage = localStorage.getItem("notes");
  const dataNotes = JSON.parse(dataLocalStorage);
  const textSecret = enkripsText(teks);
  const isLock = localStorage.getItem("isLock");

  if (isLock === "true") {
    const note = {
      key: key,
      judul: judul,
      isi: textSecret,
    };

    dataNotes.push(note);
  } else {
    const note = {
      key: key,
      judul: judul,
      isi: teks,
    };

    dataNotes.push(note);
  }

  const updateData = JSON.stringify(dataNotes);
  localStorage.setItem("notes", updateData);
  getShowData();
}

// funtion mengambil data dari localstorage dan menampilakannya ke layar
function getShowData() {
  const dataLocalStorage = localStorage.getItem("notes");
  const dataNotes = JSON.parse(dataLocalStorage);

  const wadah = document.querySelector(".isi__catatan");
  wadah.innerHTML = "";
  dataNotes.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("card__note");
    div.innerHTML = ` <div class="hapus" data-key=${note.key} onclick="deleteData(event)">x</div>
      <h1>${note.judul}</h1>
      <p>${note.isi}</p>`;

    wadah.appendChild(div);
  });
}

// funtion menghapus data
function deleteData(event) {
  const konfirm = confirm("apakah kamu yakin ingin menhapus data");

  if (konfirm) {
    const clickedElement = event.target;
    const dataKey = clickedElement.getAttribute("data-key");

    const dataLocalStorage = localStorage.getItem("notes");
    const dataNotes = JSON.parse(dataLocalStorage);

    const filterData = dataNotes.filter((note) => note.key !== dataKey);

    const updateData = JSON.stringify(filterData);
    localStorage.setItem("notes", updateData);
    getShowData();
  } else {
    return;
  }
}

// function membuat key unik
function generateUniqueKey() {
  var timestamp = Date.now();
  var random = Math.floor(Math.random() * 10000);
  var uniqueKey = timestamp.toString() + random.toString();
  return uniqueKey;
}

nulis.addEventListener("click", () => {
  const formNotes = document.getElementById("masukan__data");
  const iconNulis = document.querySelector(".icon__nulis");

  iconNulis.classList.toggle("bxs-pencil");
  iconNulis.classList.toggle("bx-x");

  formNotes.classList.toggle("hide");
});
