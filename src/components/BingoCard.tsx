import { useState } from 'react';

interface BingoCardProps {
  bingoCard: { [key: string]: (number | null)[] } | null;
}

export default function BingoCard({ bingoCard }: BingoCardProps) {
  const [selectedCells, setSelectedCells] = useState<{ [key: string]: Set<number> }>({
    B: new Set(),
    I: new Set(),
    N: new Set(),
    G: new Set(),
    O: new Set(),
  });

  if (!bingoCard) return null;

  // Define the fixed column order
  const columnOrder = ['B', 'I', 'N', 'G', 'O'];

  // Handle cell selection and deselection
  const toggleCellSelection = (column: string, index: number) => {
    setSelectedCells((prev) => {
      const newSelection = new Set(prev[column]);
      if (newSelection.has(index)) {
        newSelection.delete(index);
      } else {
        newSelection.add(index);
      }
      return { ...prev, [column]: newSelection };
    });
  };

  // Create array of row indices to help with column-based rendering
  const rowIndices = [0, 1, 2, 3, 4];

  return (
    <div className="bingo-card" style={{ display: 'grid', gap: '10px', textAlign: 'center' }}>
      {/* Column Headers */}
      <div className="bingo-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', fontWeight: 'bold' }}>
        {columnOrder.map((column) => (
          <div key={column} style={{ padding: '10px' }}>
            {column}
          </div>
        ))}
      </div>

      {/* Bingo Card */}
      <div
        className="bingo-body"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '5px',
        }}
      >
        {rowIndices.map((rowIndex) => (
          columnOrder.map((column) => {
            const num = bingoCard[column][rowIndex];
            const isSelected = selectedCells[column].has(rowIndex);
            const isFreeSpace = column === 'N' && rowIndex === 2;
            return (
              <button
                key={`${column}-${rowIndex}`}
                className="bingo-cell"
                onClick={() => !isFreeSpace && toggleCellSelection(column, rowIndex)}
                style={{
                  padding: '20px',
                  backgroundColor: isFreeSpace ? '#FFD700' : isSelected ? '#3498DB' : '#ECF0F1',
                  border: '1px solid #95A5A6',
                  color: isFreeSpace ? '#000' : '#2C3E50',
                  cursor: isFreeSpace ? 'default' : 'pointer',
                  fontWeight: isFreeSpace ? 'bold' : 'normal',
                  borderRadius: '5px',
                }}
                disabled={isFreeSpace}
              >
                {num !== null ? num : 'Free'}
              </button>
            );
          })
        ))}
      </div>
    </div>
  );
}