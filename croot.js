import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.8/api.js';
import { setInner, hide } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.8/element.js';

const BACKEND_URL = "https://charming-tank-nup.sgp.dom.my.id/api/auth/google";

// 1. CEK SESI SAAT HALAMAN DIBUKA
const userSesi = localStorage.getItem("user_data");
if (userSesi) {
    renderUserUI(JSON.parse(userSesi));
}

// 2. CALLBACK SETELAH PILIH AKUN GOOGLE
export function handleGoogleLogin(response) {
    setInner("hasil-login", "<i>Memverifikasi ke Backend...</i>");
    
    const dataKirim = { token: response.credential };
    
    postJSON(BACKEND_URL, dataKirim, (result) => {
        if (result.status === 200) {
            localStorage.setItem("user_data", JSON.stringify(result.data.user));
            renderUserUI(result.data.user);
        } else {
            setInner("hasil-login", `<b style="color:red">Gagal: ${result.data.message || "Token Tidak Valid"}</b>`);
        }
    });
};

window.handleGoogleLogin = handleGoogleLogin;

// 3. FUNGSI TAMPILAN USER
function renderUserUI(user) {
    
    const html = `
        <div class="profile-box">            
            <div class="info-label">Nama</div>
            <div class="info-value">${user.name}</div>
            
            <div class="info-label">Email Terdaftar</div>
            <div class="info-value">${user.email}</div>
                        
            <button id="logout-btn" class="btn-logout">Keluar Aplikasi</button>
        </div>
    `;
    
    setInner("hasil-login", html);
    
    const googleBtn = document.getElementById("btn-google-container");
    if(googleBtn) googleBtn.style.display = "none";

    document.getElementById("logout-btn").onclick = () => {
        // 1. Hapus data lokal
        localStorage.removeItem("user_data");
        
        // 2. Beritahu sistem Google untuk reset sesi otomatis
        if (window.google) {
            google.accounts.id.disableAutoSelect();
        }
        
        // 3. Muat ulang halaman
        location.reload();
    };
}