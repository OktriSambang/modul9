"use strict";
/* ==========================================================================
   MODUL 3 — DASAR DOM & HEADER
   ========================================================================== */

// Mengambil elemen <h1> dari header dan menampilkan isinya di konsol
const judulProfil = document.querySelector("header h1");
if (judulProfil) {
    console.log(judulProfil);
    console.log(judulProfil.textContent);
}
/* ==========================================================================
   MODUL 9 — FETCH API DAN JSON (BASE URL API)
   ========================================================================== */
const BASE = "https://jsonplaceholder.typicode.com";


/* ==========================================================================
   MODUL 9 · B.6 — FUNGSI pesanDariStatus()
   Mengembalikan pesan error yang ramah berdasarkan kode status HTTP.
   Digunakan secara konsisten di seluruh operasi POST, PATCH, dan DELETE
   (Tugas Mandiri 2).
   ========================================================================== */
function pesanDariStatus(status) {
    if (status === 404) return "Data tidak ditemukan di server.";
    if (status === 400) return "Data yang dikirim tidak valid.";
    if (status >= 500) return "Server sedang bermasalah, coba lagi nanti.";
    return "Terjadi kesalahan tidak terduga (status: " + status + ").";
}


/* ==========================================================================
   MODUL 9 · B.2 — FUNGSI kirimKomentarKeServer() (POST)
   Mengirim komentar baru ke server JSONPlaceholder via metode POST.
   Mengembalikan objek JSON dari server yang berisi id komentar baru (B.3).
   ========================================================================== */
async function kirimKomentarKeServer(nama, pesan) {
    const response = await fetch(BASE + "/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nama, body: pesan, postId: 1 }),
    });
    if (!response.ok) {
        throw new Error(pesanDariStatus(response.status));
    }
    return await response.json(); // server membalas data + id baru (B.3)
}


/* ==========================================================================
   MODUL 9 · B.4 — FUNGSI perbaruiLikeKeServer() (PATCH)
   Mengirim pembaruan jumlah like ke server via metode PATCH.
   Menggunakan endpoint /posts/{id} sebagai simulasi.
   ========================================================================== */
async function perbaruiLikeKeServer(postId, jumlahLike) {
    try {
        const response = await fetch(BASE + "/posts/" + postId, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ likes: jumlahLike }),
        });
        if (!response.ok) {
            console.warn("PATCH like gagal: " + pesanDariStatus(response.status));
            return;
        }
        console.log("Like berhasil diperbarui di server (post " + postId + ", likes: " + jumlahLike + ")");
    } catch (error) {
        console.error("Gagal memperbarui like ke server:", error);
    }
}


/* ==========================================================================
   MODUL 9 · B.5 — FUNGSI hapusKomentarDariServer() (DELETE)
   Menghapus komentar dari server via metode DELETE.
   Menggunakan pesanDariStatus() untuk pesan error (B.6).
   ========================================================================== */
async function hapusKomentarDariServer(idKomentar) {
    const response = await fetch(BASE + "/comments/" + idKomentar, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(pesanDariStatus(response.status));
    }
    return true;
}


/* ==========================================================================
   MODUL 9 · B.7 TUGAS MANDIRI 1 — FUNGSI editKomentarKeServer() (PATCH)
   Mengirim pembaruan isi komentar ke server via metode PATCH.
   ========================================================================== */
async function editKomentarKeServer(idKomentar, namaBaru, pesanBaru) {
    const response = await fetch(BASE + "/comments/" + idKomentar, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: namaBaru, body: pesanBaru }),
    });
    if (!response.ok) {
        throw new Error(pesanDariStatus(response.status));
    }
    return await response.json();
}


/* ==========================================================================
   MODUL 9 · B.7 TUGAS MANDIRI 3 — HELPER LOADING TOMBOL
   Menonaktifkan tombol sementara selama operasi async agar tidak terklik
   dua kali. Menyimpan teks asli dan mengembalikannya setelah selesai.
   ========================================================================== */
function nonaktifkanTombol(tombol, teksSementara) {
    if (!tombol) return;
    tombol.disabled = true;
    tombol.dataset.teksAsli = tombol.textContent;
    tombol.textContent = teksSementara || "Memproses...";
    tombol.classList.add("btn-loading");
}

function aktifkanKembaliTombol(tombol, teksKustom) {
    if (!tombol) return;
    tombol.disabled = false;
    tombol.textContent = teksKustom || tombol.dataset.teksAsli || "Tombol";
    tombol.classList.remove("btn-loading");
}


/* ==========================================================================
   VARIABEL MODE EDIT KOMENTAR (Tugas Mandiri 1)
   Menyimpan state apakah form sedang dalam mode edit atau mode kirim baru.
   ========================================================================== */
let modeEditKomentar = false;
let idKomentarDiedit = null;
let elemenKomentarDiedit = null;
/* ==========================================================================
   MODUL 3 TEMA GELAP (DARK MODE) & PERSISTENSI
   ========================================================================== */
const tombolTema = document.querySelector("#btn-tema");

/**
 * Modul 7 · B.2: Mengubah tema tampilan dan menyimpan preferensi ke localStorage
 */
function toggleTema() {
    const temaGelapAktif = document.body.classList.toggle("dark-mode");
    if (tombolTema) {
        tombolTema.setAttribute("aria-pressed", String(temaGelapAktif));
        tombolTema.textContent = temaGelapAktif ? "Mode Terang" : "Mode Gelap";
    }

    const temaSekarang = temaGelapAktif ? "dark" : "light";
    try {
        localStorage.setItem("tema", temaSekarang);
    } catch (e) {
        console.error("Gagal menyimpan tema ke localStorage:", e);
    }
}

if (tombolTema) {
    tombolTema.addEventListener("click", toggleTema);
}

/**
 * Modul 7 · B.3: Memuat ulang tema dari localStorage saat halaman dibuka
 */
function muatPreferensiTema() {
    try {
        const tema = localStorage.getItem("tema");
        if (tema === "dark") {
            document.body.classList.add("dark-mode");
            if (tombolTema) {
                tombolTema.setAttribute("aria-pressed", "true");
                tombolTema.textContent = "Mode Terang";
            }
        } else if (tema === "light") {
            document.body.classList.remove("dark-mode");
            if (tombolTema) {
                tombolTema.setAttribute("aria-pressed", "false");
                tombolTema.textContent = "Mode Gelap";
            }
        }
    } catch (e) {
        console.error("Gagal memuat preferensi tema dari localStorage:", e);
    }
}
muatPreferensiTema();


/* ==========================================================================
   MODUL 3 · B.4 & MODUL 7 · B.7 — ELEMEN ASIDE (TAMPIL/SEMBUNYI & PERSISTENSI)
   ========================================================================== */
const tombolKontak = document.querySelector("#btn-kontak");
const sectionKontak = document.querySelector("#kontak");

/**
 *  Memuat status tampil/sembunyi aside dari localStorage
 */
function muatPreferensiAside() {
    try {
        const statusAside = localStorage.getItem("asideTampil");
        if (statusAside !== null && sectionKontak && tombolKontak) {
            const isTampil = statusAside === "true";
            if (isTampil) {
                sectionKontak.classList.remove("tersembunyi");
                tombolKontak.setAttribute("aria-expanded", "true");
                tombolKontak.textContent = "Sembunyikan Kontak";
            } else {
                sectionKontak.classList.add("tersembunyi");
                tombolKontak.setAttribute("aria-expanded", "false");
                tombolKontak.textContent = "Tampilkan Kontak";
            }
        }
    } catch (e) {
        console.error("Gagal memuat preferensi aside dari localStorage:", e);
    }
}
muatPreferensiAside();

if (tombolKontak && sectionKontak) {
    tombolKontak.addEventListener("click", () => {
        const kontakTersembunyi = sectionKontak.classList.toggle("tersembunyi");
        const isTampil = !kontakTersembunyi;
        tombolKontak.setAttribute("aria-expanded", String(isTampil));
        tombolKontak.textContent = kontakTersembunyi ? "Tampilkan Kontak" : "Sembunyikan Kontak";

        // Simpan status tampil aside ke localStorage
        try {
            localStorage.setItem("asideTampil", String(isTampil));
        } catch (e) {
            console.error("Gagal menyimpan status aside ke localStorage:", e);
        }
    });
}


/* ==========================================================================
   MODUL 3 · B.4 & MODUL 7 · B.4 — PORTOFOLIO / ARTIKEL & JUMLAH LIKE
   MODUL 9 · B.2-B.5 — DATA PENGALAMAN DARI API (FETCH + JSON)
   ========================================================================== */

// Modul 9 · B.3: Data statis Modul 3 DINONAKTIFKAN (diganti data dari API).
// Array di bawah kini hanya menampung item yang ditambahkan lewat form "Tambah Pengalaman".
const daftarPengalaman = [];

/* Data statis Modul 3 (dinonaktifkan, disimpan sebagai arsip)
const dataStatisModul3 = [
    {
        judul: "CO Lektor - Komunitas Paingan",
        periode: "Februari 2026 - Sekarang",
        deskripsi: "Komunitas Paingan merupakan komunitas Katolik di bawah Campus Ministry USD."
    },
    {
        judul: "Anggota Divisi Konsumsi - IT Days 2026",
        periode: "Mei 2026 - Oktober 2026",
        deskripsi: "IT Days 2026 merupakan acara tahunan Program Studi Informatika USD."
    },
    {
        judul: "Anggota Divisi Perlengkapan - Wayangan 2026",
        periode: "September 2026 - November 2026",
        deskripsi: "Kepanitiaan Wayangan 2026 menyelenggarakan pagelaran seni budaya wayang."
    }
];
*/

const containerPengalaman = document.querySelector(".daftar-artikel");

/**
 * Modul 7 · B.4: Helper mengambil data semuaLike dari localStorage dengan aman
 */
function getSemuaLike() {
    try {
        return JSON.parse(localStorage.getItem("semuaLike")) || {};
    } catch (e) {
        console.error("Data like di localStorage rusak, mereset:", e);
        return {};
    }
}

/**
 * Modul 7 · B.4: Menyimpan jumlah like per judul artikel ke localStorage
 */
function simpanLike(judulArtikel, jumlah) {
    try {
        const semuaLike = getSemuaLike();
        semuaLike[judulArtikel] = jumlah;
        localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
    } catch (e) {
        console.error("Gagal menyimpan like ke localStorage:", e);
    }
}

/**
 * Fungsi render kartu pengalaman ke DOM
 */
function renderPengalaman(data) {
    if (!containerPengalaman) return;

    const article = document.createElement("article");

    // Modul 9 · B.4: Simpan postId di dataset agar bisa dipakai untuk PATCH like
    if (data.postId) {
        article.dataset.postId = data.postId;
    }

    // Buat h3 judul pengalaman
    const judul = document.createElement("h3");
    judul.textContent = data.judul;

    // Buat paragraf periode
    const periode = document.createElement("p");
    periode.textContent = "Periode: " + data.periode;

    // Buat paragraf deskripsi
    const deskripsi = document.createElement("p");
    deskripsi.textContent = data.deskripsi;

    // Modul 7 · B.4: Muat jumlah like yang tersimpan untuk artikel ini
    const semuaLike = getSemuaLike();
    const jumlahLike = semuaLike[data.judul] || 0;

    // Tombol Like
    const tombolLike = document.createElement("button");
    tombolLike.type = "button";
    tombolLike.className = "btn-like";
    tombolLike.dataset.like = String(jumlahLike);
    tombolLike.textContent = `Like (${jumlahLike})`;

    // Tombol Hapus Artikel
    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.dataset.aksi = "hapus";
    tombolHapus.textContent = "Hapus";

    // Wadah aksi agar rapi
    const wadahAksi = document.createElement("div");
    wadahAksi.className = "aksi-kartu";
    wadahAksi.appendChild(tombolLike);
    wadahAksi.appendChild(tombolHapus);

    // Rangkai elemen ke dalam article
    article.appendChild(judul);
    article.appendChild(periode);
    article.appendChild(deskripsi);
    article.appendChild(wadahAksi);

    containerPengalaman.appendChild(article);
}


/* ==========================================================================
   MODUL 9 · B.2-B.5 — FETCH ARTIKEL DARI API (JSONPlaceholder)
   Mengganti/menambah data artikel statis dengan data dari REST API publik.
   Dilengkapi indikator loading spinner (B.7) dan penanganan error (B.5).
   ========================================================================== */

/**
 * Modul 9 · B.2: Fetch dasar ke console untuk menguji koneksi API.
 * Buka DevTools > Console (array 3 objek post) dan Network (status 200).
 * Boleh dihapus setelah screenshot bukti diambil.
 */
async function ujiFetch() {
    const response = await fetch(BASE + "/posts?_limit=3");
    const data = await response.json();
    console.log(data);
}
ujiFetch();

/**
 * Modul 9 · B.5: URL endpoint artikel.
 * Untuk menguji penanganan error, buka halaman dengan tambahan "?uji=error"
 * (contoh: profil_diri_255314015.html?uji=error) sehingga URL API sengaja salah (404).
 */
const modeUjiError = new URLSearchParams(window.location.search).get("uji") === "error";
const URL_ARTIKEL = BASE + (modeUjiError ? "/postsxyz" : "/posts") + "?_limit=5";

/**
 * Modul 9 · B.7 (Tugas Mandiri): Tampilkan/sembunyikan indikator loading spinner
 */
function tampilkanLoading(idElemen) {
    const el = document.querySelector("#" + idElemen);
    if (el) el.classList.remove("tersembunyi");
}

function sembunyikanLoading(idElemen) {
    const el = document.querySelector("#" + idElemen);
    if (el) el.classList.add("tersembunyi");
}

/**
 * Modul 9 · B.5: Tampilkan pesan error fetch yang ramah di halaman
 */
function tampilkanErrorFetch(pesan) {
    const el = document.querySelector("#pesan-error-fetch");
    if (el) {
        el.textContent = pesan;
        el.classList.remove("tersembunyi");
    }
}

function sembunyikanErrorFetch() {
    const el = document.querySelector("#pesan-error-fetch");
    if (el) {
        el.textContent = "";
        el.classList.add("tersembunyi");
    }
}

/**
 * Modul 9 · B.3: Fungsi utama mengambil data artikel dari API
 * B.4: Indikator loading
 * B.5: Penanganan error (try-catch + cek response.ok)
 * B.7: Spinner CSS (bukan teks polos)
 */
async function muatArtikelDariAPI() {
    tampilkanLoading("loading");             // B.4 & B.7: Tampilkan spinner
    sembunyikanErrorFetch();

    try {
        const response = await fetch(URL_ARTIKEL);

        // B.5: Cek status HTTP — fetch tidak otomatis melempar error pada 404
        if (!response.ok) {
            throw new Error("HTTP Error — Status: " + response.status);
        }

        const daftarPost = await response.json();   // Ubah JSON → array objek

        // Render setiap post dari API sebagai kartu artikel
        daftarPost.forEach((post) => {
            const dataArtikel = {
                judul: post.title,
                periode: "Post ID: " + post.id + " | User ID: " + post.userId,
                deskripsi: post.body,
                postId: post.id   // Modul 9 · B.4: simpan postId untuk PATCH like
            };
            renderPengalaman(dataArtikel);
        });

    } catch (error) {
        // B.5: Tangani kegagalan (network error maupun HTTP error)
        tampilkanErrorFetch("Gagal memuat artikel dari API. Silakan coba lagi nanti. (" + error.message + ")");
        console.error("Gagal mengambil data artikel dari API:", error);
    } finally {
        // B.4: Selalu matikan loading, baik berhasil maupun gagal
        sembunyikanLoading("loading");
    }
}


if (containerPengalaman) {
    // Modul 9 · B.3: forEach data statis Modul 3 dinonaktifkan, diganti data dari API
    // daftarPengalaman.forEach(renderPengalaman);
    muatArtikelDariAPI();

    containerPengalaman.addEventListener("mouseover", (e) => {
        const article = e.target.closest("article");
        if (article) article.classList.add("artikel-hover");
    });

    containerPengalaman.addEventListener("mouseout", (e) => {
        const article = e.target.closest("article");
        if (article) article.classList.remove("artikel-hover");
    });

    // Modul 4 · B.3 & Modul 7 · B.4: Event delegation klik pada container kartu
    containerPengalaman.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        // Tangani klik tombol Like
        if (target.tagName === "BUTTON" && (target.classList.contains("btn-like") || target.textContent.startsWith("Like"))) {
            let jumlah = parseInt(target.dataset.like || "0", 10);
            jumlah++;
            target.dataset.like = String(jumlah);
            target.textContent = `Like (${jumlah})`;

            // Ambil judul artikel terdekat dan simpan ke localStorage
            const article = target.closest("article");
            if (article) {
                const h3 = article.querySelector("h3");
                const judulArtikel = h3 ? h3.textContent.trim() : "";
                if (judulArtikel) {
                    simpanLike(judulArtikel, jumlah);
                }

                // Modul 9 · B.4: Kirim pembaruan like ke server via PATCH
                const postId = article.dataset.postId;
                if (postId) {
                    perbaruiLikeKeServer(postId, jumlah);
                }
            }
            return;
        }

        // Tangani klik tombol Hapus artikel
        const tombolHapus = target.closest('button[data-aksi="hapus"]');
        if (!tombolHapus || !containerPengalaman.contains(tombolHapus)) return;

        const artikel = tombolHapus.closest("article");
        if (!artikel) return;

        // Hapus juga dari array item buatan sendiri (jika ada), berdasarkan judul
        const h3Hapus = artikel.querySelector("h3");
        const judulHapus = h3Hapus ? h3Hapus.textContent.trim() : "";
        const idx = daftarPengalaman.findIndex((p) => p.judul === judulHapus);
        if (idx !== -1) {
            daftarPengalaman.splice(idx, 1);
        }
        artikel.remove();
    });

    // Form Tambah Pengalaman (Modul 4)
    const tombolTambah = document.querySelector("#btn-tambah");
    const formPengalaman = document.querySelector("#form-pengalaman");

    if (tombolTambah && formPengalaman) {
        tombolTambah.addEventListener("click", () => {
            const formTersembunyi = formPengalaman.classList.toggle("tersembunyi");
            tombolTambah.setAttribute("aria-expanded", String(!formTersembunyi));
            tombolTambah.textContent = formTersembunyi ? "Tambah Pengalaman" : "Tutup Form";
        });

        formPengalaman.addEventListener("submit", (e) => {
            e.preventDefault();

            const dataForm = new FormData(formPengalaman);
            const judul = String(dataForm.get("judul") ?? "").trim();
            const periode = String(dataForm.get("periode") ?? "").trim();
            const deskripsi = String(dataForm.get("deskripsi") ?? "").trim();

            if (!judul || !periode || !deskripsi) {
                const kolomKosong = Array.from(formPengalaman.querySelectorAll("input, textarea"))
                    .find((kolom) => !kolom.value.trim());
                if (kolomKosong) {
                    kolomKosong.setCustomValidity("Bagian ini wajib diisi.");
                    kolomKosong.reportValidity();
                    kolomKosong.addEventListener("input", () => {
                        kolomKosong.setCustomValidity("");
                    }, { once: true });
                }
                return;
            }

            const itemBaru = { judul, periode, deskripsi };
            daftarPengalaman.push(itemBaru);
            renderPengalaman(itemBaru);

            formPengalaman.reset();
            formPengalaman.classList.add("tersembunyi");
            tombolTambah.setAttribute("aria-expanded", "false");
            tombolTambah.textContent = "Tambah Pengalaman";
        });
    }
}


/* ==========================================================================
   MODUL 4, 5, 7 — KOMENTAR, VALIDASI, PERSISTENSI JSON & DRAFT SESSIONSTORAGE
   MODUL 9 · B.7 — KOMENTAR AWAL DARI API /posts/1/comments
   ========================================================================== */

const formKomentar = document.querySelector("#form-komentar");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");
const daftarKomentar = document.querySelector("#daftar-komentar");
const pesanErrorKomentar = document.querySelector("#pesan-error-komentar");
const btnKirimKomentar = document.querySelector("#btn-kirim-komentar");
const btnBatalEdit = document.querySelector("#btn-batal-edit");
const btnHapusSemuaKomentar = document.querySelector("#btn-hapus-semua-komentar");

function tampilkanErrorKomentar(teks) {
    if (pesanErrorKomentar) {
        pesanErrorKomentar.textContent = teks;
        pesanErrorKomentar.classList.remove("tersembunyi");
    }
}

function sembunyikanErrorKomentar() {
    if (pesanErrorKomentar) {
        pesanErrorKomentar.textContent = "";
        pesanErrorKomentar.classList.add("tersembunyi");
    }
}

/**
 * Modul 7 · B.5: Helper mengambil data komentar dari localStorage dengan aman
 */
function getDaftarKomentar() {
    try {
        return JSON.parse(localStorage.getItem("komentar")) || [];
    } catch (e) {
        console.error("Data komentar di localStorage rusak, mereset:", e);
        return [];
    }
}

/**
 * Modul 7 · B.5 & Modul 9 · B.3: Menyimpan komentar baru ke localStorage termasuk id server
 */
function simpanKomentar(nama, pesan, id) {
    try {
        const daftar = getDaftarKomentar();
        daftar.push({ id, nama, pesan });
        localStorage.setItem("komentar", JSON.stringify(daftar));
    } catch (e) {
        console.error("Gagal menyimpan komentar ke localStorage:", e);
    }
}

/**
 * Modul 9 · B.7 Tugas Mandiri 1: Memperbarui komentar di localStorage berdasarkan id
 */
function perbaruiKomentarDiStorage(id, namaBaru, pesanBaru) {
    try {
        const daftar = getDaftarKomentar();
        const index = daftar.findIndex((k) => String(k.id) === String(id));
        if (index !== -1) {
            daftar[index].nama = namaBaru;
            daftar[index].pesan = pesanBaru;
            localStorage.setItem("komentar", JSON.stringify(daftar));
        }
    } catch (e) {
        console.error("Gagal memperbarui komentar di localStorage:", e);
    }
}

/**
 * Modul 9 · B.5: Menghapus komentar dari localStorage berdasarkan id
 */
function hapusKomentarDariStorage(id) {
    try {
        const daftar = getDaftarKomentar();
        const index = daftar.findIndex((k) => String(k.id) === String(id));
        if (index !== -1) {
            daftar.splice(index, 1);
            localStorage.setItem("komentar", JSON.stringify(daftar));
        }
    } catch (e) {
        console.error("Gagal menghapus komentar dari localStorage:", e);
    }
}

/**
 * Modul 9 · B.7 Tugas Mandiri 1: Membatalkan mode edit dan mereset form ke kondisi awal
 */
function batalkanModeEdit() {
    modeEditKomentar = false;
    idKomentarDiedit = null;
    elemenKomentarDiedit = null;
    if (btnKirimKomentar) {
        btnKirimKomentar.textContent = "Kirim Komentar";
    }
    if (btnBatalEdit) {
        btnBatalEdit.classList.add("tersembunyi");
    }
    if (formKomentar) {
        formKomentar.reset();
    }
    hapusDraftKomentar();
    sembunyikanErrorKomentar();
}

if (btnBatalEdit) {
    btnBatalEdit.addEventListener("click", batalkanModeEdit);
}

/**
 * Helper membuat elemen <li> komentar dengan format yang konsisten
 * Modul 9 · B.3: Menerima parameter opsional `id` dari server untuk dataset.id
 * Modul 9 · B.7 Tugas Mandiri 1: Menambahkan tombol "Edit" pada setiap komentar
 */
function buatElemenKomentar(nama, pesan, id) {
    const itemKomentar = document.createElement("li");

    // Modul 9 · B.3: Simpan id komentar dari server di dataset
    if (id !== undefined && id !== null) {
        itemKomentar.dataset.id = id;
    }

    const kontenKomentar = document.createElement("div");
    kontenKomentar.className = "konten-komentar";

    const labelNama = document.createElement("span");
    labelNama.className = "nama-pengirim";
    labelNama.textContent = nama;

    const labelPesan = document.createElement("span");
    labelPesan.className = "teks-pesan";
    labelPesan.textContent = pesan;

    kontenKomentar.appendChild(labelNama);
    kontenKomentar.appendChild(labelPesan);

    // Wadah tombol aksi komentar (Edit + Hapus)
    const wadahTombol = document.createElement("div");
    wadahTombol.className = "wadah-tombol-komentar";

    // Modul 9 · B.7 Tugas Mandiri 1: Tombol Edit komentar
    const tombolEditKomentar = document.createElement("button");
    tombolEditKomentar.type = "button";
    tombolEditKomentar.className = "btn-edit-komentar";
    tombolEditKomentar.textContent = "Edit";

    const tombolHapusKomentar = document.createElement("button");
    tombolHapusKomentar.type = "button";
    tombolHapusKomentar.className = "btn-hapus-komentar";
    tombolHapusKomentar.textContent = "Hapus";

    wadahTombol.appendChild(tombolEditKomentar);
    wadahTombol.appendChild(tombolHapusKomentar);

    itemKomentar.appendChild(kontenKomentar);
    itemKomentar.appendChild(wadahTombol);

    return itemKomentar;
}

/**
 * Modul 7 · B.5: Memuat seluruh komentar tersimpan ke <ul id="daftar-komentar">
 * Modul 9 · B.3: Menyertakan id komentar dari server (dataset.id)
 */
function muatKomentar() {
    if (!daftarKomentar) return;
    daftarKomentar.innerHTML = "";
    const daftar = getDaftarKomentar();
    daftar.forEach((k) => {
        const li = buatElemenKomentar(k.nama, k.pesan, k.id);
        daftarKomentar.appendChild(li);
    });
}


/* ==========================================================================
   MODUL 9 · B.7 (TUGAS MANDIRI): KOMENTAR AWAL DARI API /posts/1/comments
   Mengambil data komentar sungguhan dari endpoint JSONPlaceholder
   dan menampilkannya sebagai daftar komentar awal di halaman.
   ========================================================================== */

/**
 * Modul 9 · B.7: Mengambil komentar dari API dan menampilkan di daftar komentar
 * Dibungkus try-catch dengan pesan error yang jelas bagi pengguna
 */
async function muatKomentarDariAPI() {
    tampilkanLoading("loading-komentar");    // Tampilkan spinner komentar

    try {
        const response = await fetch(BASE + "/posts/1/comments");

        // Cek status HTTP — pastikan response berhasil
        if (!response.ok) {
            throw new Error("HTTP Error — Status: " + response.status);
        }

        const daftarKomentarAPI = await response.json();

        // Render komentar dari API ke daftar komentar
        if (daftarKomentar) {
            daftarKomentarAPI.forEach((komentar) => {
                const li = buatElemenKomentar(komentar.name, komentar.body, komentar.id);
                // Tandai sebagai komentar dari API agar bisa dibedakan
                li.classList.add("komentar-api");
                daftarKomentar.appendChild(li);
            });
        }

        console.log("Berhasil memuat " + daftarKomentarAPI.length + " komentar dari API.");

    } catch (error) {
        // Tampilkan pesan error yang jelas bagi pengguna
        if (daftarKomentar) {
            const liError = document.createElement("li");
            liError.className = "komentar-error";
            liError.textContent = "Gagal memuat komentar dari API. (" + error.message + ")";
            daftarKomentar.appendChild(liError);
        }
        console.error("Gagal mengambil komentar dari API:", error);
    } finally {
        // Selalu matikan loading
        sembunyikanLoading("loading-komentar");
    }
}

// Render komentar tersimpan (localStorage) terlebih dahulu, lalu muat dari API
muatKomentar();
muatKomentarDariAPI();


/* ==========================================================================
   MODUL 9 · B.6 — PROFIL PENULIS DINAMIS DARI ENDPOINT /users/1
   ========================================================================== */
async function muatProfilPenulis() {
    const namaEl = document.querySelector("#nama-penulis");
    const emailEl = document.querySelector("#email-penulis");
    if (!namaEl || !emailEl) return;

    try {
        const response = await fetch(BASE + "/users/1");
        if (!response.ok) {
            throw new Error("HTTP Error — Status: " + response.status);
        }
        const user = await response.json();
        namaEl.textContent = user.name;
        emailEl.textContent = user.email;
    } catch (error) {
        console.error("Gagal memuat profil penulis dari API:", error);
        namaEl.textContent = "Gagal memuat (offline)";
        emailEl.textContent = "Gagal memuat (offline)";
    }
}
muatProfilPenulis();


/* ==========================================================================
— DRAFT KOMENTAR DENGAN SESSIONSTORAGE
   ========================================================================== */

function simpanDraftKomentar() {
    try {
        const draft = {
            nama: inputNama ? inputNama.value : "",
            pesan: inputPesan ? inputPesan.value : ""
        };
        sessionStorage.setItem("draftKomentar", JSON.stringify(draft));
    } catch (e) {
        console.error("Gagal menyimpan draft komentar ke sessionStorage:", e);
    }
}

function muatDraftKomentar() {
    try {
        const raw = sessionStorage.getItem("draftKomentar");
        if (raw) {
            const draft = JSON.parse(raw);
            if (inputNama && draft.nama) inputNama.value = draft.nama;
            if (inputPesan && draft.pesan) inputPesan.value = draft.pesan;
        }
    } catch (e) {
        console.error("Gagal memuat draft komentar dari sessionStorage:", e);
    }
}

function hapusDraftKomentar() {
    try {
        sessionStorage.removeItem("draftKomentar");
    } catch (e) {
        console.error("Gagal menghapus draft komentar:", e);
    }
}

if (inputNama) {
    inputNama.addEventListener("input", simpanDraftKomentar);
}
if (inputPesan) {
    inputPesan.addEventListener("input", simpanDraftKomentar);
}
// Pulihkan draft jika ada saat halaman dimuat
muatDraftKomentar();


// Handler Submit Form Komentar
if (formKomentar && daftarKomentar) {
    // Handler Submit Form Komentar (Modul 9 · B.2 POST & Tugas Mandiri 1 PATCH)
    formKomentar.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nama = inputNama ? inputNama.value.trim() : "";
        const pesan = inputPesan ? inputPesan.value.trim() : "";

        // Validasi form (Modul 5)
        if (nama === "" || pesan === "") {
            tampilkanErrorKomentar("Nama dan pesan komentar wajib diisi!");
            return;
        }

        if (nama.length < 3) {
            tampilkanErrorKomentar("Nama harus terdiri dari minimal 3 karakter!");
            if (inputNama) inputNama.focus();
            return;
        }

        if (pesan.length < 5) {
            tampilkanErrorKomentar("Pesan komentar harus terdiri dari minimal 5 karakter!");
            if (inputPesan) inputPesan.focus();
            return;
        }
        sembunyikanErrorKomentar();

        // -----------------------------------------------------------------
        // KASUS 1: MODE EDIT KOMENTAR (PATCH)
        // -----------------------------------------------------------------
        if (modeEditKomentar && idKomentarDiedit) {
            nonaktifkanTombol(btnKirimKomentar, "Menyimpan...");
            try {
                // Kirim pembaruan ke server dengan metode PATCH
                await editKomentarKeServer(idKomentarDiedit, nama, pesan);

                // Perbarui data yang tampil di elemen DOM
                if (elemenKomentarDiedit) {
                    const labelNama = elemenKomentarDiedit.querySelector(".nama-pengirim");
                    const labelPesan = elemenKomentarDiedit.querySelector(".teks-pesan");
                    if (labelNama) labelNama.textContent = nama;
                    if (labelPesan) labelPesan.textContent = pesan;
                }

                // Perbarui penyimpanan lokal di localStorage
                perbaruiKomentarDiStorage(idKomentarDiedit, nama, pesan);

                console.log("Komentar ID " + idKomentarDiedit + " berhasil diperbarui di server via PATCH.");
                batalkanModeEdit();

            } catch (error) {
                // Modul 9 · B.6: Penanganan status error
                tampilkanErrorKomentar("Gagal memperbarui komentar: " + error.message);
                console.error("Gagal edit komentar via PATCH:", error);
            } finally {
                aktifkanKembaliTombol(btnKirimKomentar, modeEditKomentar ? "Perbarui Komentar" : "Kirim Komentar");
            }
            return;
        }

        // -----------------------------------------------------------------
        // KASUS 2: MODE TAMBAH KOMENTAR BARU (POST)
        // -----------------------------------------------------------------
        nonaktifkanTombol(btnKirimKomentar, "Mengirim...");
        try {
            const hasil = await kirimKomentarKeServer(nama, pesan);
            const idServer = hasil && hasil.id ? hasil.id : Date.now();

            // Modul 9 · B.3: Render ke DOM dengan menyimpan dataset.id dari server
            const itemKomentar = buatElemenKomentar(nama, pesan, idServer);
            daftarKomentar.appendChild(itemKomentar);

            // Simpan ke localStorage dengan ID server
            simpanKomentar(nama, pesan, idServer);

            // Bersihkan kolom form dan draft sessionStorage
            formKomentar.reset();
            hapusDraftKomentar();
            console.log("Komentar berhasil tersimpan di server dengan ID:", idServer);

        } catch (error) {
            // Modul 9 · B.6: Pesan error terstruktur
            tampilkanErrorKomentar("Gagal mengirim komentar: " + error.message);
            console.error("Gagal mengirim komentar via POST:", error);
        } finally {
            aktifkanKembaliTombol(btnKirimKomentar, "Kirim Komentar");
        }
    });

    // Event delegation klik pada daftar komentar 

    daftarKomentar.addEventListener("click", async (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        //  A: KLIK TOMBOL EDIT
        if (target.classList.contains("btn-edit-komentar")) {
            const li = target.closest("li");
            if (!li) return;

            const id = li.dataset.id;
            const nama = li.querySelector(".nama-pengirim") ? li.querySelector(".nama-pengirim").textContent : "";
            const pesan = li.querySelector(".teks-pesan") ? li.querySelector(".teks-pesan").textContent : "";

            // Jika item ini sedang diedit lalu tombol edit diklik lagi, batalkan mode edit
            if (modeEditKomentar && String(idKomentarDiedit) === String(id)) {
                batalkanModeEdit();
                return;
            }

            // Aktifkan mode edit
            modeEditKomentar = true;
            idKomentarDiedit = id;
            elemenKomentarDiedit = li;

            if (inputNama) inputNama.value = nama;
            if (inputPesan) inputPesan.value = pesan;

            if (btnKirimKomentar) btnKirimKomentar.textContent = "Perbarui Komentar";
            if (btnBatalEdit) btnBatalEdit.classList.remove("tersembunyi");

            if (inputPesan) inputPesan.focus();
            formKomentar.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        //  B: KLIK TOMBOL HAPUS 
        if (target.classList.contains("btn-hapus-komentar")) {
            const li = target.closest("li");
            if (!li) return;

            const id = li.dataset.id;

            nonaktifkanTombol(target, "Menghapus...");

            try {
                if (id) {
                    await hapusKomentarDariServer(id);
                }

                if (modeEditKomentar && String(idKomentarDiedit) === String(id)) {
                    batalkanModeEdit();
                }

                if (id) {
                    hapusKomentarDariStorage(id);
                }

                li.remove();
                sembunyikanErrorKomentar();
                console.log("Komentar ID " + id + " berhasil dihapus dari server dan DOM.");

            } catch (error) {
                tampilkanErrorKomentar("Gagal menghapus komentar: " + error.message);
                console.error("Gagal menghapus komentar via DELETE:", error);
                aktifkanKembaliTombol(target, "Hapus");
            }
        }
    });

    // Tombol "Hapus semua komentar"
    if (btnHapusSemuaKomentar) {
        btnHapusSemuaKomentar.addEventListener("click", () => {
            if (daftarKomentar.children.length === 0) {
                tampilkanErrorKomentar("Tidak ada komentar untuk dihapus.");
                return;
            }
            daftarKomentar.innerHTML = "";
            try {
                localStorage.removeItem("komentar");
            } catch (err) {
                console.error("Gagal menghapus komentar dari localStorage:", err);
            }
            batalkanModeEdit();
            sembunyikanErrorKomentar();
        });
    }
}


/* ==========================================================================
   KEYBOARD SHORTCUT DARK MODE ("d")
   ========================================================================== */

document.addEventListener("keydown", (e) => {
    const tagAktif = document.activeElement ? document.activeElement.tagName.toUpperCase() : "";
    if (tagAktif === "INPUT" || tagAktif === "TEXTAREA") {
        return;
    }

    if (e.key.toLowerCase() === "d") {
        toggleTema();
    }
});


/* ==========================================================================
   VALIDASI FORM CUSTOM VALIDITY & PENDAFTARAN
   ========================================================================== */
if (inputNama) {
    inputNama.addEventListener("input", () => {
        if (inputNama.validity.valueMissing) {
            inputNama.setCustomValidity("Nama wajib diisi");
        } else if (inputNama.validity.tooShort) {
            inputNama.setCustomValidity("Nama minimal 3 karakter");
        } else {
            inputNama.setCustomValidity("");
        }
    });
}

if (inputPesan) {
    inputPesan.addEventListener("input", () => {
        if (inputPesan.validity.valueMissing) {
            inputPesan.setCustomValidity("Komentar wajib diisi");
        } else if (inputPesan.validity.tooShort) {
            inputPesan.setCustomValidity("Komentar minimal 5 karakter");
        } else {
            inputPesan.setCustomValidity("");
        }
    });
}

/* ==========================================================================
   MODUL 7 · TOMBOL RESET SELURUH DATA TERSIMPAN
   ========================================================================== */

const tombolReset = document.querySelector("#btn-reset");
if (tombolReset) {
    tombolReset.addEventListener("click", () => {
        const konfirmasi = confirm("Hapus semua data tersimpan (tema, like, komentar)?");
        if (konfirmasi) {
            try {
                localStorage.clear();
                sessionStorage.clear();
            } catch (e) {
                console.error("Gagal menghapus storage:", e);
            }
            location.reload(); // Tampilan kembali ke kondisi awal
        }
    });
}


/* ==========================================================================
   TOMBOL KEMBALI KE ATAS
   ========================================================================== */

const btnKembaliKeAtas = document.querySelector("#btn-kembali-ke-atas");
if (btnKembaliKeAtas) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            btnKembaliKeAtas.classList.remove("tersembunyi");
        } else {
            btnKembaliKeAtas.classList.add("tersembunyi");
        }
    });

    btnKembaliKeAtas.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}