import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { adminApi } from "../../api/admin.api";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [jsonInput, setJsonInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number; errors: { email: string; error: string }[] } | null>(null);

  const handleImport = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const users = JSON.parse(jsonInput);
      if (!Array.isArray(users)) throw new Error("Input must be a JSON array");
      const res = await adminApi.bulkCreateUsers(users);
      setResult(res.data);
      if (res.data.created > 0) onSuccess();
    } catch (err) {
      setResult({ created: 0, skipped: 0, errors: [{ email: "", error: err instanceof SyntaxError ? "Invalid JSON format" : (err as Error).message }] });
    } finally {
      setSubmitting(false);
    }
  };

  const sampleUsers = [
    { name: "John Doe", email: "john@example.com", password: "Pass@123", role: "student", course: "COURSE_ID" },
    { name: "Jane Smith", email: "jane@example.com", password: "Pass@123", role: "teacher" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Import Users" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Paste a JSON array of users below. Each user must have <code>name</code>, <code>email</code>, <code>password</code>, and <code>role</code>.
          Students may include <code>course</code> and <code>batch</code>.
        </p>

        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700">Show sample format</summary>
          <pre className="mt-2 p-2 bg-gray-50 rounded overflow-x-auto">{JSON.stringify(sampleUsers, null, 2)}</pre>
        </details>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='[{ "name": "...", "email": "...", "password": "...", "role": "student" }]'
          className="w-full h-48 px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          spellCheck={false}
        />

        {result && (
          <div className={`px-4 py-3 rounded-lg text-sm ${result.errors.length > 0 ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            <p>Created: {result.created} | Skipped: {result.skipped} | Errors: {result.errors.length}</p>
            {result.errors.length > 0 && (
              <ul className="mt-2 list-disc pl-4 space-y-1">
                {result.errors.map((e, i) => (
                  <li key={i}><strong>{e.email || "N/A"}:</strong> {e.error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleImport} isLoading={submitting} disabled={!jsonInput.trim()}>Import Users</Button>
          <Button variant="ghost" onClick={() => { setJsonInput(""); setResult(null); }}>Clear</Button>
        </div>
      </div>
    </Modal>
  );
};
