const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-60 bg-gray-100 p-4 border-r border-gray-300">
      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-move text-center"
        onDragStart={(event) => onDragStart(event, "coldEmail")}
        draggable
      >
        📧 Cold Email
      </div>
      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-move text-center"
        onDragStart={(event) => onDragStart(event, "wait")}
        draggable
      >
        ⏱️ Wait/Delay
      </div>
      <div
        className="p-2 bg-white rounded shadow cursor-move text-center"
        onDragStart={(event) => onDragStart(event, "leadSource")}
        draggable
      >
        🔗 Lead Source
      </div>
    </aside>
  );
};

export default Sidebar;
