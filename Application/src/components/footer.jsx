/* footer component */
import React, { Component } from 'react';
import '../styles/footer.css';

export default class footer extends Component {
    render() {
        return (
            <div className="footer-parent">
                <div className="footer">
                    <p>The 24/7 Uber customer service phone number is: (800) 593-7069 </p>
                </div>
            </div>
        )
    }
}
