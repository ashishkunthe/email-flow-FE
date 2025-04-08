import { memo } from "react";
import { Handle, Position } from "reactflow";

const LeadSourceNode = ({ data }: any) => {
  return (
    <div className="bg-white p-4 rounded shadow w-64 border">
      <strong>Lead Source</strong>
      <div className="mt-2">
        <label className="text-sm">Recipient Email:</label>
        <input
          type="email"
          value={data.email || ""}
          onChange={(e) => data.onChange("email", e.target.value)}
          placeholder="user@example.com"
          className="w-full border px-2 py-1 rounded mt-1"
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(LeadSourceNode);
