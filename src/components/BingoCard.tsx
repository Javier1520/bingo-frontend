import { BingoCardInterface } from '../store/types';

interface BingoCardProps {
  bingoCard: BingoCardInterface | null;
}

export default function BingoCard({ bingoCard }: BingoCardProps) {
  if (!bingoCard) return null;

  return (
    <div className="bingo-card" style={{ display: 'grid', gap: '10px', textAlign: 'center' }}>
      {/* Column Headers */}
      <div
        className="bingo-header"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          fontWeight: 'bold'
        }}
      >
        {Object.keys(bingoCard).map((column) => (
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
        {Array.from({ length: 5 }, (_, rowIndex) => (
          Object.keys(bingoCard).map((columnKey) => {
            const column = columnKey as keyof BingoCardInterface;
            const num = bingoCard[column][rowIndex];
            const isFreeSpace = column === 'N' && rowIndex === 2;

            return (
              <button
                key={`${column}-${rowIndex}`}
                className="bingo-cell"
                onClick={(e) => {
                  if (!isFreeSpace) {
                    const button = e.currentTarget;
                    button.style.backgroundColor =
                      button.style.backgroundColor === 'rgb(52, 152, 219)'
                      ? '#ECF0F1'
                      : '#3498DB';
                  }
                }}
                style={{
                  padding: '20px',
                  backgroundColor: isFreeSpace ? '#FFD700' : '#ECF0F1',
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