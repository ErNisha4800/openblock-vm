class TelloProcessor {
    initialize () {
        this.queue = []; // command queue

        this.client = new WebSocket('ws://192.168.10.1:8889'); // Adjust the IP address and port accordingly

        this.client.onopen = () => {
            console.log('Client connected');
            this.send('command');
        };

        this.client.onmessage = (event) => {
            const readableMessage = event.data;
            
            // Previous command executed
            if (readableMessage === 'ok') {
                this.executing = false;

                if (this.executingCommand === 'takeoff') this.flying = true;
                if (this.executingCommand === 'land') this.flying = false;

                // Dequeue
                this.queue.shift();

                // Send next element
                this.inquire();
            } else if (readableMessage.includes('error')) {
                this.executing = false;
                this.flying = false;

                // Dequeue
                this.queue.shift();

                // Send next element
                this.inquire();
            }
        };
    }
    
    request (cmd) {
        // Enqueue
        this.queue.push(cmd);

        this.inquire();
    }

    state () {
        return this.data;
    }

    // If executing command is nothing and waiting queue has some element, send first command to Tello
    inquire () {
        if (!this.executing && this.queue.length > 0) {
            this.send(this.queue[0]);
        }
    }

    send (cmd) {
        // While grounding, command, mon, mdirection 2 and takeoff are only executable
        if (!this.flying && cmd !== 'command' && cmd !== 'mon' && cmd !== 'mdirection 2' && cmd !== 'takeoff') {
            this.queue.shift();
            return;
        }
        this.executing = true;
        this.executingCommand = cmd;
        this.client.send(cmd);
    }

    resetQueue () {
        this.queue = [];
        this.flying = false;
        this.executing = false;
    }
}

module.exports = TelloProcessor;