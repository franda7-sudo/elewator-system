const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onUserCreated } = require("firebase-functions/v2/auth");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

// ============================================================
// 1. Nadawanie roli użytkownikowi (v2)
// ============================================================
exports.setUserRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
  }

  const callerUid = request.auth.uid;
  const caller = await admin.auth().getUser(callerUid);
  const callerRole = caller.customClaims?.role;

  const allowed = ["admin", "owner", "superuser"];
  if (!allowed.includes(callerRole)) {
    throw new HttpsError("permission-denied", "Brak uprawnień.");
  }

  const { uid, role } = request.data;
  if (!uid || !role) {
    throw new HttpsError("invalid-argument", "Brak uid lub role.");
  }

  await admin.auth().setCustomUserClaims(uid, { role });
  await admin.firestore().collection("users").doc(uid).set({
    role,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return { success: true };
});

// ============================================================
// 2. Automatyczne tworzenie pierwszego superusera (v2)
// ============================================================
exports.ensureAdminExists = onUserCreated(async (event) => {
  const user = event.data;
  const db = admin.firestore();

  const admins = await db.collection("users")
    .where("role", "in", ["admin", "owner", "superuser"])
    .limit(1)
    .get();

  if (admins.empty) {
    await db.collection("users").doc(user.uid).set({
      email: user.email || "",
      name: user.email ? user.email.split("@")[0] : "Superuser",
      role: "superuser",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await admin.auth().setCustomUserClaims(user.uid, { role: "superuser" });
    return;
  }

  await db.collection("users").doc(user.uid).set({
    email: user.email || "",
    role: "user",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
});

// ============================================================
// 3. Logowanie prób wejścia (v2)
// ============================================================
exports.logSecurityEvent = onCall(async (request) => {
  const { type, ip, details } = request.data;

  await admin.firestore().collection("ownerLogs").add({
    type,
    ip,
    details,
    timestamp: Date.now()
  });

  return { success: true };
});

// ============================================================
// 4. Blokada systemu (v2)
// ============================================================
exports.setSystemLock = onCall(async (request) => {
  const callerRole = request.auth?.token?.role;

  if (!["owner", "superuser"].includes(callerRole)) {
    throw new HttpsError("permission-denied", "Brak uprawnień.");
  }

  const { locked, message } = request.data;

  await admin.firestore().collection("settings").doc("system").set({
    locked,
    message,
    updatedAt: Date.now()
  }, { merge: true });

  return { success: true };
});

// ============================================================
// 5. Reset PIN operatora (v2)
// ============================================================
exports.resetOperatorPin = onCall(async (request) => {
  const callerRole = request.auth?.token?.role;

  if (!["admin", "owner", "superuser"].includes(callerRole)) {
    throw new HttpsError("permission-denied", "Brak uprawnień.");
  }

  const { uid, newPin } = request.data;

  await admin.firestore().collection("users").doc(uid).set({
    pin: newPin,
    updatedAt: Date.now()
  }, { merge: true });

  return { success: true };
});
