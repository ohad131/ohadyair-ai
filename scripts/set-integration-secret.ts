import "dotenv/config";
import { setIntegrationSecret } from "../server/db";

async function main() {
  const [, , key, value, label] = process.argv;

  if (!key || !value) {
    console.error(
      "Usage: pnpm tsx scripts/set-integration-secret.ts <key> <value> [label]"
    );
    process.exit(1);
  }

  await setIntegrationSecret({
    key,
    value,
    label: label ?? key,
  });

  console.log(
    `Stored secret "${key}"${label ? ` (${label})` : ""} in integrationSecrets table.`
  );
}

main().catch(error => {
  console.error("Failed to store integration secret", error);
  process.exit(1);
});
