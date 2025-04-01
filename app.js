
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, sendSignInLinkToEmail } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAvftZrnYFmAzbyAAFnrsxKpdT6HxSek-Q",
    authDomain: "send-otp-b5aa7.firebaseapp.com",
    projectId: "send-otp-b5aa7",
    storageBucket: "send-otp-b5aa7.firebasestorage.app",
    messagingSenderId: "48477865506",
    appId: "1:48477865506:web:ca783a24396608ac84ac7b"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();


window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    'size': 'normal',
    'callback': (response) => {
        console.log("reCAPTCHA verified!");
    },
    'expired-callback': () => {
        console.log("reCAPTCHA expired. Please refresh.");
    }
});


document.getElementById("send-otp").addEventListener("click", () => {
    const phoneNumber = document.getElementById("phone-number").value;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            alert("OTP sent successfully!");
        })
        .catch((error) => {
            console.error("Error sending OTP:", error);
        });
});


document.getElementById("verify-otp").addEventListener("click", () => {
    const otp = document.getElementById("otp").value;

    window.confirmationResult.confirm(otp)
        .then((result) => {
            document.getElementById("otp-status").innerText = "Phone verification successful!";
        })
        .catch((error) => {
            document.getElementById("otp-status").innerText = "Invalid OTP. Try again.";
            console.error("Error verifying OTP:", error);
        });
});


document.getElementById("send-email-otp").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const actionCodeSettings = {
        url: "https://yourwebsite.com", // Redirect after verification
        handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem("emailForSignIn", email);
            document.getElementById("email-status").innerText = "Verification email sent. Check your inbox!";
        })
        .catch((error) => {
            console.error("Error sending email verification:", error);
        });
});
