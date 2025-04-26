class Game {
    constructor() {
        this.dog = document.getElementById('dog');
        this.sheep = document.getElementById('sheep');
        this.container = document.querySelector('.pen-container');
        
        // Initialize positions
        this.dogPos = { x: 0, y: 0 };
        this.sheepPos = { x: 0, y: 0 };
        this.sheepVelocity = { x: 0, y: 0 };
        
        // Set initial sheep position
        this.resetSheepPosition();
        
        // Bind event handlers
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.updateSheepPosition = this.updateSheepPosition.bind(this);
        
        // Add event listeners
        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        
        // Start the game loop
        this.gameLoop();
    }
    
    resetSheepPosition() {
        const padding = 30;
        this.sheepPos = {
            x: padding + Math.random() * (this.container.clientWidth - padding * 2),
            y: padding + Math.random() * (this.container.clientHeight - padding * 2)
        };
        this.updateSheepElement();
    }
    
    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.dogPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        this.updateDogElement();
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const rect = this.container.getBoundingClientRect();
        const touch = e.touches[0];
        this.dogPos = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        this.updateDogElement();
    }
    
    updateDogElement() {
        // Constrain dog position to container bounds
        this.dogPos.x = Math.max(0, Math.min(this.dogPos.x, this.container.clientWidth));
        this.dogPos.y = Math.max(0, Math.min(this.dogPos.y, this.container.clientHeight));
        
        const angle = Math.atan2(
            this.dogPos.y - this.container.clientHeight / 2,
            this.dogPos.x - this.container.clientWidth / 2
        );
        
        this.dog.style.left = `${this.dogPos.x}px`;
        this.dog.style.top = `${this.dogPos.y}px`;
        this.dog.style.transform = `translate(-50%, -50%) rotate(${angle + Math.PI / 2}rad)`;
    }
    
    updateSheepPosition() {
        // Random movement
        if (Math.random() < 0.02) {
            this.sheepVelocity = {
                x: (Math.random() - 0.5) * 4,
                y: (Math.random() - 0.5) * 4
            };
        }
        
        // Update position
        this.sheepPos.x += this.sheepVelocity.x;
        this.sheepPos.y += this.sheepVelocity.y;
        
        // Fence boundaries (adding padding for the fence)
        const padding = 30;
        
        if (this.sheepPos.x < padding) {
            this.sheepVelocity.x *= -1;
            this.sheepPos.x = padding;
        } else if (this.sheepPos.x > this.container.clientWidth - padding) {
            // Allow passing through the gate on the right side
            if (this.sheepPos.y < this.container.clientHeight * 0.7) {
                this.sheepVelocity.x *= -1;
                this.sheepPos.x = this.container.clientWidth - padding;
            }
        }
        
        if (this.sheepPos.y < padding) {
            this.sheepVelocity.y *= -1;
            this.sheepPos.y = padding;
        } else if (this.sheepPos.y > this.container.clientHeight - padding) {
            this.sheepVelocity.y *= -1;
            this.sheepPos.y = this.container.clientHeight - padding;
        }
        
        this.updateSheepElement();
    }
    
    updateSheepElement() {
        this.sheep.style.left = `${this.sheepPos.x}px`;
        this.sheep.style.top = `${this.sheepPos.y}px`;
    }
    
    gameLoop() {
        this.updateSheepPosition();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the window loads
window.addEventListener('load', () => {
    new Game();
});