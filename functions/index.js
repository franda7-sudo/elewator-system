const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { auth } = require("firebase-functions/v1"); // Importujemy v1 bezpośrednio dla triggera Auth
const admin = require("firebase-admin");

// Inicjalizacja SDK Admina
admin.initializeApp();

// ============================================================
// 1. USTAWIANIE ROLI UŻYTKOWNIKA (Callable Function v2)
// ============================================================
exports.setUserRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Musisz być zalogowany, aby wykonać tę operację."
    );
  }

  try {
    const callerUid = request.auth.uid;
    const caller = await admin.auth().getUser(callerUid);
    const callerRole = caller.customClaims?.role;

    const allowedRoles = ["admin", "owner", "superuser"];
    if (!callerRole || !allowedRoles.includes(callerRole)) {
      throw new HttpsError(
        "permission-denied",
        "Nie masz wystarczających uprawnień."
      );
    }

    const { uid, role } = request.data;
    if (!uid || !role) {
      throw new HttpsError(
        "invalid-argument",
        "Brakujące parametry: 'uid' i 'role'."
      );
    }

    await admin.auth().setCustomUserClaims(uid, { role: role });

    await admin.firestore().collection("users").doc(uid).set({
      role: role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    return { message: `Rola ${role} została nadana.`, success: true };

  } catch (error) {
    console.error("Błąd w setUserRole:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Błąd wewnętrzny serwera.");
  }
});

// ============================================================
// 2. AUTOMATYCZNY PIERWSZY ADMIN (Auth Trigger v1)
// ============================================================
// Zmieniliśmy "functions.auth.user()" na "auth.user()" dzięki nowemu importowi
exports.ensureAdminExists = auth.user().onCreate(async (user) => {
  const db = admin.firestore();

  try {
    const adminsSnapshot = await db.collection("users")
      .where("role", "in", ["admin", "owner", "superuser"])
      .limit(1)
      .get();

    if (adminsSnapshot.empty) {
      console.log(`Tworzenie pierwszego Superusera: ${user.uid}`);

      await db.collection("users").doc(user.uid).set({
        email: user.email || "brak-maila",
        name: user.email ? user.email.split("@")[0] : "Pierwszy Użytkownik",
        role: "superuser",
        active: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      await admin.auth().setCustomUserClaims(user.uid, { role: "superuser" });
      return null;
    }

    await db.collection("users").doc(user.uid).set({
      email: user.email || "",
      role: "user",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return null;

  } catch (error) {
    console.error("Błąd w ensureAdminExists:", error);
    return null;
  }
});