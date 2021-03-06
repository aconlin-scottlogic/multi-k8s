import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndices: [],
        values: {},
        index: ''
    };

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        this.fetchValues();
        this.fetchSeenIndices();
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({ values: values.data });
    }

    async fetchSeenIndices() {
        const seenIndices = await axios.get('/api/values/all');
        this.setState({ seenIndices: seenIndices.data });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index: </label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button>
                </form>
                <h3>Seen indices:</h3>
                {this.renderSeenIndices()}
                <h3>Calculated values:</h3>
                {this.renderValues()}
            </div>
        );
    }

    renderSeenIndices() {
        return this.state.seenIndices.map(({ number }) => number).join(', ');
    }

    renderValues() {
        const entries = [];

        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    index: {key} -> {this.state.values[key]}
                </div>
            );
        }

        return entries;
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });

        this.setState({ index: '' });

        this.fetchData();
    }
}

export default Fib;
