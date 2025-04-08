// ...all your existing imports
import { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import ColdEmailNode from "./components/node/ColdEmailNode";
import Sidebar from "./components/Sidebar";
import WaitNode from "./components/node/WaitNode";
import LeadSourceNode from "./components/node/LeadSourceNode";

const nodeTypes = {
  coldEmail: ColdEmailNode,
  wait: WaitNode,
  leadSource: LeadSourceNode,
};

const App = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeInputChange = (id: string, field: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                [field]: value,
                onChange: node.data.onChange,
              },
            }
          : node
      )
    );
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowInstance.current) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const position = reactFlowInstance.current.project({
        x: event.clientX - (bounds?.left || 0),
        y: event.clientY - (bounds?.top || 0),
      });

      const id = `${+new Date()}`;
      const newNode = {
        id,
        type,
        position,
        data: {
          subject: "",
          text: "",
          email: "",
          delay: "",
          onChange: (field: string, value: string) =>
            handleNodeInputChange(id, field, value),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const saveFlow = () => {
    const flow = { nodes, edges };
    localStorage.setItem("email-flow", JSON.stringify(flow));
    alert("Flow saved to localStorage!");
  };

  const loadFlow = () => {
    const flow = localStorage.getItem("email-flow");
    if (flow) {
      const parsed = JSON.parse(flow);
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
    } else {
      alert("No saved flow found.");
    }
  };

  // ✅ START FLOW FUNCTION HERE
  const startFlow = async () => {
    if (!nodes.length || !edges.length) {
      alert("Please create a flow first!");
      return;
    }

    const nextNodeMap = new Map<string, string[]>();
    edges.forEach((edge) => {
      if (!nextNodeMap.has(edge.source)) {
        nextNodeMap.set(edge.source, []);
      }
      nextNodeMap.get(edge.source)!.push(edge.target);
    });

    const visited = new Set();
    const queue: { nodeId: string; delay: number }[] = [];

    const startNode = nodes.find((n) => n.type === "leadSource");
    if (!startNode) {
      alert("No lead source node found!");
      return;
    }

    const recipientEmail = startNode.data?.email;
    if (!recipientEmail) {
      alert("Please enter a recipient email in the Lead Source node.");
      return;
    }

    queue.push({ nodeId: startNode.id, delay: 0 });

    while (queue.length) {
      const { nodeId, delay } = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      if (node.type === "coldEmail") {
        const { subject, text } = node.data;

        try {
          await fetch("http://localhost:5000/api/schedule-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: recipientEmail,
              subject,
              text,
              delayInMinutes: delay,
            }),
          });
        } catch (error) {
          console.error("Failed to schedule email:", error);
        }
      }

      const nextIds = nextNodeMap.get(nodeId) || [];
      for (const nextId of nextIds) {
        const nextNode = nodes.find((n) => n.id === nextId);
        if (!nextNode) continue;

        let addedDelay = 0;
        if (nextNode.type === "wait") {
          const waitDuration = parseFloat(nextNode.data?.delay || "0");
          const waitInMinutes = isNaN(waitDuration) ? 0 : waitDuration * 60;
          addedDelay += waitInMinutes;

          const nextOfWait = nextNodeMap.get(nextNode.id) || [];
          for (const nextNext of nextOfWait) {
            queue.push({ nodeId: nextNext, delay: delay + addedDelay });
          }
        } else {
          queue.push({ nodeId: nextId, delay });
        }
      }
    }

    alert("Email flow started and scheduled!");
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <div className="absolute top-4 left-4 z-10 space-x-2">
          <button
            onClick={saveFlow}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            💾 Save Flow
          </button>
          <button
            onClick={loadFlow}
            className="bg-green-500 text-white px-4 py-2 rounded shadow"
          >
            📥 Load Flow
          </button>
          <button
            onClick={startFlow}
            className="bg-purple-600 text-white px-4 py-2 rounded shadow"
          >
            🚀 Start Flow
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onInit={(rfi) => (reactFlowInstance.current = rfi)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default App;
