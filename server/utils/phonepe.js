import crypto from "crypto";

export const generateChecksum = (payload, saltKey, saltIndex) => {
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const stringToSign = base64Payload + "/pg/v1/pay" + saltKey;

  const sha256 = crypto.createHash("sha256").update(stringToSign).digest("hex");

  return {
    base64Payload,
    checksum: `${sha256}###${saltIndex}`,
  };
};

export const verifyChecksum = (payload, saltKey) => {
  const decodedPayload = Buffer.from(payload.response, "base64").toString(
    "utf-8",
  );
  const parsed = JSON.parse(decodedPayload);

  const stringToSign =
    payload.response +
    "/pg/v1/status/" +
    parsed.merchantId +
    "/" +
    parsed.transactionId +
    saltKey;

  const sha256 = crypto.createHash("sha256").update(stringToSign).digest("hex");

  return sha256 === payload.checksum;
};
