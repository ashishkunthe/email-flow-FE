import { Handle, Position, NodeProps } from "reactflow";

const WaitNode = ({ data, id }: NodeProps) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 w-56">
      <Handle type="target" position={Position.Top} />
      <div className="text-sm font-semibold mb-2">⏱️ Wait</div>

      <input
        type="number"
        placeholder="Delay (hours)"
        className="w-full text-sm px-2 py-1 border rounded"
        value={data.delay || ""}
        onChange={(e) => data.onChange("delay", e.target.value)}
      />

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default WaitNode;
