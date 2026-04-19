import { joinBackupCodes } from "./shared";

export function downloadBackupCodesFile(backupCodes: string[]) {
  const backupCodeBlob = new Blob([joinBackupCodes(backupCodes)], { type: "text/plain;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(backupCodeBlob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "gyeoltare-backup-codes.txt";
  anchor.click();
  URL.revokeObjectURL(downloadUrl);
}

export async function copyBackupCodesToClipboard(backupCodes: string[]) {
  const serializedCodes = joinBackupCodes(backupCodes);

  if ("clipboard" in navigator) {
    await navigator.clipboard.writeText(serializedCodes);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = serializedCodes;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
