const admin = require('firebase-admin');
const sql = require('mssql');

// Initialize Firebase Admin SDK
const serviceAccount = require('../app/best-bazaar-92dd6-7d5e83eb8fe5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// MSSQL Configuration
const dbConfig = {
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "bestbazaar",
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function sendPushNotification(title, body, targetTokens = null) {
  try {
    let tokens = targetTokens;

    // If no specific tokens provided, get all active Android tokens from DB
    if (!tokens) {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query(`
        SELECT fcm_token FROM fcm_tokens
        WHERE platform = 'android' AND is_active = 1
      `);
      tokens = result.recordset.map(row => row.fcm_token);
      await pool.close();
    }

    if (!tokens || tokens.length === 0) {
      console.log('📱 No FCM tokens found');
      return;
    }

    console.log(`📱 Sending notification to ${tokens.length} device(s)`);

    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: tokens,
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default',
        },
      },
    };

    const response = await admin.messaging().sendMulticast(message);

    console.log('📱 Notification sent successfully!');
    console.log(`📱 Success count: ${response.successCount}`);
    console.log(`📱 Failure count: ${response.failureCount}`);

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`📱 Failed token ${idx}:`, resp.error);
        }
      });
    }

  } catch (error) {
    console.error('📱 Error sending notification:', error);
  } finally {
    await sql.close();
  }
}

// Usage examples:
// node scripts/push-test.js "Test Title" "Test Message"
// node scripts/push-test.js "Welcome!" "Welcome to Best Bazaar!" "specific-token-here"

const title = process.argv[2];
const body = process.argv[3];
const specificToken = process.argv[4];

if (!title || !body) {
  console.log('Usage: node scripts/push-test.js "Title" "Body" [optional-specific-token]');
  process.exit(1);
}

sendPushNotification(title, body, specificToken ? [specificToken] : null);
