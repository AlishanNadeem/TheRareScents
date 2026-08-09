// Creates (or updates) an admin user in MongoDB Atlas.
// Run with: npm run create-admin
//
// Interactive (prompts for email + password):
//   npm run create-admin
//
// Non-interactive:
//   npm run create-admin -- --email you@example.com --password 'your-password'
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run create-admin

require("dotenv").config({ path: ".env.local" });
const readline = require("readline");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const AdminUser = require("../models/AdminUser");

const BCRYPT_ROUNDS = 12;

function parseArgs(argv) {
  const args = { email: null, password: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--email" || arg === "-e") {
      args.email = argv[i + 1];
      i += 1;
    } else if (arg === "--password" || arg === "-p") {
      args.password = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function ask(question, { silent = false } = {}) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    if (!silent) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
      return;
    }

    // Mute password echo on TTYs that support it.
    const onData = (char) => {
      const value = char.toString();
      switch (value) {
        case "\n":
        case "\r":
        case "\u0004":
          process.stdin.removeListener("data", onData);
          break;
        default:
          process.stdout.clearLine?.(0);
          process.stdout.cursorTo?.(0);
          process.stdout.write(question + "*".repeat(rl.line.length));
          break;
      }
    };

    process.stdin.on("data", onData);
    rl.question(question, (answer) => {
      process.stdin.removeListener("data", onData);
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "Missing MONGODB_URI. Copy .env.example to .env.local and fill in your MongoDB Atlas connection string."
    );
    process.exit(1);
  }

  const cli = parseArgs(process.argv.slice(2));
  let email = (cli.email || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  let password = cli.password || process.env.ADMIN_PASSWORD || "";

  if (!email) {
    email = (await ask("Admin email: ")).trim().toLowerCase();
  }
  if (!password) {
    password = await ask("Admin password (min 8 characters): ", {
      silent: true,
    });
  }

  if (!isValidEmail(email)) {
    console.error("Invalid email address.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);

  const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const existing = await AdminUser.findOne({ email });

  if (existing) {
    existing.password_hash = password_hash;
    await existing.save();
    console.log(`Updated password for existing admin: ${email}`);
  } else {
    await AdminUser.create({ email, password_hash });
    console.log(`Created admin user: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

createAdmin().catch((error) => {
  console.error("create-admin failed:", error);
  process.exit(1);
});
