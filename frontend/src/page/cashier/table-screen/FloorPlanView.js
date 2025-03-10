import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, { Controls, Background } from 'react-flow-renderer';

const FloorPlanView = ({ floorPlanImage, tables, onUpdateTablePosition }) => {
  const [nodes, setNodes] = useState([]);
  console.log(tables);

  useEffect(() => {
    const initialNodes = tables.map((table) => ({
      id: table._id,
      type: 'default',
      data: {
        label: (
          <div>
            <div>
              <strong>{table.table_name}</strong>
            </div>
            <div>Ghế: {table.number_of_chair}</div>
            <div>{table.status ? 'Trống' : 'Có khách'}</div>
          </div>
        ),
        table,
      },
      position: {
        x: table.x || Math.random() * 500,
        y: table.y || Math.random() * 300,
      },
      style: {
        backgroundColor: table.status ? '#dcfce7' : '#fee2e2',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        width: 100,
        cursor: 'pointer',
      },
    }));

    setNodes(initialNodes);
  }, [tables]);

  // 🛠 Gọi props `onUpdateTablePosition` thay vì API trực tiếp
  const onNodeDragStop = useCallback(
    (event, node) => {
      onUpdateTablePosition(node.id, {
        x: Math.round(node.position.x),
        y: Math.round(node.position.y),
      });
    },
    [onUpdateTablePosition]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      const tableData = node.data.table;
      if (tableData) {
        const currentTable = tables.find((t) => t._id === tableData._id);
        if (currentTable) {
          if (window.handleTableClick && typeof window.handleTableClick === 'function') {
            window.handleTableClick(currentTable);
          }
        }
      }
    },
    [tables]
  );

  return (
    <div style={{ height: '80vh', width: '100%', position: 'relative' }}>
      {floorPlanImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            backgroundImage: `url(${floorPlanImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.7,
          }}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={[]}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        nodesDraggable={true}
        elementsSelectable={true}
        zoomOnScroll={true}
        panOnScroll={true}
        style={{ background: 'transparent' }}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default FloorPlanView;
