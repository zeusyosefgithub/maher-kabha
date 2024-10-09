
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DraggableCells = () => {
  // Initial state of cells
  const [cells, setCells] = useState([
    { id: '1', content: 'Cell 1' },
    { id: '2', content: 'Cell 2' },
    { id: '3', content: 'Cell 3' },
    { id: '4', content: 'Cell 4' },
  ]);

  // Function to handle drag and drop result
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If the destination is null (e.g., outside droppable), do nothing
    if (!destination) return;

    // Reordering the cells array
    const reorderedCells = Array.from(cells);
    const [removed] = reorderedCells.splice(source.index, 1);
    reorderedCells.splice(destination.index, 0, removed);

    // Updating state with reordered cells
    setCells(reorderedCells);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided) => (
          <div
            className="cell-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ display: 'flex', padding: '10px', backgroundColor: '#f8f8f8' }}
          >
            {cells.map((cell, index) => (
              <Draggable key={cell.id} draggableId={cell.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: 'none',
                      padding: 20,
                      margin: '0 10px',
                      backgroundColor: '#add8e6',
                      borderRadius: '4px',
                      ...provided.draggableProps.style,
                    }}
                  >
                    {cell.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableCells;
