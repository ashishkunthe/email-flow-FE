import { Handle, Position, NodeProps } from "reactflow";

const ColdEmailNode = ({ data, id }: NodeProps) => {
  return (
    <div
      className="bg-white border border-gray-300 rounded-lg shadow-md p-4 w-64"
      style={{ pointerEvents: "all" }} // ensures inputs work
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-sm font-semibold mb-2">📧 Cold Email</div>

      <input
        type="text"
        placeholder="Subject"
        className="w-full text-sm mb-2 px-2 py-1 border rounded"
        value={data.subject || ""}
        onChange={(e) => data.onChange("subject", e.target.value)}
      />

      <textarea
        placeholder="Message"
        className="w-full text-sm px-2 py-1 border rounded"
        value={data.text || ""}
        onChange={(e) => data.onChange("text", e.target.value)}
      />

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ColdEmailNode;
