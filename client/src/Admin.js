import React, { Component } from 'react';
import axios from 'axios';

class Admin extends Component {
    state = {
        seenIndices: []
    };

    componentDidMount() {
        this.fetchSeenIndices();
    }

    async fetchSeenIndices() {
        const seenIndices = await axios.get('/api/values/all');
        this.setState({ seenIndices: seenIndices.data });
    }

    renderSeenIndicesCount() {
        return this.state.seenIndices.length;
    }

    render() {
        return (
            <div>
                <div>
                    <h3>Calculated indices count:</h3>
                    {this.renderSeenIndicesCount()}
                </div>
                <button onClick={this.handleReset}>Reset DB</button>
            </div>
        );
    }

    handleReset = async (event) => {
        event.preventDefault();

        await axios.post('/api/reset', {});

        this.fetchSeenIndices();
   }

}


export default Admin;
