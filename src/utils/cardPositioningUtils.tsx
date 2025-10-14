export function calculateDetailCardSize(titleCardWidth:number) {
    const cardCanvas = document.getElementById('card-canvas');
    
    if (!cardCanvas) {
        return { width: 550, height: 600 }; // Default to max size
    }

    const canvasRect = cardCanvas.getBoundingClientRect();
    
    // Constants
    const MAX_WIDTH = 550;
    const MAX_HEIGHT = 600;
    const MIN_WIDTH = 250;
    const MIN_HEIGHT = 300;
    const GAP = 25;
    
    // Calculate space needed for title cards
    const titleCardsWidth = titleCardWidth; // 300px
    const titleCardsRightEdge = 50 + titleCardsWidth; // x position + width
    
    // Available space for detail card
    const availableWidth = canvasRect.width - titleCardsRightEdge - GAP - 50; // 50px margin from right edge
    const availableHeight = canvasRect.height - 100; // Some top/bottom margin
    
    // Calculate actual dimensions
    const width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, availableWidth));
    const height = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, availableHeight));
    
    return { width, height };
}

export function calculateDetailCardPosition(titleCardWidth:number, yPos:number, cardSize: { width: number; height: number }) {
    const cardCanvas = document.getElementById('card-canvas');
    
    if (!cardCanvas) {
        return { x: 0, y: 0 };
    }

    const canvasRect = cardCanvas.getBoundingClientRect();
    
    const GAP = 25;
    const titleCardsRightEdge = 50 + titleCardWidth; // x position + width
    
    
    // Check if detail card can fit to the right of title cards at full width
    const spaceForDetailCard = canvasRect.width - titleCardsRightEdge - GAP - 50; // 50px margin from right
    const canFitToRight = spaceForDetailCard >= 550; // MAX_WIDTH
    
    let x: number;
    let y: number;
    
    if (canFitToRight) {
        // Position to the right of title cards
        x = titleCardsRightEdge + GAP;
        // Center vertically relative to title cards' span
        y = yPos - (cardSize.height / 2);
    } else {
        // Center on canvas
        x = (canvasRect.width - cardSize.width);
        y = (canvasRect.height - cardSize.height) / 2;
    }
    
    return { x, y };
}